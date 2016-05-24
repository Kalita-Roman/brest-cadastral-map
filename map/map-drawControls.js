'use strict'
import Ldraw from 'leaflet-draw';

module.exports = function ControlsMap(map) {

	let drawControl;
	let _currentLayer = L.featureGroup();
    let allowAddControl = () => {};

	this.currentLayer = function() {  
		return _currentLayer;
	};

    this.addControls = function() {
		this.removeControls();
        drawControl = new L.Control.Draw({
            edit: { featureGroup: _currentLayer },
            draw: {
                polygon: true,
                polyline: false,
                rectangle: false,
                circle: false,
                marker: false
            }
        }).addTo(map);
        allowAddControl = () => this.addControls();
    },

    this.removeControls = function() {
    	if(!drawControl) return;
    	drawControl.removeFrom(map);
    }

    this.setLayer = function(layer) {
    	_currentLayer = layer;
        allowAddControl();
    }


}