import { InterfaceMap } from './map/map.js';
import ModalForm from './modalform/modalform.js';

let requestToDB = function(jsonbody, onreadystatechange) {
	let xhr = new XMLHttpRequest();
	xhr.open('POST', '/db', true);
	xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
	if(onreadystatechange)
		xhr.onreadystatechange = onreadystatechange(xhr);
	xhr.send(JSON.stringify(jsonbody));
}

requestToDB(
	{ action: 'select' },
	function(xhr) {
		return x =>  { 
			if (xhr.readyState != 4) return;
  			let response = JSON.parse(xhr.response);
  			response.map(x => InterfaceMap.setFromDB(x.geom, x.id));
  		}
	}
);

let controller = {
	inputedShape: null,

	addObj(x) { 
		InterfaceMap.setInMap(this.inputedShape, x);

		let jsonbody = {
			action: 'insert',
			body: this.inputedShape.toGeoJSON()
		}

		requestToDB(jsonbody);
	},

	listenMapInsert(inputedShape, insertInMap) {
		this.inputedShape = inputedShape;
		ModalForm.show(this.addObj.bind(this));
	},

	listenMapUpdate(layers) {
		let convert = x => { return {
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
			id: x.idObj,
		} }

		let jsonbody = {
			action: 'delete',
			body: layers.map(convert)
		}
		requestToDB(jsonbody);
	}
}

InterfaceMap.setListener('input', controller.listenMapInsert.bind(controller));
InterfaceMap.setListener('update',controller.listenMapUpdate.bind(controller));
InterfaceMap.setListener('delete',controller.listenMapDelete.bind(controller));
