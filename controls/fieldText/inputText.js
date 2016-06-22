import React from 'react';

import './fieldText.css';

module.exports = React.createClass({
    getInitialState: function() {
        return { value: this.props.text.get() };
    },

    handleChange: function(event) {
        if(!this.props.enable) return;

        let value = event.target.value;

        if(this.props.numeric && isNaN(value)) return;

        this.props.text.set(value);
        this.setState({value: value});

        if(this.props.onChange)
        	this.props.onChange(value);
    },

    getDefaultProps: function() {
        return {
            enable: true,
        };
    },

    render: function() {

        let propsInput = {};
        if(!this.props.enable) 
            propsInput.disabled = "disabled";
        if(this.props.props)
        	for(var field in this.props.props)
        		propsInput[field] = this.props.props[field];

        return (
            <input 
                className={'input-text '+ this.props.className} 
                type="text" 
                value = {this.state.value}
                onChange = {this.handleChange}
                {... propsInput}
                />
        )
    }
});