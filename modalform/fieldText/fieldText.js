import React from 'react';
import ReactDOM from 'react-dom';

import './fieldText.css';

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

    componentDidMount(){
        if(this.props.focus)
            this._input.focus();
    },

    render: function() {
    		return (
      			<div className='input-box' >
        			<label className='label'>{this.props.label}</label>
                    <input className='input-text' type="text" value={this.state.value} onChange={this.handleChange} ref={(c) => this._input = c}/>
                </div>
        )
    }
});