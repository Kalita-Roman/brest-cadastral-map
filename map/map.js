'use strict'
import L from 'leaflet';
import Ldraw from 'leaflet-draw';

import { map } from './map-brest.js';
import mapContolls from './map-drawControls.js';

let managerControls = new mapContolls(map);

let currentLayer = null;
let layersOnMap = new Map();

var common_options_layer = {
    clickable: true,
    fill: true,
    noClip: false,
    opacity: 0.5,
    smoothFactor: 1,
    stroke: true,
    weight: null,         // Stroke weight
};

let LayerEntity = function(_name, _lft_layer, setterStyle) {
    this.lft_layer = _lft_layer;
    this.style = { color: setterStyle.color, fillColor: setterStyle.color, fillOpacity: setterStyle.currentOpacity };
    setterStyle.setAcceptor((x) => _lft_layer.setStyle( { fillOpacity: x } ));
    _lft_layer.nameLayer = _name;

    this.addShape = function(lft_shapeObj, record) {
        lft_shapeObj.idObj = record.id;
        lft_shapeObj.addEventListener('click', createHandlerClick(record.name));
        lft_shapeObj.options = common_options_layer;
        lft_shapeObj.setStyle(this.style);
        lft_shapeObj.nameLayer = _name;
        _lft_layer.addLayer(lft_shapeObj);
    }
}

let createHandlerClick = function(msgPopup) {
     let handlButtonLeft = function(e) {
        let popup = L.popup()
            .setContent(msgPopup);
        e.target
            .bindPopup(popup)
            .openPopup(e.latlng)
            .unbindPopup();
    }

    let handlButtonMiddle = function(e) {
        let target = e.target;
        InterfaceMap.publish('edit', { id: target.idObj, layer: target.nameLayer });
    }

    return function(e) {
        let handler = e.originalEvent.button === 1
            ? handlButtonMiddle
            : handlButtonLeft
        handler(e);
    }
}

let setLayer = function(shapeObj, record) {
    currentLayer.addShape(shapeObj, record);
}

let InterfaceMap = {

    _listeners: {},

    setListener : function(name, listener) {
        this._listeners[name] = listener;
    },

    publish : function (name, data) {
        this._listeners[name](data);
    },

    setRole : function (role) {
        role.setMap(managerControls);
    }
}

let actions = [
    ['draw:created', 'input', createShape],
    ['draw:edited', 'update', takeShape],
    ['draw:deleted', 'delete', takeShape]
].forEach(x => {
    map.on(x[0], y => InterfaceMap.publish(x[1], x[2](y)) );
});

map.on('draw:editstop', x => {
    currentLayer.lft_layer.setStyle(currentLayer.style);
} );

let updateStyleLayer = function(shapeObj) {
    shapeObj.options = common_options_layer;
    shapeObj.setStyle(currentLayer.style);
}

function takeShape(e) {
    let layers = [];
    e.layers.eachLayer(x => layers.push(x));
    layers.forEach(updateStyleLayer);
    return layers;
}

function createShape(e) {
    return {
        shapeObj: e.layer,
        setShapeInMap: setLayer
    }
}

module.exports.CityMap = InterfaceMap;

module.exports.setLayerFromDB = function(records, setterStyle, nameLayer) {

    let convertGeom = function(geom) {
        return JSON.parse(geom).geometry.coordinates[0].map(x => [x[1], x[0]]);
    }

    let newLayerUsed = new L.featureGroup().addTo(map);

    let layerEntity = new LayerEntity(nameLayer, newLayerUsed, setterStyle);
    layersOnMap.set( nameLayer, layerEntity );

    records.forEach(record => {
        let shapeObj = L.polygon(convertGeom(record.geom), common_options_layer );
        layerEntity.addShape(shapeObj, record);
    });
}

module.exports.setCurrentLayer = function(nameLayer, load) {
    let setLayer = () => { 
        currentLayer = layersOnMap.get(nameLayer);
        managerControls.setLayer(currentLayer.lft_layer);
    };

    if(!layersOnMap.has(nameLayer)) {
        load(setLayer);
    }
    else {
        setLayer();
    }
}

module.exports.removeLayer = function(nameLayer) {
    let groupUsed = layersOnMap.get(nameLayer);
    groupUsed.lft_layer.onRemove(map);
    layersOnMap.delete(nameLayer);
}