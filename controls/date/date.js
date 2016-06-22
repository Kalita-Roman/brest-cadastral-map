import React from 'react';
//import Calendar from 'react-input-calendar';
import DatePicker from 'react-datepicker';
import FieldText from './../fieldText/fieldText.js';
import moment from 'moment';
import './date.css';
import './../../node_modules/react-input-calendar/style/index.css'

import 'react-datepicker/dist/react-datepicker.css'

module.exports.DateField = React.createClass({
	getInitialState: function() {
	    return {
	    	enable: false,
	    };
  	},

  	getDefaultProps() {
  		return {
            show: true
        }
  	},
 
	handleChange: function(date) {
  		var date = new Date(date);
  		if(this.props.data) 
  			this.props.data.set(date);

		this.setState({
			startDate: date
		});
	},
 
	render: function() {
		let props = {};

		let date = this.props.data.get();
		if(date)
			props.selected = moment(date);

		return <DatePicker
			dateFormat="DD/MM/YYYY"
			placeholderText='Дата'
		    disabled={!this.props.enable}
		    onChange={this.handleChange} 
		    locale='ru-ru'
		    {...props}
		/>;
	}
});

module.exports.DateFieldLabel = React.createClass({
	render: function() {
		return (
			<div className=''>
				<p className='label'>{this.props.label}</p>
				<module.exports.DateField data={this.props.data} enable={this.props.enable} />
				<p className='last_editor'>{this.props.editor}</p>
			</div>
		)
	}
});