import { InterfaceMap, setLayerFromDB, setCurrentLayer, removeLayer } from './map/map.js';
import ModalForm from './modalform/modalform.js';
import React from 'react';
import ReactDom from 'react-dom';

import { ControlLayer } from './controlLayer/controlLayer.js';
import { getUser } from './users.js';

import pubsub from './src/pubsub.js';

let SetterStyle = function(opacity, _color) {
	let _acceptor;

	this.color = function() {
		return _color;
	}()

	this.currentOpacity = function() {
		return opacity;
	}();

	this.setAcceptor = function(acceptor) {
		acceptor(opacity);
		this._acceptor = acceptor;
	}

	this.setOpacity = function(value) {
		opacity = value;
		this._acceptor(value);
	}
}

let requestToDB = function(jsonbody, onreadystatechange) {
	let xhr = new XMLHttpRequest();
	xhr.open('POST', '/db', true);
	xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
	if(onreadystatechange)
		xhr.onreadystatechange = () => { 
			if(xhr.readyState != 4) return;
			onreadystatechange(xhr); 
		}
	xhr.send(JSON.stringify(jsonbody));
}

let loadLayer = function(layer, afterSetInMap) {
	requestToDB(
			{ 	
				action: 'select', 
				layer: layer.nameTable 
			},
			function(xhr) {
		  		let response = JSON.parse(xhr.response);
		  		setLayerFromDB(response, layer.setterStyle, layer.nameMap);
		  		if(afterSetInMap)
		  			afterSetInMap(layer);
			}
		);
}

let xhr = new XMLHttpRequest();
xhr.open("POST", '/user', true);
xhr.onreadystatechange = function() { 
	if(xhr.readyState!= 4) return;
	setRole(getUser(xhr.response));
}
xhr.send();

const ControllerLayers = {
	currentLayer: null,

	layers:  [
		{ name:'Слой №1', nameTable: 'layer_1', nameMap: 'layer_1', setterStyle: new SetterStyle(0.7, '#aaf'), current: true },
		{ name:'Слой №2', nameTable: 'layer_2', nameMap: 'layer_2', setterStyle: new SetterStyle(0.7, '#faf'), current: false }
	],

	setCheck(key) {
		this.currentLayer = this.layers[key];
		setCurrentLayer(this.currentLayer.nameMap, x => loadLayer(this.currentLayer, x));
		pubsub.publish('setCheck_controlsLayer', key);
	},
}

pubsub.subscribe('changeVisibleLayer', x => {  
	let layer = ControllerLayers.layers[x.key];
	if(!x.visible)
		removeLayer(layer.nameMap);
	else
		loadLayer(layer);
});

ControllerLayers.layers.forEach( layer => {
	loadLayer(layer, () => {
		if(layer.current) ControllerLayers.setCheck(ControllerLayers.layers.indexOf(layer));
	})
});

let setRole = function(user) {

	InterfaceMap.setRole(user);

	pubsub.subscribe('dblClick_controlsLayer', x => ControllerLayers.setCheck(x));
	let controlsLayer =  ControllerLayers.layers.map((x, i) => 
		<ControlLayer key={i} name={x.name} idKey={i} setterStyle={x.setterStyle} user={user} pubsub={pubsub}/>
	);
	
	ReactDom.render(
		<div>
			{ controlsLayer }
	  	</div>,
	  	document.getElementById('toolbar-right')
	);
};


let controller = {
	inputedShape: null,

	addObj(x) { 
		InterfaceMap.setInMap(this.inputedShape, x);

		let jsonbody = {
			action: 'insert',
			body: {
				layer: ControllerLayers.currentLayer.nameTable,
				geom: this.inputedShape.toGeoJSON(),
				name: x.data.name
			}
		}
		requestToDB(jsonbody);
	},

	listenMapInsert(inputedShape, insertInMap) {
		this.inputedShape = inputedShape;
		ModalForm.show(this.addObj.bind(this));
	},

	listenMapUpdate(layers) {
		let convert = x => { return {
			layer: ControllerLayers.currentLayer.nameTable,
			id: x.idObj,
			geom: x.toGeoJSON()
		} }

		let jsonbody = {
			action: 'update',
			body: layers.map(convert)
		}

		requestToDB(jsonbody);
	},

	listenMapDelete(layers) {
		let convert = x => { return {
			layer: ControllerLayers.currentLayer.nameTable,
			id: x.idObj,
		} }

		let jsonbody = {
			action: 'delete',
			body: layers.map(convert)
		}
		requestToDB(jsonbody);
	}
}

const axts = [
	['input', 'listenMapInsert'],
	['update', 'listenMapUpdate'],
	['delete', 'listenMapDelete']
].forEach(x => InterfaceMap.setListener(x[0], controller[x[1]].bind(controller)));
