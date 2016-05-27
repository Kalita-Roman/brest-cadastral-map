import React from 'react';
import Button from './button.js';
import './modalform.css';
/*
let Button =  React.createClass({
	render: function() {
		return (
			<button className='form-button' onClick={this.props.click}>
				{this.props.text}
			</button>
		)
	}
});*/

let WrapperData = function(data, name) {
	this.set = function(value) {
		data[name] = value;
	}

	this.get = function() {
		return data[name];
	}
}

let FieldText = React.createClass({
	getInitialState: function() {
    	return { value: this.props.text.get() };
  	},
  	handleChange: function(event) {
    	this.setState({value: event.target.value});
    	this.props.text.set(event.target.value);
  	},

	render: function() {
		return (
			<div className='input-box'>
				<label className='label'>{this.props.label}</label>
				<input className='input-text' type="text" value={this.state.value} onChange={this.handleChange}/>
			</div>
		)
	}
});

let getButtomsVisitor = function() {
	return (
		<div className='buttomsbar'>
			<Button text='Закрыть' click={() => this.props.handleClick()} />
		</div>
	)
} 

let getButtomsEditor = function() {
	return (
		<div className='buttomsbar'>
			<Button text='Принять' click={() => this.props.handleClick(handleOk())} />
			<Button text='Отмена' click={() => this.props.handleClick()} />
		</div>
	)
}


module.exports.FormInput = React.createClass({

	componentWillMount() {
		this.data = this.props.data 
			? this.props.data
			: {
				name: "",
				customer: "",
				date: ""
			};
		this.props.user.setСontroll(this);
  	},

  	setVisitor() {
  		this.getButtoms = () => {
  			return (
				<div className='buttomsbar'>
					<Button text='Закрыть' click={() => this.props.handleClick()} />
				</div>
			)
  		}
  	},

  	setEditor() {
  		this.getButtoms = () => {
  			return (
				<div className='buttomsbar'>
					<Button text='Принять' click={() => this.props.handleClick(this.handleOk())} />
					<Button text='Отмена' click={() => this.props.handleClick()} />
				</div>
			)
  		}
  	},
	
	handleOk() {
		return { 
			value: true,
			data: this.data
		 };
	},

	render: function() {
		return (<div className='form-input'>
					<div className='form-content'>
						<FieldText label='Название объекта' text={new WrapperData(this.data, 'name')}/>
					</div>
					{this.getButtoms()}
				</div>)
	}
});