import { CityMap, setLayerFromDB, setCurrentLayer, removeLayer } from './map/map.js';
import ModalForm from './modalform/modalform.js';
import React from 'react';
import ReactDom from 'react-dom';

import { ControlLayer } from './controlLayer/controlLayer.js';
import { getUser } from './auth/roles.js';

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

let request = function(typeReq, url, body) {
	return new Promise((resolve, reject) => {
		let xhr = new XMLHttpRequest();
		xhr.open(typeReq, url, true);
		xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
		xhr.onload = function() {
			if (200 <= this.status && this.status < 300) {
				if(this.response === 'OK') return;
				resolve(JSON.parse(this.response));
		    } else {
		    	console.log('err');
		        var error = new Error(this.statusText);
		        error.code = this.status;
		        reject(error);
		    }
		}
		xhr.send(JSON.stringify(body));
	});
}

let requestToDB = function(body, onreadystatechange) {
	request('POST', '/db', body)
	.then(onreadystatechange);
}

let loadLayer = function(layer, afterSetInMap) {
	let body = { 	
		action: 'select', 
		layer: layer.nameTable 
	};
	requestToDB(body, x => {
		setLayerFromDB(x, layer.setterStyle, layer.nameMap);
		if(afterSetInMap)
		  	afterSetInMap(layer);
	});
}

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

request('POST', '/user')
	.then(x => setRole(getUser(x)));

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
	CityMap.setRole(user);

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
	listenMapInsert(inputedShape, insertInMap) {
		let res;
		ModalForm.showForm()
		.then(x => { 
			let body = {
				action: 'insert',
				body: {
					layer: ControllerLayers.currentLayer.nameTable,
					geom: inputedShape.toGeoJSON(),
					name: x.data.name
				}
			};
			res = x;
			return request('POST', '/db', body);
		})
		.then(y => {
			console.log(y);
			inputedShape.idObj = y[0].id;
			insertInMap(inputedShape, res);
		});
	},

	createBody: function(name, layers,  convert) {
		return {
			action: name,
			body: layers.map(convert)
		}
	},


	listenMapUpdate(layers) {
		let convert = x => { return {
			layer: ControllerLayers.currentLayer.nameTable,
			id: x.idObj,
			geom: x.toGeoJSON()
		} }
		
		requestToDB(this.createBody('update', layers, convert));
	},

	listenMapDelete(layers) {
		let convert = x => { return {
			layer: ControllerLayers.currentLayer.nameTable,
			id: x.idObj,
		} }

		requestToDB(this.createBody('delete', layers, convert));
	}
}

const actions = [
	['input', 'listenMapInsert'],
	['update', 'listenMapUpdate'],
	['delete', 'listenMapDelete']
].forEach(x => CityMap.setListener(x[0], controller[x[1]].bind(controller)));
