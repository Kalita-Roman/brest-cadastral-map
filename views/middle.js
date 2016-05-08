'use strict'
var React = require('react');

//var MapCity = require('./map.js');

module.exports = React.createClass({
  	render: function() {
    	return (
      	<div className="middle">
      		<MapCity />
      		<div className="toolbar">
      		</div>
      	</div>
    );
  	}
});
