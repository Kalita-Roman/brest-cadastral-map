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
        if(this.props.numeric && isNaN(value)) return;
        this.setState({value: value, classErr: ''});
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
 
        if(!this.props.enable) this.state.classEnable = 'notEnable';
        this.props.validator.set(this.props.text.get());
        this.props.validator.subscribe(this.setNoValid);
    },

    setNoValid(e) {
        console.log(e);
        this.handlFocus = x => {
            this.handlFocus = null;
            console.log('тут');
            this.setState({ classErr: '' });
            this.messageError = null;
        }
        this.messageError = (<p className='err'>{e.message}</p>);
        console.log('здесь');
        this.setState({ classErr: 'err ' });
    },

    componentDidMount(){
        if(this.props.focus)
            this._input.focus();
    },

    render: function() {
    		return (
      			<div className={'input-box-text ' + this.props.className} >
        			<label className='input-label'>{this.props.label}</label>
                    <input 
                        className={'input-text '+this.state.classErr} 
                        type="text" 
                        value={this.state.value} 
                        onChange={this.handleChange} 
                        onFocus={this.handlFocus}
                        disabled={this.props.enable ? null :  "disabled"}
                        ref={(c) => this._input = c}
                        />
                    {this.messageError}
                </div>
        )
    }
});