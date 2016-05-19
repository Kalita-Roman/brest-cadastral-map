'use strict'
import L from 'leaflet';
import Ldraw from 'leaflet-draw';

import { map } from './map-brest.js';

let addControls = function() {
    console.log('add сontrols');
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

    removeControls = () => { drawControl.removeFrom(map); console.log('remove сontrols'); }
}

let removeControls = () => {};

let featureGroup = L.featureGroup().addTo(map);

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

    setInMap : function (e, result) {
        setLayer(e, result);
    },

    setRole : function (role) {
        if(role !== 'false') 
            addControls();
        else
            removeControls();
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

module.exports.setLayerFromDB = function(geoJson, id, options, data) {
    function style(feature) {
        return options_layer;
    };

    let newLayer = L.polygon(JSON.parse(geoJson).geometry.coordinates[0].map(x => [x[1], x[0]]), options_layer );
    newLayer.idObj = id;
    featureGroup.addLayer(newLayer);
}