import React from 'react';
import Button from './../button/button.js';
import FieldText from './../fieldText/fieldText.js';
import ComboBox from './../comboBox/comboBox.js';
import DateBox from './../date/date.js';
import Textarea from './../textarea/textarea.js';
import WrapperData from './../src/wrapperData.js';

import './../modalform/modalform.css';
import './formInput.css';

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
		this.record = {};
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
			<FieldText label='Название объекта' text={new WrapperData(this.record, 'name', '')} focus={true} enable={this.enable}/>
		</div> 
	},

	createComboBox(name, wrapperData) {
		console.log(this.props.data);
		let items = this.props.data.refTables[wrapperData.name]
			.map(x => { return { value: x.id, label: x.name } });
		
		if(!wrapperData.get())
			items.splice(0,0, { value: 0, label: '' } );

		return (
			<ComboBox label={name} value={wrapperData.get()} options={items} onChange={e => wrapperData.set(e.target.value)} />
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

	createWrapper(name, defualt) {
		return new WrapperData(this.record, this.props.record, name, defualt);
	},

	setDefault(name, value) {
		if(!this.record[name])
			this.record[name] = value;
	},

	getForm_apz() {
		return (<div className='form-content'>
					<FieldText label='Название объекта' text={this.createWrapper('name', '')} enable={this.enable} focus={true} />
					<FieldText label='Адрес объекта' text={this.createWrapper('adress', '')} enable={this.enable}/>
					<DateBox label='Дата выдачи АПЗ' data={this.createWrapper('date_out_apz',new Date())} />
					<DateBox label='Дата решения исполкома' data={this.createWrapper('date_solution',new Date())} />
					{this.createComboBox('Функциональная зона', this.createWrapper('func_zone', false))}
					<FieldText label='Номер регистрационной записи' text={this.createWrapper('num_reg_rec', '')} enable={this.enable}/>
					<Textarea label='Заметка' text={this.createWrapper('note', '')} />
				</div>);
	},

	getForm_citypassport() {
		return (<div className='form-content'>
					<FieldText label='Название' text={this.createWrapper('name', '')} enable={this.enable} focus={true} />
					<FieldText label='Адрес объекта' text={this.createWrapper('adress', '')} enable={this.enable}/>
					<DateBox label='Дата регистрации' data={this.createWrapper('date_reg', new Date())} />
					<FieldText label='Площадь участка, м2' text={this.createWrapper('area', '')} enable={this.enable} />
					<Textarea label='Заметка' text={this.createWrapper('note', '')} />
				</div>);
	},

	render: function() {
		let getFrom = this[this.props.data.layer.form];
		return (<div className='formInput'>
					{getFrom()}
					{this.getButtoms()}
				</div>)
	}
});
