import React from 'react';
import './comboBox.css';

let Option = React.createClass({
	getDefaultProps() {
    	return {
      		selected: false
    	};
  	},

	render() {
		return (
			<option value={this.props.value}>{this.props.label}</option>
		)
	}
});

module.exports = React.createClass({
	getInitialState: function() {
    	return { value: this.props.value, classErr: '' };
  	},

	getDefaultProps() {
    	return {
      		validator: {
                    set() {},
                    subscribe() {}
                }
    	};
  	},

  	componentWillMount() {
        this.props.validator.set(this.state.value);
        this.props.validator.subscribe(this.setNoValid);
    },

	handlChange(e) {
		this.setState( { value: e.target.value } );
		this.props.onChange(e);
		this.props.validator.set(e.target.value);
	},

    setNoValid(e) {
        this.handlFocus = x => {
            this.handlFocus = null;
            this.setState({ classErr: '' });
            this.messageError = null;
        }
        this.messageError = (<p className='err'>{e.message}</p>);
        this.setState({ classErr: 'err ' });
    },


	render() {
		let options = this.props.options.map((e, i) => 
				<Option key={i} value={e.value} label={e.label} />
			);
		let props = {};
        if(!this.props.enable) 
            props.disabled = "disabled";

		return (
			<div className='input-box-combobox margin-bottom'>
				<label className='label'>{this.props.label}</label>
				<div className='indent'>
					<select 
						className={this.state.classErr} 
						value={this.state.value} 
						onChange={this.handlChange} 
						{...props}
						onFocus={this.handlFocus}
					>
						{options}
					</select>
					{this.messageError}
				</div>
				<p className='last_editor'>{this.props.editor}</p>
			</div>
		)
	}
});