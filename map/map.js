'use strict'
import L from 'leaflet';
import Ldraw from 'leaflet-draw';

import { map } from './map-brest.js';
import mapContolls from './map-drawControls.js';


let managerControls = new mapContolls(map);

let featureGroups = {
   // layer_1: L.featureGroup().addTo(map),
   // layer_2: L.featureGroup().addTo(map)
}

//let featureGroup = featureGroups.layer_1;
//managerControls.setLayer(featureGroup);

var options_layer = {
      color: '#aaf',      // Stroke color
      weight: null,         // Stroke weight
      fillOpacity: 0.7    // Fill opacity
  };

let setLayer = function(layer, result) {
    if(!result) return;
    layer.bindPopup(result.data.name);
   // layer.setStyle(options_layer);
    console.log(managerControls.currentLayer);

    let cl = managerControls.currentLayer();
    console.log(cl);
    cl.addLayer(layer);
    //featureGroup.addLayer(layer);
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
        role.setMap(managerControls);
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

module.exports.setLayerFromDB = function(records, setterStyle, nameLayer) {
    let groupUsed = new L.featureGroup().addTo(map);
    groupUsed.nameLayer = nameLayer;
    featureGroups[nameLayer] = groupUsed;
    records.forEach(record => {
        let newLayer = L.polygon(JSON.parse(record.geom).geometry.coordinates[0].map(x => [x[1], x[0]]), options_layer );
        newLayer.idObj = record.id;
        newLayer.bindPopup(record.name);
        groupUsed.addLayer(newLayer);
    });
    groupUsed.setStyle( { color: setterStyle.color } );
    setterStyle.setAcceptor((x) => groupUsed.setStyle( { fillOpacity: x } ));
}

module.exports.setCurrentLayer = function(nameLayer) {
    let featureGroup = featureGroups[nameLayer];
    managerControls.setLayer(featureGroup);
}