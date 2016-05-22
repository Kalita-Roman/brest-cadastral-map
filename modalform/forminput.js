import React from 'react';
import './modalform.css';

let Button =  React.createClass({
	render: function() {
		return (
			<button className='form-button' onClick={this.props.click}>
				{this.props.text}
			</button>
		)
	}
});

let FieldText = React.createClass({
	getInitialState: function() {
    	return { value: '' };
  	},
  	handleChange: function(event) {
    	this.setState({value: event.target.value});
    	this.sendData(event.target.value);
  	},

  	sendData:  x => {},

	render: function() {
		this.sendData = this.props.setData;

		return (
			<div className='input-box'>
				<label className='label'>{this.props.label}</label>
				<input className='input-text' type="text" value={this.state.value} onChange={this.handleChange}/>
			</div>
		)
	}
});

module.exports.FormInput = React.createClass({
	render: function() {
		let data = {
			name: "",
			customer: "",
			date: ""
		}

		let handleOk = function(e) {
			return { 
				value: true,
				data: data
			 };
		};

		return (<div className='form-input'>
					<div className='form-content'>
						<FieldText label='Название объекта' setData={x => data.name = x} />
					</div>
					<div className='buttomsbar'>
						<Button text='Принять' click={() => this.props.handleClick(handleOk())} />
						<Button text='Отмена' click={() => this.props.handleClick()} />
					</div>
				</div>)
	}
						//<FieldText label='Заказчик' setData={x => data.customer = x} />
						//<FieldText label='Дата' setData={x => data.date = x} />
});