import React from 'react';
import Button from './button/button.js';
import FieldText from './fieldText/fieldText.js';
import ComboBox from './comboBox/comboBox.js';
//import requests from './src/requests.js';
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
		this.record = this.props.data.record 
			? this.props.data.record 
			: {
				name: '',
				customer: '',
				date: '',
				type_build: '1'
			};
		if(!this.record.type_build)
			this.record.type_build = '1';

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
  		this.enable = false;
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
  		this.enable = true;
  	},
	
	handleOk() {
		return { 
			value: true,
			data: this.record
		 };
	},

	getFieldName()  { 
		return <div className="name">
			<FieldText label='Название объекта' text={new WrapperData(this.record, 'name')} focus={true} enable={this.enable}/>
		</div> 
	},

	createComboBox(name, table) {
		let items = this.props.data.tables
			.find(x => x.name === table).data
			.map(x => { return { value: x.id, label: x.name } });

		return (
				<div>
					<p>{name}</p>
					<ComboBox value={this.record[table]} options={items} onChange={x => { this.record[table] = x.target.value }} />
				</div>
			)
	},

	getForm_1() {
		return (<div className='form-content'>
					{this.getFieldName()}
					{this.createComboBox('Вид строительства', 'type_build')}
				</div>);
	},

	getForm_2() {
		return (<div className='form-content'>
					{this.getFieldName()}
					{this.createComboBox('Тип проекта', 'type_project')}
				</div>);
	},

	render: function() {
		let getFrom = this[this.props.data.layer.form];
		return (<div className='form-input'>
					{getFrom()}
					{this.getButtoms()}
				</div>)
	}
});