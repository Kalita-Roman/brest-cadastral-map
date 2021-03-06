import React from 'react';
import './controlLayer.css';

import ButtonLed from '../button-led/button-led.js';

let ControlLayer = React.createClass({
	getInitialState() {
		this.props.user.setСontroll(this);
		return { 
			opacity: this.props.layer.setterStyle.currentOpacity,
			checked: false,
			show: true
		}
	},

	setVisitor() {
		this.getClass = () => 'controlLayer';
		this.getHandlerDblClick = () => { return () => {}; }
		this.switchCurrenting = null;
	},

	setEditor() {
		this.props.pubsub.subscribe('setCheck_controlsLayer', x => this.makeCurrent(x));
	},

	handlerRange(e) {
		let newState = this.state;
		newState.opacity = e.target.value;
		this.setState(newState);
		this.props.layer.setterStyle.setOpacity(e.target.value);
	},

	handlerСheckbox(e) {
		e.stopPropagation();
		let newState = this.state;
		newState.show = !newState.show;
		this.setState(newState);
		this.props.pubsub.publish('changeVisibleLayer', { key: this.props.idKey, visible: newState.show });
	},

	handlerSwitchCurrent() {
		this.props.pubsub.publish('setCurrentLayer', this.props.idKey);
	},

	showFormFileters(e) {
		this.props.pubsub.publish('showFormFilter', this.props.idKey);	
	},

	makeCurrent(key) {
		let newState = this.state;
		newState.show = true;
		this.switchCurrenting = <ButtonLed className='item' onClick={this.handlerSwitchCurrent} on={this.props.idKey === key} />
		this.setState(newState);
	},

	render() { 
		return (
		<div className="controlLayer">
			<h2>{this.props.layer.name}</h2>
			<div style={{backgroundColor: this.props.layer.color}} className='box-color item'>
				<input type='checkbox' checked={this.state.show} onChange={this.handlerСheckbox} />
			</div>
			{this.switchCurrenting}
			<input type='range' min="0" max="1" step="0.05" value={this.state.opacity} onChange={this.handlerRange} />
		</div>
	)}
});

module.exports.ControlLayer = ControlLayer;
