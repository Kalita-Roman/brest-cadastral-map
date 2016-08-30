import CityMap from './map/map.js';
import ModalForm from './controls/modalform/modalform.js';
import React from 'react';
import ReactDom from 'react-dom';

import { ControlLayer } from './controls/controlLayer/controlLayer.js';
import UserLabel from './controls/userLabel/userLabel.js';
import getRole from './auth/roles.js';

import pubsub from './src/pubsub.js';
import requests from './src/requests.js';
import layers from './src/layers.js';


function SubscribePane(url) {
	const SECOND = 1000;

	function subscribe() {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (this.readyState != 4) return;
			if (this.status == 200) {
				ControllerLayers.loadLayers();
				subscribe();
				return;
			}
/*			if (this.status != 404) {
				console.log(this.statusText);
			}*/
		}
		xhr.open("GET", url, true);
		setTimeout(() => { xhr.abort(); subscribe(); }, 10*SECOND);
		xhr.send();
	}

	subscribe();

}

SubscribePane('/publish');

let role;

let loadLayer = function(layer) {

	let body = { 	
		action: 'select', 
		layer: layer.nameTable,
	};
	return requests.requestToDB(body)
		.then(x => {
			CityMap.setLayerFromDB(x, layer.setterStyle, layer.nameTable);
		})
		.catch(x => console.log(x));
}

const ControllerLayers = {
	currentLayer: null,
	layers,
	setCheck(key) {
		this.currentLayer = this.layers[key];
		CityMap.setCurrentLayer(this.currentLayer.nameTable, x => loadLayer(this.currentLayer, x));
		pubsub.publish('setCheck_controlsLayer', key);
	},

	loadLayers() {
		Promise.all(this.layers.map(loadLayer))
			.then(() => {
				this.setCheck(0);
			})
			.catch(x => { alert('Не удалось соединиться с базой данных!'); console.log(x); });
	},

	showFilterForm(key) {
		let currentLayer = this.layers[key];
		let data = { layer: currentLayer };
		let body = {
			action: 'selectForEdit',
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
		action: 'selectForEdit',
		tables: ControllerLayers.currentLayer.tables
	};
	requests.request('POST', '/db', body)
		.then(x => {
			data.refTables = x.refTables;
			return ModalForm.showForm(role, data, 'fm_input' )
		})
		.then(x => { 
			console.log('create');
			res = x.data;
			res.geom = inputedShape.toGeoJSON(),
			res.editor = role.user.id;
			let body = {
				action: 'insert',
				body: {
					layer: ControllerLayers.currentLayer.nameTable,
					fields: res,
				}
			};
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
		action: 'selectForEdit',
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
			let res = {};
			for(let field in x.data) {
				if(x.data[field] !== data.record[field]) {
					res[field] = x.data[field];
					data.record[field] = x.data[field];
				}
			}
			let body = {
				action: 'updateChanges',
				body: {
					layer: e.layer,
					id: e.id,
					editor: role.user.id,
					fields: res,
				}
			};
			return requests.request('POST', '/db', body);
		})
		.then(x => {
			e.cb(data.record);
		});
}

const actions = [
	['input', insertToMap],
	['update', listenMapUpdate],
	['delete', listenMapDelete],
	['edit', editObject],
].forEach(x => CityMap.setListener(x[0], x[1]));
