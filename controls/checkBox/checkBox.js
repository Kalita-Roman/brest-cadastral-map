import React from 'react';
import './checkBox.css';

module.exports = React.createClass({
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
		if(this.props.onChange)
			this.props.onChange(e.target.checked);
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