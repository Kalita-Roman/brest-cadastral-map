import React from 'react';
import Button from './../button/button.js';
import FieldText from './../fieldText/fieldText.js';
import ComboBox from './../comboBox/comboBox.js';

import './../modalform/modalform.css';
import './formInput.css';

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
				date: ''
			};
	
		this.validations = [];
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
					<Button text='Принять' click={() => { 
						this.validation( () => this.props.handleClick(this.handleOk()) )
					}} />
					<Button text='Отмена' click={() => this.props.handleClick()} />
				</div>
			)
  		}
  		this.enable = true;
  	},

	validation(ok, err) {
		if( this.validations.every(x => x()) )
			ok();
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
		if(this.record[table] === '0'){
			items.splice(0,0, { value: 0, label: '' } );
		}

		let handlChange = function(e) {
			this.record[table] = e.target.value;
		}

		return (
			<ComboBox label={name} value={this.record[table]} options={items} onChange={e => this.record[table] = e.target.value} />
		)
	},

	createValidation(nameField, funcCheck, funcError) {
		let item = () => {
			let value = this.record[nameField];
			if(funcCheck(value))
				return true;
			if(funcError)
				funcError();
			return false; 
		};
		this.validations.push(item);
	},


	setDefault(name, value) {
		if(!this.record[name])
			this.record[name] = value;
	},

	getForm_1() {
		this.createValidation('type_build', x => x !== '0', () => alert('Не указан вид строительства'));
		this.setDefault('type_build', '0');
		return (<div className='form-content'>
					{this.getFieldName()}
					{this.createComboBox('Вид строительства', 'type_build')}
				</div>);
	},

	getForm_2() {
		this.createValidation('type_project', x => x !== '0', () => alert('Не указан тип проекта'));
		this.setDefault('type_project', '0');
		return (<div className='form-content'>
					{this.getFieldName()}
					{this.createComboBox('Тип проекта', 'type_project')}
				</div>);
	},

	render: function() {
		let getFrom = this[this.props.data.layer.form];
		return (<div className='form-input formInput'>
					{getFrom()}
					{this.getButtoms()}
				</div>)
	}
});