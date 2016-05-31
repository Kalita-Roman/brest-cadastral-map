import React from 'react';
import Button from './button/button.js';
import FieldText from './fieldText/fieldText.js';
import './modalform.css';
import './forminput.css';

let WrapperData = function(data, name) {
	this.set = function(value) {
		data[name] = value;
	}

	this.get = function() {
		return data[name];
	}
}

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


module.exports = React.createClass({

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
						<div className="name">
							<FieldText label='Название объекта' text={new WrapperData(this.data, 'name')} focus={true} />
						</div>
					</div>
					{this.getButtoms()}
				</div>)
	}
});