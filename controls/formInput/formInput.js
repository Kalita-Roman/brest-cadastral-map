import React from 'react';
import Button from './../button/button.js';
import FieldText from './../fieldText/fieldText.js';
import ComboBox from './../comboBox/comboBox.js';
import CheckBox from './../checkBox/checkBox.js';
import { DateFieldLabel, DateField } from './../date/date.js';
import Textarea from './../textarea/textarea.js';
import FieldSolution from './../fieldSolution/fieldSolution.js';
import WrapperData from './../src/wrapperData.js';
import { Validator, ConditionsKit, fillField, selectField } from './../src/validator.js';

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

	createComboBox(label, nameField) {
		let wrapperData = this.createWrapper(nameField, false);

		let items = this.props.data.refTables[nameField]
			.map(x => { return { value: x.id, label: x.name } });
		
		if(!wrapperData.get())
			items.splice(0,0, { value: 0, label: '' } );

		console.log(wrapperData.get());

		return (
			<ComboBox 
				//className={'margin-bottom'}
				label={label} 
				value={wrapperData.get()} 
				options={items} 
				validator={this.validator.get(selectField)}
				onChange={e => wrapperData.set(e.target.value)}
				editor={this.getEditor(nameField)}
				enable={this.enable}
			/>
		)
	},

	createWrapper(name, defualt) {
		return new WrapperData(this.record, this.props.data.record, name, defualt); 
	},

	setDefault(name, value) {
		if(!this.record[name])
			this.record[name] = value;
	},

	createField(className, label, nameField, flags) {
		let arrFlags = flags ? Array.from(flags) : flags=[];
		return (<FieldText 
			className={className + ' margin-bottom'}
			label={label}
			text={this.createWrapper(nameField, '')}
			validator={this.validator.get(fillField)}
			enable={this.enable}
			focus={arrFlags.includes('focus')}
			numeric={arrFlags.includes('numeric')} 
			editor={this.getEditor(nameField)}
			/>);
	},

	createFieldSolution(label, nameField, names, className) {
		let nameEditor = '';
			if(this.props.data.record) {
				let editor = this.props.data.record.editors[nameField + '_num']||this.props.data.record.editors[nameField + '_date'];
				nameEditor = this.getNameEditor(editor);
			}
		return (<FieldSolution 
			recordNew = {this.record} 
			recordOld = {this.props.data.record} 
			className={className + ' margin-bottom'}
			label={label}
			nameField={nameField}
			editor={nameEditor}
			enable={this.enable}
			type={names}/>)
	},

	createFieldSolution_s(label, nameField) {
		const names = {type: 'getType_1', date: '_date', note: '_note'};
		return this.createFieldSolution(label, nameField, names, 'solution');
	},

	createFieldSolution_gik(label, nameField) {
		const names = {type: 'getType_2', date: '_date', note: '_num'};
		return this.createFieldSolution(label, nameField, names, 'solutiongik');
	},

	createDate(label, nameField) {
		return (
				<DateFieldLabel 
					label={label}
					data={new WrapperData(this.record, this.props.data.record, nameField, null)} 
					enable={this.enable}
					editor={this.getEditor(nameField)}
					show={true}
				/>
				);
	},

	createDateRange(label, partName) {
		return (<div className='range_dates'>
			<p className='label'>{label}</p>
			<div className='dates'>
				{this.createDate('Начало', 'date_start_'+partName)}
				{this.createDate('Окончание', 'date_end_'+partName)}
			</div>
		</div>);
	},

	getForm_apz() {
		return (<div className='content-input'>
					{this.createField('fieldtext-width', 'Наименование объекта', 'name', ['focus'])}
					{this.createField('fieldtext-width', 'Адрес объекта', 'adress')}
					{this.createField('fieldtext-width', 'Заказчик', 'customer')}
					{this.createComboBox('Вид строительства', 'kind_building')}
					{this.createFieldSolution_s('Архитектурно-планировочное задание', 'task')}
					{this.createFieldSolution_s('Согласование гл. архитектора города', 'architect')}
					{this.createFieldSolution_s('Экспертиза проекта', 'expertise')}
					{this.createFieldSolution_s('Решение Госстройнадзора', 'gosstroynadzor')}
					{this.createFieldSolution_s('Регистрация в реестре', 'registry')}
					{this.createDateRange('Сроки строительства проектные', 'proj')}
					{this.createDateRange('Сроки строительства фактические', 'fact')}
				</div>);
	},

	getNameEditor(editor) {
		return editor ? editor.name + ' ' + (new Date(editor.date)).toLocaleDateString() : '';
	},

	getEditor(nameField) {
		let flag = this.props.data.record && this.props.data.record.editors[nameField];
		return flag ? this.getNameEditor(this.props.data.record.editors[nameField]) : '';
	},

	getForm_citypassport() {
		const names = {type: 'getType_2', date: '_date', note: '_num'}

		return (<div className='content-input'>
					{this.createField('fieldtext-width', 'Наименование объекта', 'name', ['focus'])}
					{this.createField('fieldtext-width', 'Адрес объекта', 'adress')}
					{this.createField('fieldtext-line', 'Площадь участка, Га', 'area', ['numeric'])}
					{this.createField('fieldtext-width', 'Победитель аукциона', 'winnerauction')}
					{this.createFieldSolution_gik('Решение ГИК на разработку градопаспорта','solgik_develpass')}
					{this.createFieldSolution_gik('Решение ГИК об утверждении градопаспорта','solgik_statepass')}
					<Textarea label='Заметка' text={this.createWrapper('note', '')} enable={this.enable} editor={this.getEditor('note')} />
				</div>);
	},

	render: function() {
		let getFrom = this[this.props.data.layer.form];
		return (<div className='form-content'>
					<h1 className='name_form'>{this.props.data.layer.name}</h1>
					{getFrom()}
					{this.getButtoms()}
				</div>)
	}
});