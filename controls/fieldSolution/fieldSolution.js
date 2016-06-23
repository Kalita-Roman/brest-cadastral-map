import React from 'react';
import {DateField} from './../date/date.js';
import InputText from './../fieldText/inputText.js';
import WrapperData from './../src/wrapperData.js';

import './fieldSolution.css';

module.exports = React.createClass({

	getInitialState() {
		let getValue = (x) => this.props.recordOld && this.props.recordOld[this.props.nameField + x];
		let checked = getValue(this.props.type.date);// && getValue(this.props.type.note);
		return {
			checked: checked,
			acceptor: this.setChecked(checked)
		}
	},

	getDefaultProps() {
		return {
			checked: false,
			enable: true
		}
	},

	setChecked(check) {
		if(check) return this.props.recordNew;
		this.setNull();
		return {};
	},

	setNull() {
		let setValue = (name) => {
			this.props.recordNew[this.props.nameField + name] = null;
		}
		setValue(this.props.type.date);
		setValue(this.props.type.note);
	},

	handlOnChange(value) {
		this.setState( {checked: value, acceptor:this.setChecked(value)} );
	},

	createWrapper(name, defualt) {
		return new WrapperData(this.state.acceptor, this.props.recordOld, name, defualt, this.state.checked);
	},

	render() {
		let enable = this.state.checked && this.props.enable;
		let clWrapper = 'input-box-solution';
		if(this.props.className)
			clWrapper += ' ' + this.props.className;

		let getType = this.props.type.type === 'getType_1' ? getType_1 : getType_2;
		return getType.bind(this)(enable, clWrapper);
	}
});

let createDate = function(enable) {
	return (<DateField data={this.createWrapper(this.props.nameField + this.props.type.date, null)} enable={enable} />);
};

let getType_1 = function(enable, clWrapper) {
	return (
			<div className={clWrapper}>
				<div>
					<InputCheck checked={this.state.checked} onChange={this.handlOnChange} enable={this.props.enable} />
					<p className='input-label'>{this.props.label}</p>
				</div>
				<div>
					<div className='float-left'>
						{createDate.bind(this)(enable)}
					</div>
					<div className='indent'>
						<InputText text={this.createWrapper(this.props.nameField + this.props.type.note, '')} enable={enable} />
	                </div>
                </div>
				<p className='last_editor'>{this.props.editor}</p>
			</div>
			)
};

let getType_2 = function(enable, clWrapper) {
	return (
			<div className={clWrapper}>
				<div>
					<InputCheck checked={this.state.checked} onChange={this.handlOnChange} enable={this.props.enable} />
					<p className='input-label'>{this.props.label}</p>
				</div>
				<div className='fields'>
					<p>№</p>
					<InputText text={this.createWrapper(this.props.nameField + this.props.type.note, '')} enable={enable} />
					{createDate.bind(this)(enable)}
					<p className='last_editor'>{this.props.editor}</p>
                </div>
			</div>
			)
}

let InputCheck = React.createClass({
	getInitialState() {
		return { 
			checked: this.props.checked,
		}
	},

	getDefaultProps() {
		return {
			checked: false,
			enable: true
		}
	},

	handlerСheckbox(e) {
		e.stopPropagation();
		this.setState( { checked: e.target.checked } );
		if(this.props.onChange) {
			this.props.onChange(e.target.checked);
		}
	},

	render() {
		let id = this.props.id;
		return (
				<div className='checkbox'>
						<input 
							id={id} 
							type='checkbox' 
							checked={this.state.checked}
							onChange={this.handlerСheckbox} 
							disabled={this.props.enable ? null :  "disabled"}
						/>
						<label for={id}>{this.props.label}</label>
				</div>
			);
	}
});