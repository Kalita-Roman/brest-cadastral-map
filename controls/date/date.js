import React from 'react';
import Calendar from 'react-input-calendar';
import FieldText from './../fieldText/fieldText.js';
import './date.css';
import './../../node_modules/react-input-calendar/style/index.css'

let WrapperText = function(data, cb) {
	this.set = function(value) {
		let res = value.match(/\d{4}-\d{2}-\d{2}/);
		if(res){
			let dt = new Date(res[0]);
			cb(dt);
		}
		data.date = value;
	};

	this.get = function() {
		return data.date;
	}
}

module.exports = React.createClass({

	componentWillMount() {
		this.text = {
			date : this.props.date.toLocaleString().slice(0, 10)
		}
  	},

  	onChange(e) {
  		var date = new Date(e);
  		this.props.accept(date);
  	},

	render: function() {
		return (
			<div className='inliner'>
				<p className='label'>{this.props.label}</p>
				<Calendar 
					format='DD/MM/YYYY' 
					date={this.props.date}
					onChange={this.onChange}
					hideOnBlur={true} 
					inputName='name_1'
					/>
			</div>
		)
	}
});