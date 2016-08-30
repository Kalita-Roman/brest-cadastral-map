import React from 'react';
import FieldText from './../fieldText/fieldText.js';
import './date.css';

module.exports.DateField = React.createClass({
	getInitialState: function() {
	    return {
	    	enable: false,
	    };
  	},

  	getDefaultProps() { // TODO: Вероятно можно убрать.
  		return {
            show: true
        }
  	},
 
	handleChange(date) {
  		var date = date.target.value ? new Date(date.target.value) : null;
  		if(this.props.data) 
  			this.props.data.set(date);
		this.setState({
			startDate: date
		});
	},

	render: function() {
		let date = this.props.data.get();
		let pr = {
			value: date ? new Date(date).toISOString().slice(0, 10) : ''
		};
		if(!this.props.enable)
			pr.disabled = 'disabled';
		return (<input type="date" name="calendar" className='date_field_input-date' onChange={this.handleChange} {...pr}/>)
	},
});


module.exports.DateFieldLabel = React.createClass({
	render: function() {
		return (
			<div className={'date-field ' + this.props.className}>
				<p className='date-field_label'>{this.props.label}</p>
				<module.exports.DateField data={this.props.data} enable={this.props.enable} />
				<p className='last_editor'>{this.props.editor}</p>
			</div>
		)
	}
});