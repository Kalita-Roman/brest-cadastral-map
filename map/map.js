'use strict'
import L from 'leaflet';
import Ldraw from 'leaflet-draw';

//Определяем карту, координаты центра и начальный масштаб
let сenter = [52.097, 23.71];

L.Icon.Default.imagePath = 'http://api.tiles.mapbox.com/mapbox.js/v1.0.0beta0.0/images';
let map = L.map('map').setView(сenter, 13);

//Добавляем на нашу карту слой OpenStreetMap
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let featureGroup = L.featureGroup().addTo(map);


let data = {
    "type":"Feature",
    "properties":{},
    "geometry":{
        "type": "Polygon",
        "coordinates":[
            [
                [52.119,23.690],
                [52.112,23.723],
                [52.104,23.695],
                [52.119,23.690]
            ]
        ]
    }
 }

 var options = {
      color: '#fff',      // Stroke color
      opacity: 1,         // Stroke opacity
      weight: 10,         // Stroke weight
      fillColor: '#000',  // Fill color
      fillOpacity: 0.6    // Fill opacity
  };


//let g = L.geoJson(data);
let g = L.polygon(data.geometry.coordinates, options[0]);
g.bindPopup('popup');
featureGroup.addLayer(g);
console.log(g);



let edit = {
      featureGroup: featureGroup
    };

let drawControl = new L.Control.Draw({
    edit: edit,
    draw: {
    	polygon: true,
    	polyline: false,
    	rectangle: false,
    	circle: false,
    	marker: false
  	}
}).addTo(map);


let setLayer = function(e, result) {
    if(!result) return;
    e.layer.bindPopup(result.data.name);
    console.log(e.layer);
    featureGroup.addLayer(e.layer);
}

let InterfaceMap = {

    _listener : () => {},

    setListener : function (listener) {
        this._listener = listener;
    },
    
    input : function (e, cb) {
        this._listener(e, cb);
    },

    setInMap : function (e, result) {
        setLayer(e, result);
    }
}

map.on('draw:created', function(inputedShape) {
    featureGroup.addLayer(inputedShape.layer);
    //InterfaceMap.input(inputedShape, setLayer);
});


module.exports.InterfaceMap = InterfaceMap;