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
			<div className='input-box-area' >
        			<label className='input-label'>{this.props.label}</label>
                    <textarea 
                        className='textarea' 
                        value={this.state.value} 
                        onChange={this.handleChange}
                        disabled={this.props.enable ? null :  "disabled"}
                    ></textarea>
                    <p className='last_editor'>{this.props.editor}</p>
                </div>
			)
	}
});