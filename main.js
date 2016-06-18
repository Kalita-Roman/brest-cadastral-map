import CityMap from './map/map.js';
import ModalForm from './controls/modalform/modalform.js';
import React from 'react';
import ReactDom from 'react-dom';

import { ControlLayer } from './controls/controlLayer/controlLayer.js';
import UserLabel from './controls/userLabel/userLabel.js';
import getRole from './auth/roles.js';

import pubsub from './src/pubsub.js';
import requests from './src/requests.js';

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

let loadLayer = function(layer) {

	let body = { 	
		action: 'select', 
		layer: layer.nameTable,
	};
	return requests.requestToDB(body)
		.then(x => {
			var dates = x.map(y => new Date(y.editing_date));
			var maxDate = Math.max.apply(Math, dates);
			var minDate = Math.min.apply(Math, dates);

			layer.filters = [ {
				filterName: 'rangeDate',
				start: new Date(minDate),
				end: new Date(maxDate)
			} ];

			CityMap.setLayerFromDB(x, layer.setterStyle, layer.nameTable);
		})
}

const ControllerLayers = {
	currentLayer: null,

	layers:  [
		{ 
			name:'Проектируемые объекты (АПЗ)', 
			nameTable: 'apz', 
			color: '#afa', 
			setterStyle: (() => new SetterStyle(0.7, '#afa'))(),
			form: 'getForm_apz',
			tables: [ 'func_zone' ],
			current: false
		},
		{ 
			name:'Градопаспорта', 
			nameTable: 'citypassport', 
			color: '#aaf', 
			setterStyle: (() => new SetterStyle(0.7, '#aaf'))(),
			form: 'getForm_citypassport',
			tables: [ ],
			current: true
		}
	],

	setCheck(key) {
		this.currentLayer = this.layers[key];
		CityMap.setCurrentLayer(this.currentLayer.nameTable, x => loadLayer(this.currentLayer, x));
		pubsub.publish('setCheck_controlsLayer', key);
	},

	loadLayers() {
		Promise.all(this.layers.map(loadLayer))
			.then(() => {
				this.setCheck(1);
			})
			.catch(x => { alert('Не удалось соединиться с базой данных!'); console.log(x); });
	},

	showFilterForm(key) {
		let currentLayer = this.layers[key];
		let data = { layer: currentLayer };
		let body = {
			action: 'edit',
			tables: currentLayer.tables
		};
		requests.request('POST', '/db', body)
			.then(x => {
				data.tables = x.t;
				return ModalForm.showForm(role, data, 'fm_filter')
			})
			.then(filters => {
				currentLayer.filters = filters;
				let body = { 	
					action: 'select', 
					layer: currentLayer.nameTable,
					filters: filters
				};

				requests.requestToDB(body)
					.then( x => {
						let result = x.result;
						CityMap.removeLayer(currentLayer.nameTable);
						CityMap.setLayerFromDB(result, currentLayer.setterStyle, currentLayer.nameTable);
						CityMap.setCurrentLayer(this.currentLayer.nameTable, result => loadLayer(this.currentLayer, result));
					});

			});
	}
}

requests.request('POST', '/user')
	.then(x => setRole(getRole(x)) );

pubsub.subscribe('changeVisibleLayer', x => {  
	let layer = ControllerLayers.layers[x.key];
	if(!x.visible)
		CityMap.removeLayer(layer.nameTable);
	else
		loadLayer(layer);
});

pubsub.subscribe('showFormFilter', ControllerLayers.showFilterForm.bind(ControllerLayers));


ControllerLayers.loadLayers();

let showEditors = function() {
	let body = {
		action: 'showeditors'
	}
	requests.request('POST', '/db', body)
		.then(x => {
			return ModalForm.showForm(role, x, 'fm_editors');
		})
		.then(x => {
			if(x === 'close') return;
			console.log(x);
			requests.request('POST', '/db', x)
				.then(y => showEditors());

		});
}

let setRole = function(_role) {
	role = _role;
	CityMap.setRole(role);

	pubsub.subscribe('setCurrentLayer', x => ControllerLayers.setCheck(x));
	let controlsLayer =  ControllerLayers.layers.map((layer, i) => 
		<ControlLayer key={i} layer={layer} idKey={i} user={role} pubsub={pubsub}/>
	);

	pubsub.subscribe('showEditors', showEditors);
	let userLabel = role.user ? <UserLabel role={role} pubsub={pubsub}/> : null;
	
	ReactDom.render(
		<div>
			{ userLabel }
			{ controlsLayer }
	  	</div>,
	  	document.getElementById('toolbar-right')
	);
};


let insertToMap = function(e) {
	let inputedShape = e.shapeObj;
	let res;
	let currentLayer = ControllerLayers.currentLayer;
	let data = { layer: ControllerLayers.currentLayer };
	let body = {
		action: 'edit',
		tables: ControllerLayers.currentLayer.tables
	};
	requests.request('POST', '/db', body)
		.then(x => {
			console.log(x);
			data.refTables = x.refTables;
			return ModalForm.showForm(role, data, 'fm_input' )
		})
		.then(x => { 
			res = x.data;
			let body = {
				action: 'insert',
				body: {
					layer: ControllerLayers.currentLayer.nameTable,
					geom: inputedShape.toGeoJSON(),
					editor: role.user.id,
					fields: res,
				}
			};
			console.log(body);
			return requests.request('POST', '/db', body);
		})
		.then(y => {
			res.id = y.id;
			e.setShapeInMap(inputedShape, res);
		});
};

let createBody = function(name, layers,  convert) {
	return {
		action: name,
		body: layers.map(convert)
	}
};


let listenMapUpdate = function(layers) {
	let convert = x => { return {
		layer: ControllerLayers.currentLayer.nameTable,
		id: x.idObj,
		geom: x.toGeoJSON(),
		editor: role.user.id
	} }
	
	requests.requestToDB(createBody('update', layers, convert));
};

let listenMapDelete = function (layers) {
	let convert = x => { return {
		layer: ControllerLayers.currentLayer.nameTable,
		id: x.idObj,
	} }

	requests.requestToDB(createBody('delete', layers, convert))
		.then(x => {
			layers.forEach(CityMap.removeShape);
		});
};

let editObject = function(e) {
	let editedRecord;
	let currentLayer = ControllerLayers.layers.find(l => l.nameTable === e.layer);
	let data = { layer: currentLayer };
	let body = {
		action: 'edit',
		body: {
			layer: e.layer,
			id: e.id
		},
		tables: currentLayer.tables
	};
	requests.request('POST', '/db', body)
		.then(x => {
			data.record = x.record;
			data.refTables = x.refTables;
			return ModalForm.showForm(role, data, 'fm_input');
		})
		.then(x => { 
			editedRecord = x.data;
			let body = {
				action: 'updateChanges',
				body: {
					layer: e.layer,
					id: e.id,
					editor: role.user.id,
					fields: editedRecord,
				}
			};
			return requests.request('POST', '/db', body);
		})
		.then(x => {
			e.cb(editedRecord)
		});
}

const actions = [
	['input', insertToMap],
	['update', listenMapUpdate],
	['delete', listenMapDelete],
	['edit', editObject],
].forEach(x => CityMap.setListener(x[0], x[1]));
