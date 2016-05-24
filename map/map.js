'use strict'
import L from 'leaflet';
import Ldraw from 'leaflet-draw';

import { map } from './map-brest.js';
import mapContolls from './map-drawControls.js';

let managerControls = new mapContolls(map);

let currentLayer = null;
let featureGroups = new Map();

var options_layer = {
    clickable: true,
    fill: true,
    noClip: false,
    opacity: 0.5,
    smoothFactor: 1,
    stroke: true,
    weight: null,         // Stroke weight
};

let updateStyleLayer = function(layer) {
    layer.options = options_layer;
    layer.setStyle(currentLayer.style);
}

let setLayer = function(layer, result) {
    if(!result) return;
    layer.bindPopup(result.data.name);
    updateStyleLayer(layer);
    currentLayer.layer.addLayer(layer);
}

let InterfaceMap = {

    _listeners: {},

    setListener : function(name, listener) {
        this._listeners[name] = listener;
    },

    getListener : function (name) {
        return this._listeners[name];
    },

    setInMap : function (e, result) {
        setLayer(e, result);
    },

    setRole : function (role) {
        role.setMap(managerControls);
    }
}

map.on('draw:created', function(e) {
    InterfaceMap.getListener('input')(e.layer, setLayer);
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
    layers.forEach(updateStyleLayer);
    return layers;
}

function createLayer(e) {
    return {
        e: e,
        cb: setLayer
    }
}

module.exports.CityMap = InterfaceMap;

module.exports.setLayerFromDB = function(records, setterStyle, nameLayer) {

    let convertGeom = function(geom) {
        return JSON.parse(geom).geometry.coordinates[0].map(x => [x[1], x[0]]);
    }

    let groupUsed = new L.featureGroup().addTo(map);
    groupUsed.nameLayer = nameLayer;
    records.forEach(record => {
        let obj = L.polygon(convertGeom(record.geom), options_layer );
        obj.idObj = record.id;
        obj.bindPopup(record.name);
        groupUsed.addLayer(obj);
    });
    let style = { color: setterStyle.color, fillOpacity: setterStyle.currentOpacity };
    groupUsed.setStyle( style );
    setterStyle.setAcceptor((x) => groupUsed.setStyle( { fillOpacity: x } ));
    featureGroups.set(nameLayer, { layer: groupUsed, style: style } );
}

module.exports.setCurrentLayer = function(nameLayer, load) {
    let setLayer = () => { 
        currentLayer = featureGroups.get(nameLayer);
        managerControls.setLayer(currentLayer.layer);
    };

    if(!featureGroups.has(nameLayer)) {
        load(setLayer);
    }
    else {
        setLayer();
    }
}

module.exports.removeLayer = function(nameLayer) {
    let groupUsed = featureGroups.get(nameLayer);
    console.log(groupUsed);
    groupUsed.layer.onRemove(map);
    featureGroups.delete(nameLayer);
}