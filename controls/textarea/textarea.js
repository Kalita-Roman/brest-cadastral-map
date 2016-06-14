import React from 'react';

import './textarea.css';

module.exports = React.createClass({

	getInitialState: function() {
    	return { value: this.props.text.get() };
  	},

  	handleChange: function(event) {
        if(!this.props.enable) return;
        this.setState({value: event.target.value});
        this.props.text.set(event.target.value);
    },

    getDefaultProps: function() {
        return {
            enable: true
        };
    },

	render() {
		return (
			<div className='input-box' >
        			<label className='label'>{this.props.label}</label>
                    <textarea className='textarea' value={this.state.value} onChange={this.handleChange}></textarea>
                </div>
			)
	}
});