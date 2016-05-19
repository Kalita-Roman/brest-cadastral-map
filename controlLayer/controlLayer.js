import React from 'react';
import './controlLayer.css';

let ControlLayer = React.createClass({
	getInitialState() {
		return { opacity: 0.8 }
	},

	handlerRange(e) {
		this.setState({ opacity: e.target.value })
	},

	render() { return (
		<div className="сontrolLayer">
			<h3>{this.props.name}</h3>
			<input type="range" min="0" max="1" step="0.05" value={this.state.opacity} onChange={this.handlerRange} />
		</div>
	)}
});

module.exports.ControlLayer = ControlLayer;
