import React from 'react';
import FieldText from './../fieldText/fieldText.js';
import './date.css';

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
			date : this.props.date ? this.props.date.toISOString().slice(0, 10) : ''
		}
  	},

  	handlText(text) {
  		console.log(text);
  	},

	render: function() {
		return (
			<div className='inline'>
				<FieldText label={this.props.label} text={new WrapperText(this.text, this.props.accept)} />
			</div>
		)
	}
});