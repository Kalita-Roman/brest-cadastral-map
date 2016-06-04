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
    	return { value: this.props.value };
  	},

  	handlChange(e) {
		this.setState( { value: e.target.value } );
		this.props.onChange(e);
	},


	render() {
		let options = this.props.options.map((e, i) => 
				<Option key={i} value={e.value} label={e.label} />
			);

		return (
			<select value={this.state.value} onChange={this.handlChange}>
				{options}
			</select>
		)
	}
});