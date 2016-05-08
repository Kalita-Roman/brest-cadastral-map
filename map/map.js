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

let drawControl = new L.Control.Draw({
    edit: {
      featureGroup: featureGroup
    },
    draw: {
    	polygon: true,
    	polyline: false,
    	rectangle: false,
    	circle: false,
    	marker: false
  	}
}).addTo(map);

map.on('draw:created', function(e) {
    featureGroup.addLayer(e.layer);
});
