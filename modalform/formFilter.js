import React from 'react';
import Button from './button/button.js';
import CtrlDate from './date/date.js';
import ComboBox from './comboBox/comboBox.js';
import './modalform.css';

let CheckBox = React.createClass({
	getInitialState() {
		return { 
			checked: this.props.checked,
		}
	},

	handlerСheckbox(e) {
		e.stopPropagation();
		this.setState( { checked: e.target.checked } );
		if(this.props.onChange)
			this.props.onChange(e.target.checked);
	},

	render() {
		return (
				<div className='ccc'>
					<input type='checkbox' checked={this.state.checked} onChange={this.handlerСheckbox} />
					<label>{this.props.label}</label>
				</div>
			);
	}
});

let CounterFilter = function(accept) {

	let list = [];

	let getArray = function() {
		return list.reduce((prev, cur) => { if(cur.flag) prev.push(cur.id) ; return prev } ,[]);
	}

	this.create = function (id, flag) {
		let item = { id: id, flag: flag };
		list.push(item);
		return x => { item.flag = x; accept(getArray()) };
	}
};

module.exports = React.createClass({
	
	HandleOk() {
		return this.result;
	},

	componentWillMount() {
		this.result = [];
		this.f1 = this.props.data.layer.filters.find(x => x.filterName === 'rangeDate');
		this.result.push(this.f1);
	},

	getDataFromTables(table) {
		return this.props.data.tables.find(x => x.name === table).data
	},

	createCheckBoxes(name, table, filter) {
		let counter = new CounterFilter(x => filter.value = x);
		let values = filter.value;
		let items = this.getDataFromTables(table)
			.map((e, i) => { 
				let checked = values.includes(e.id);
				return <CheckBox key={i} label={e.name}  checked={checked} onChange={counter.create(e.id, checked)} />
			});

		return items;
	},

	getFilter(nameTable) {
		console.log(this.props.data.layer.filters);
		let f = this.props.data.layer.filters.find(x => x.filterName === nameTable);
		if(!f)
			f = { filterName: nameTable, value: this.getDataFromTables(nameTable).map(e => e.id) };
		this.result.push(f);
		return f
	},

	getForm_1() {
		let filter = this.getFilter('type_build');
		return (<div className='form-content'>
					{this.createCheckBoxes('Виды строительства', 'type_build', filter )}
				</div>);
	},

	getForm_2() {
		let filter = this.getFilter('type_project');
		return (<div className='form-content'>
					{this.createCheckBoxes('Тип проекта', 'type_project', filter )}
				</div>);
	},

	render: function() {

		return (<div className='form-input'>
					<div className='form-content'>
						<h1>Фильтр для: {this.props.data.layer.name}</h1>	
						<div>
							<h2>Выбор по дате создания</h2> 
							<div>
								<CtrlDate label='От' date={this.f1.start} accept={x => this.f1.start = x} />
								<CtrlDate label='До' date={this.f1.end} accept={x => this.f1.end = x} />
							</div>
							{this[this.props.data.layer.form]()}
						</div>
					</div>
					<div className='buttomsbar'>
						<Button text='Принять' click={() => this.props.handleClick(this.HandleOk())} />
						<Button text='Отмена' click={() => this.props.handleClick()} />
					</div>
				</div>)
	}
});
