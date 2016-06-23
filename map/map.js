'use strict'
import L from 'leaflet';
import Ldraw from 'leaflet-draw';

import { map } from './map-brest.js';
import mapContolls from './map-drawControls.js';

import './map.css';

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

let Trigger = function(current) {
    this.set = function(newCurrent) {
        current = newCurrent;
    }

    this.findAction = function(actions) {
        return actions[current];
    }
}

let triggerForDelete = new Trigger('showEdit');

let LayerEntity = function(_name, _lft_layer, setterStyle) {
    this.lft_layer = _lft_layer;
    this.getStyle = () => { return { 
        color: setterStyle.color,
        fillColor: setterStyle.color,
        fillOpacity: setterStyle.currentOpacity 
    }};
   /* this.style = (() => { return { 
        color: setterStyle.color,
        fillColor: setterStyle.color,
        fillOpacity: setterStyle.currentOpacity 
    } } )();*/
    setterStyle.setAcceptor((x) => _lft_layer.setStyle( { fillOpacity: x } ));
    _lft_layer.nameLayer = _name;

    this.tableObj = new Map();

    this.addShape = function(lft_shapeObj, record) {
        lft_shapeObj.idObj = record.id;
        lft_shapeObj.addEventListener('click', createHandlerClick(record.name));
        lft_shapeObj.options = common_options_layer;
        lft_shapeObj.setStyle(this.getStyle());
        lft_shapeObj.nameLayer = _name;
        _lft_layer.addLayer(lft_shapeObj);

        let label = this.createLabel(record, lft_shapeObj);

        this.tableObj.set(record.id, { label: label });
    }

    this.createLabel = function(record, shape) {
        let labelIcon = L.divIcon({
            className: 'map-label',
            html: `<p style='color: ${setterStyle.colorLabel}'>${record.name}</p>`
        });
        return L.marker(shape.getBounds().getCenter(), {icon: labelIcon}).addTo(_lft_layer);
    }

    this.removeShape = function(shape) {
        let label = this.tableObj.get(shape.idObj).label;
        _lft_layer.removeLayer(label);
    }
}

let createHandlerClick = function(msgPopup) {
    let empty = () => {};

    let showEdit = function(e) {
        let target = e.target;
        let targetLayer = layersOnMap.get(target.nameLayer);
        let lft_layer = targetLayer.lft_layer;
        let rowTable = targetLayer.tableObj.get(target.idObj);
        let label = rowTable.label;
        InterfaceMap.publish('edit', { id: target.idObj, layer: target.nameLayer, cb (xe) { 
            lft_layer.removeLayer(label);
            rowTable.label = targetLayer.createLabel(xe, target);
        } });
    };

    return function(e) {
        triggerForDelete.findAction({showEdit, empty})(e);
    }
}

let setLayer = function(shapeObj, record) {
    currentLayer.addShape(shapeObj, record);
}

let updateStyleLayer = function(shapeObj) {
    shapeObj.options = common_options_layer;
    shapeObj.setStyle(currentLayer.getStyle());
};

function takeShape(e) {
    let layers = [];
    e.layers.eachLayer(x => layers.push(x));
    layers.forEach(updateStyleLayer);
    return layers;
};

function createShape(e) {
    return {
        shapeObj: e.layer,
        setShapeInMap: setLayer
    }
};

let actions = [
    ['draw:created', 'input', createShape],
    ['draw:edited', 'update', takeShape],
    ['draw:deleted', 'delete', takeShape]
].forEach(x => {
    map.on(x[0], y => InterfaceMap.publish(x[1], x[2](y)) );
});

map.on('draw:editstop', x => {
    currentLayer.lft_layer.setStyle(currentLayer.getStyle());
} );

map.on('draw:deletestart', x => triggerForDelete.set('empty'));
map.on('draw:deletestop', x => triggerForDelete.set('showEdit'));

let InterfaceMap = {

    _listeners: {},

    setListener(name, listener) {
        this._listeners[name] = listener;
    },

    publish(name, data) {
        this._listeners[name](data);
    },

    setRole(role) {
        role.setMap(managerControls);
    },

    setLayerFromDB(records, setterStyle, nameLayer) {

        this.removeLayer(nameLayer)

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
    },

    setCurrentLayer(nameLayer, load) {
        let setLayer = () => { 
            currentLayer = layersOnMap.get(nameLayer);
            managerControls.setLayer(currentLayer.lft_layer);
        };

        if(!layersOnMap.has(nameLayer)) {
            load(setLayer);
        }
        else {
            setLayer();
        };
    },

    removeShape(shape) {
        currentLayer.removeShape(shape);
    },

    removeLayer(nameLayer) {
        let groupUsed = layersOnMap.get(nameLayer);
        if(groupUsed)
            groupUsed.lft_layer.onRemove(map);
        layersOnMap.delete(nameLayer);
    }
}

module.exports = InterfaceMap;