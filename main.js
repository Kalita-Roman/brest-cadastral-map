//import React from 'react';
//import ReactDOM from 'react-dom';

import MapCity from './map/map.js';
import ModalForm from './modalform/modalform.js';


/*
var xhr = new XMLHttpRequest();
xhr.open('POST', location.href+'db', true);
xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
xhr.send(jsonbody);

*/
let controller = {
	inputedShape: null,

	addObj(x) { 
		MapCity.InterfaceMap.setInMap(this.inputedShape, x);

		let layer = this.inputedShape.layer;
	//	var body = { value: 1, text: "text2" };
		//console.log(layer);
		var jsonbody = layer.toGeoJSON();
		jsonbody = JSON.stringify(jsonbody);
		console.log(jsonbody);

		var xhr = new XMLHttpRequest();
		xhr.open('POST', location.href+'db', true);
		xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
		xhr.send(jsonbody);

	},

	listenMap(inputedShape, insertInMap) {
		this.inputedShape = inputedShape;
		ModalForm.show(this.addObj.bind(this));
	},


}

MapCity.InterfaceMap.setListener(controller.listenMap.bind(controller));


//var Header = require('./views/header.js');
//var Middle = require('./views/middle.js');
//var Footer = require('./views/footer.js');
/*
ReactDOM.render(
	<div className='main-wrapper-box'>
		<Header />
		<Middle />
		<Footer />
	</div>,
 	document.getElementById('site')
);*/