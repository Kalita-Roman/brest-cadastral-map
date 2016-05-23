import React from 'react';
import './controlLayer.css';

let ControlLayer = React.createClass({
	getInitialState() {
		this.props.user.setСontroll(this);
		return { 
			opacity: this.props.setterStyle.currentOpacity,
			checked: false,
			show: true
		}
	},

	setVisitor() {
		this.getClass = () => "controlLayer";
	},

	setEditor() {
		this.props.pubsub.subscribe('setCheck_controlsLayer', x => this.makeCurrent(x));
		this.getClass = () => {
			 return this.state.checked 
			? "controlLayer check"
			: "controlLayer";
		}
	},

	handlerRange(e) {
		e.stopPropagation();
		let newState = this.state;
		newState.opacity = e.target.value;
		this.setState(newState);
		this.props.setterStyle.setOpacity(e.target.value);
	},

	handlerСheckbox(e) {
		e.stopPropagation();
		let newState = this.state;
		newState.show = !newState.show;
		this.setState(newState);
		this.props.pubsub.publish('changeVisibleLayer', { key: this.props.idKey, visible: newState.show });
	},

	handlerDoubleClick(e) {
		e.stopPropagation();
		this.props.pubsub.publish('dblClick_controlsLayer', this.props.idKey);
	},

	handlerDoubleClick_empty(e) { },

	makeCurrent(key) {
		let newState = this.state;
		newState.checked = this.props.idKey === key;
		newState.show = true;
		this.setState(newState);
	},

	render() { 
		return (
		<div className={this.getClass()} onDoubleClick={this.handlerDoubleClick} >
			<input type='checkbox' checked={this.state.show} onChange={this.handlerСheckbox} />
			<h3>{this.props.name}</h3>
			<input type='range' min="0" max="1" step="0.05" value={this.state.opacity} onChange={this.handlerRange} />
		</div>
	)}
});

module.exports.ControlLayer = ControlLayer;
