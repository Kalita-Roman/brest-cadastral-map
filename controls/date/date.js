import React from 'react';
import Calendar from 'react-input-calendar';
import FieldText from './../fieldText/fieldText.js';
import './date.css';
import './../../node_modules/react-input-calendar/style/index.css'

module.exports.DateField = React.createClass({
	getDefaultProps() {
		return {
			enable: false
		}
	},

	componentWillMount() {
		if(this.props.data) {
			this.text = {
				date : this.props.data.get().toLocaleString().slice(0, 10)
			};
			return;
		}

		this.text = {
			date : this.props.date.toLocaleString().slice(0, 10)
		}
  	},

  	onChange(e) {
  		var date = new Date(e);
  		console.log(date);
  		if(this.props.data) {
  			this.props.data.set(date);
  			return;
  		}
  		this.props.accept(date);
  	},

	render: function() {
		return (
			<div className='calendar'>
				<Calendar 
					format='DD/MM/YYYY' 
					date={this.props.data.get()}
					onChange={this.onChange}
					hideOnBlur={true} 
					inputName='name_1'
					disabled={!this.props.enable}
					/>
			</div>
		)
	}
});

module.exports.DateFieldLabel = React.createClass({
	render: function() {
		return (
			<div className='inliner'>
				<p className='label'>{this.props.label}</p>
				<module.exports.DateField data={this.props.data}/>
			</div>
		)
	}
		/*<Calendar 
					format='DD/MM/YYYY' 
					date={this.props.data.get()}
					onChange={this.onChange}
					hideOnBlur={true} 
					inputName='name_1'
					/>*/
});