import React from 'react';
import ReactDOM from 'react-dom';

import './fieldText.css';

module.exports = React.createClass({
    getInitialState: function() {
        return { value: this.props.text.get() };
    },

    handleChange: function(event) {
        if(!this.props.enable) return;
        let value = event.target.value;
        this.setState({value: value});
        this.props.text.set(value);
        this.props.validator.set(value);
    },


    getDefaultProps: function() {
        return {
            enable: true,
            validator: {
                    set() {},
                    subscribe() {}
                }
        };
    },

    componentWillMount() {
        this.props.validator.set(this.props.text.get());
        this.props.validator.subscribe(this.setNoValid);
    },

    setNoValid(e) {
        console.log(e);
        this.handlFocus = x => {
            this.handlFocus = null;
            this.setState({ classLabel: '' });
            this.messageError = null;
        }
        this.messageError = (<p className='err'>{e.message}</p>);
        this.setState({ classLabel: 'err' });
    },

    componentDidMount(){
        if(this.props.focus)
            this._input.focus();
    },

    render: function() {
    		return (
      			<div className='input-box' >
        			<label className='label'>{this.props.label}</label>
                    <input 
                        className={this.state.classLabel} 
                        type="text" 
                        value={this.state.value} 
                        onChange={this.handleChange} 
                        onFocus={this.handlFocus}
                        ref={(c) => this._input = c}
                        />
                    {this.messageError}
                </div>
        )
    }
});