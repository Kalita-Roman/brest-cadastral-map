import React from 'react';

module.exports = React.createClass({
	getInitialState: function() {
		console.log(this.props.text.get());
    	return { value: this.props.text.get() };
  	},
  	handleChange: function(event) {
    	this.setState({value: event.target.value});
    	this.props.text.set(event.target.value);
  	},

	render: function() {
		return (
			<div className='input-box'>
				<label className='label'>{this.props.label}</label>
				<input className='input-text' type="text" value={this.state.value} onChange={this.handleChange}/>
			</div>
		)
	}
});