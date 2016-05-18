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

/*
let data = {
    "type":"Feature",
    "properties":{},
    "geometry":{
        "type": "Polygon",
        "coordinates":[
            [
                [23.690,52.119],
                [23.723,52.112],
                [23.695,52.104],
                [23.690,52.119]
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
*/
/*
//let g = L.geoJson(data);
let g = L.polygon(data.geometry.coordinates, options[0]);
g.bindPopup('popup');
featureGroup.addLayer(g);
console.log(g);

*/



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
/*
function style(feature) {
    return {
        fillColor: '#faa',
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
};

var newL2 = L.geoJson(data, {style: style});//.addTo(map);
console.log(newL2);
let newL = L.polygon(data.geometry.coordinates[0].map(x => [x[1], x[0]]), {
        fillColor: '#faa',
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    });
featureGroup.addLayer(newL);
console.log(newL);
*/
var options_layer = {
      color: '#aaf',      // Stroke color
      weight: null,         // Stroke weight
      fillOpacity: 0.7    // Fill opacity
  };


let setLayer = function(layer, result) {
    if(!result) return;
    layer.bindPopup(result.data.name);
    layer.setStyle(options_layer);
    featureGroup.addLayer(layer);
}

let InterfaceMap = {

    _listeners: {},

    _listener : () => {},
    _listenerUpdate : () => {},

    setListener : function(name, listener) {
        this._listeners[name] = listener;
    },

    getListener : function (name) {
        return this._listeners[name];
    },

    setFromDB : function(geoJson, id, options, data) {
        function style(feature) {
            return options_layer;
        };

        let newLayer = L.polygon(JSON.parse(geoJson).geometry.coordinates[0].map(x => [x[1], x[0]]), options_layer );
        newLayer.idObj = id;
        featureGroup.addLayer(newLayer);
        //var newLayer = L.geoJson(data, {style: style}).addTo(map);
        //newLayer.setStyle(options_layer);
        //var newLayer = L.geoJson(data, {style: style}).addTo(map);
        //featureGroup.addLayer(newLayer);

        //console.log(newLayer);
    },

    setInMap : function (e, result) {
        setLayer(e, result);
    }
}

map.on('draw:created', function(inputedShape) {
    InterfaceMap.getListener('input')(inputedShape.layer, setLayer);
});

map.on('draw:edited', function(e) {
    InterfaceMap.getListener('update')(takeLayers(e));
});

map.on('draw:deleted', function(e) {
    InterfaceMap.getListener('delete')(takeLayers(e));
});

function takeLayers(e) {
    let layers = [];
    e.layers.eachLayer(x => layers.push(x));
    return layers;
}

module.exports.InterfaceMap = InterfaceMap;