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
	};

	this.setOpacity = function(value) {
		opacity = value;
		this._acceptor(value);
	};
}

let role;

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
		        var error = new Error(this.statusText);
		        error.code = this.status;
		        reject(error);
		    }
		}
		xhr.send(JSON.stringify(body));
	});
}

let requestToDB = function(body) {
	return request('POST', '/db', body)
}

let loadLayer = function(layer, afterSetInMap) {
	let body = { 	
		action: 'select', 
		layer: layer.nameTable,
	};
	requestToDB(body)
		.then( x => {
			setLayerFromDB(x, layer.setterStyle, layer.nameTable);
			if(afterSetInMap)
			  	afterSetInMap(layer);
		});
}

const ControllerLayers = {
	currentLayer: null,

	layers:  [
		{ name:'Слой №1', nameTable: 'layer_1', setterStyle: new SetterStyle(0.7, '#aaf'), current: true },
		{ name:'Слой №2', nameTable: 'layer_2', setterStyle: new SetterStyle(0.7, '#faf'), current: false }
	],

	setCheck(key) {
		this.currentLayer = this.layers[key];
		setCurrentLayer(this.currentLayer.nameTable, x => loadLayer(this.currentLayer, x));
		pubsub.publish('setCheck_controlsLayer', key);
	},

	loadLayers() {
		this.layers.forEach( layer => {
			loadLayer(layer, () => {
				if(layer.current) this.setCheck(this.layers.indexOf(layer));
			})
		});
	},

	loadOneLayer(layer) {
		loadLayer(layer, () => {
			if(layer.current) this.setCheck(this.layers.indexOf(layer));
		})
	},

	showFilterForm(key) {
		let layer = this.layers[key];
		ModalForm.showForm(role, { layer: layer.name, filters: layer.filters }, 'fm_filter_1')
			.then(filters => {
				layer.filters = filters;

				let body = { 	
					action: 'select', 
					layer: layer.nameTable,
					filters: filters
				};

				requestToDB(body)
					.then( x => {
						removeLayer(layer.nameTable);
						setLayerFromDB(x, layer.setterStyle, layer.nameTable);
					});

			});
	}
}

request('POST', '/user')
	.then(x => setRole(getUser(x)));

pubsub.subscribe('changeVisibleLayer', x => {  
	let layer = ControllerLayers.layers[x.key];
	if(!x.visible)
		removeLayer(layer.nameTable);
	else
		loadLayer(layer);
});
pubsub.subscribe('showFormFilter', ControllerLayers.showFilterForm.bind(ControllerLayers));

ControllerLayers.loadLayers();
/*
ControllerLayers.layers.forEach( layer => {
	loadLayer(layer, () => {
		if(layer.current) ControllerLayers.setCheck(ControllerLayers.layers.indexOf(layer));
	})
});
*/

let setRole = function(user) {
	role = user;
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

	listenMapInsert(e) {
		let inputedShape = e.shapeObj;
		let res;
		ModalForm.showForm(role, null, 'fm_input')
		.then(x => { 
			res = x.data;
			let body = {
				action: 'insert',
				body: {
					layer: ControllerLayers.currentLayer.nameTable,
					geom: inputedShape.toGeoJSON(),
					name: res.name,
					editor: role.user.id
				}
			};
			return request('POST', '/db', body);
		})
		.then(y => {
			res.id = y[0].id;
			e.setShapeInMap(inputedShape, res);
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
			geom: x.toGeoJSON(),
			editor: role.user.id
		} }
		
		requestToDB(this.createBody('update', layers, convert));
	},

	listenMapDelete(layers) {
		let convert = x => { return {
			layer: ControllerLayers.currentLayer.nameTable,
			id: x.idObj,
		} }

		requestToDB(this.createBody('delete', layers, convert));
	},

	listenEdit(e) {
		let body = {
			action: 'edit',
			body: {
				layer: e.layer,
				id: e.id
			}
		};
		request('POST', '/db', body)
			.then(x => {
				let data = {
					name: x[0].name
				};
				return ModalForm.showForm(role, data, 'fm_input');
			})
			.then(x => { 
				let body = {
					action: 'updateChanges',
					body: {
						layer: e.layer,
						id: e.id,
						name: x.data.name,
						editor: role.user.id
					}
				};
				return request('POST', '/db', body)
			})
	}
}

const actions = [
	['input', 'listenMapInsert'],
	['update', 'listenMapUpdate'],
	['delete', 'listenMapDelete'],
	['edit', 'listenEdit']
].forEach(x => CityMap.setListener(x[0], controller[x[1]].bind(controller)));
