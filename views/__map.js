'use strict'
var React = require('react');
var L = require('leaflet');

module.exports = React.createClass({
  render: function() {
    return (
      <div id="map" className="map">

      </div>
    );


  },
  componentDidMount: function() {
  	'use strict'
		//Определяем карту, координаты центра и начальный масштаб
		let сenter = [52.10, 23.70];

		var map = L.map('map').setView(сenter, 12);

		//Добавляем на нашу карту слой OpenStreetMap
		L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);

		L.marker(сenter).addTo(map);
  	}
});
