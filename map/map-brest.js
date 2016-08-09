'use strict'
import L from 'leaflet';
import 'leaflet-hash';

let сenter_Brest = [52.091, 23.695];

L.Icon.Default.imagePath = '//api.tiles.mapbox.com/mapbox.js/v1.0.0beta0.0/images';
let map = L.map('map').setView(сenter_Brest, 15);
let hash = new L.Hash(map);

let layer_osm = L.tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="//osm.org/copyright">OpenStreetMap</a> contributors'
});
let layer_satellite = L.tileLayer('//{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 18,
    subdomains:['mt0','mt1','mt2','mt3']
});

var baseMaps = {
    "OSM": layer_osm,
    "Satellite": layer_satellite
};
L.control.layers(baseMaps).addTo(map);
layer_osm.addTo(map);

module.exports.map = map;