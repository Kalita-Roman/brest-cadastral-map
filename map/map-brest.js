'use strict'
import L from 'leaflet';

//Определяем карту, координаты центра и начальный масштаб
let сenter = [52.091, 23.695];

//L.Icon.Default.imagePath = 'http://api.tiles.mapbox.com/mapbox.js/v1.0.0beta0.0/images';
L.Icon.Default.imagePath = '//api.tiles.mapbox.com/mapbox.js/v1.0.0beta0.0/images';
let map = L.map('map').setView(сenter, 15);

//Добавляем на нашу карту слой OpenStreetMap
//L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//	attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//}).addTo(map);
L.tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="//osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

module.exports.map = map;