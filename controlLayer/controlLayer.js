import React from 'react';
import './controlLayer.css';

let ControlLayer = React.createClass({
	getInitialState() {
		this.props.user.setСontroll(this);
		return { 
			opacity: this.props.setterStyle.currentOpacity,
			checked: false
		}
	},

	setVisitor() {
		this.getClass = () => "сontrolLayer";
	},

	setEditor() {
		this.props.controller.addListener(x => this.makeCurrent(x));
		this.getClass = () => {
			 return this.state.checked 
			? "сontrolLayer check"
			: "сontrolLayer";
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
	/*	e.stopPropagation();
		let newState = this.state;
		newState.checked = !newState.checked;
		this.replaceState(newState);*/
		//this.replaceState( { checked: !this.state.checked, opacity: e.target.value } );
	},

	handlerDoubleClick(e) {
		e.stopPropagation();
		this.props.controller.setCheck(this.props.idKey);
	},

	handlerDoubleClick_empty(e) { },

	makeCurrent(key) {
		let newState = this.state;
		newState.checked = this.props.idKey === key;
		this.setState(newState);
	},

	render() { 
		return (
		<div className={this.getClass()} onDoubleClick={this.handlerDoubleClick} >
			<input type='checkbox' checked={this.state.checked} onChange={this.handlerСheckbox} />
			<h3>{this.props.name}</h3>
			<input type='range' min="0" max="1" step="0.05" value={this.state.opacity} onChange={this.handlerRange} />
		</div>
	)}
});

module.exports.ControlLayer = ControlLayer;
