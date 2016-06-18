import React from 'react';
import Button from './../button/button.js';
import FieldText from './../fieldText/fieldText.js';
import ComboBox from './../comboBox/comboBox.js';
import CheckBox from './../checkBox/checkBox.js';
import { DateFieldLabel, DateField } from './../date/date.js';
import Textarea from './../textarea/textarea.js';
import WrapperData from './../src/wrapperData.js';
import { Validator, ConditionsKit, fillField } from './../src/validator.js';

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
		this.props.user.setСontroll(this);
		this.validator = new Validator();
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
					<Button text='Принять' click={() => this.validator.check( () => this.props.handleClick(this.handleOk()), ()=>{} )} />
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
			<FieldText label='Название объекта' text={new WrapperData(this.record, 'name', '')} focus={true} enable={this.enable}/>
		</div> 
	},

	createComboBox(name, wrapperData) {
		let items = this.props.data.refTables[wrapperData.name]
			.map(x => { return { value: x.id, label: x.name } });
		
		if(!wrapperData.get())
			items.splice(0,0, { value: 0, label: '' } );

		return (
			<ComboBox label={name} value={wrapperData.get()} options={items} onChange={e => wrapperData.set(e.target.value)} />
		)
	},

	createWrapper(name, defualt) {
		return new WrapperData(this.record, this.props.data.record, name, defualt); 
	},

	setDefault(name, value) {
		if(!this.record[name])
			this.record[name] = value;
	},

	getForm_apz() {
		return (<div className='form-content'>
					<FieldText label='Название объекта' text={this.createWrapper('name', '')} enable={this.enable} focus={true} />
					<FieldText label='Адрес объекта' text={this.createWrapper('adress', '')} enable={this.enable}/>
					<DateFieldLabel label='Дата выдачи АПЗ' data={this.createWrapper('date_out_apz',new Date())} />
					<DateFieldLabel label='Дата решения исполкома' data={this.createWrapper('date_solution',new Date())} />
					{this.createComboBox('Функциональная зона', this.createWrapper('func_zone', false))}
					<FieldText label='Номер регистрационной записи' text={this.createWrapper('num_reg_rec', '')} enable={this.enable}/>
					<Textarea label='Заметка' text={this.createWrapper('note', '')} />
				</div>);
	},

	getForm_citypassport() {
		let createField = function(className, label, nameField, focus) {
			return (<FieldText 
				className={className + ' indent'}
				label={label}
				text={this.createWrapper(nameField, '')}
				validator={this.validator.get(fillField)}
				enable={this.enable}
				focus={focus} />);
		}

		let createFieldSolGIK = function(label, fieldName) {
			return (<SolutionGIK recordNew = {this.record} recordOld = {this.props.data.record} label={label} fieldName={fieldName} />);
		}

		return (<div className='form-content'>
					{createField.bind(this)('fieldtext-width', 'Наименование объекта', 'name', true)}
					{createField.bind(this)('fieldtext-width', 'Адрес объекта', 'adress')}
					<FieldText className='fieldtext-line indent' label='Площадь участка, Га' text={this.createWrapper('area', '')} validator={this.validator.get(fillField)} enable={this.enable} numeric={true} />
					{createField.bind(this)('fieldtext-width', 'Победитель аукциона', 'winnerauction')}
					{createFieldSolGIK.bind(this)('Решение ГИК на разработку градопаспорта','solgik_develpass')}
					{createFieldSolGIK.bind(this)('Решение ГИК об утверждении градопаспорта','solgik_statepass')}
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

let SolutionGIK = React.createClass({
	getInitialState() {
		let getValue = x => this.props.recordOld[this.props.fieldName + x];
		let checked = getValue('_num') && getValue('_date');

		return {
			checked: checked,
			acceptor: this.setChecked(checked)
		}
	},

	setChecked(check) {
		if(check) return this.props.recordNew;
		this.setNull();
		return {};
	},

	setNull() {
		let setValue = (name) => {
			this.props.recordNew[this.props.fieldName + name] = null;
		}
		setValue('_num');
		setValue('_date');
	},

	handlOnChange(e) {
		this.setState({checked: e, acceptor:this.setChecked(e)});
	},

	createWrapper(name, defualt) {
		return new WrapperData(this.state.acceptor, this.props.recordOld, name, defualt);
	},

	render() {
		return(	<div className='indent solution_gik'>
					<CheckBox label = {this.props.label} onChange={this.handlOnChange} checked={this.state.checked}/>
					<FieldText className='fieldtext-line' label='№' text={this.createWrapper(this.props.fieldName + '_num', '')} enable={this.state.checked} />
					<DateField data={this.createWrapper(this.props.fieldName + '_date', new Date())} enable={this.state.checked} />
				</div>
				)
	}
});