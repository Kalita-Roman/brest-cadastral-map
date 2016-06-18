import React from 'react';
import Button from './../button/button.js';
import FieldText from './../fieldText/fieldText.js';
import ComboBox from './../comboBox/comboBox.js';
import CheckBox from './../checkBox/checkBox.js';
import WrapperData from './../src/wrapperData.js'
import { Validator, ConditionsKit, fillField } from './../src/validator.js';
import './../modalform/modalform.css';
import './formEditors.css';

let Row = React.createClass({
	render() {
		let user = this.props.user;
		return (
			<div className={this.props.className}>
				<div className='indent'>
					<div className='cols'>
						<p className='col row-login'>{user.username}</p>
						<p className='col row-name'>{user.name}</p>
						<p className='col row-post'>{user.post}</p>
					</div>
				</div>
				<div className='fixedwidth'>
					{this.props.btn}
				</div>
			</div>
		)
	}
});

let Table = React.createClass({
	render() {
		let createBtn = e => { return (<button onClick={ x => this.props.edit(e) } className='btn'>Редактировать</button>) };
		let items = this.props.items.map((e, i) => { return ( <Row className='row' key={i} user={e} btn={createBtn(e)} /> ) });
		
		return (
			<div className='table'>
				{items}
			</div>
		)
	}
});





module.exports = React.createClass({

	getInitialState() {
		return { form: 'table' }
	},
	
	HandleOk() {
		return this.result;
	},

	componentWillMount() {
		this.validator = new Validator();
	},

	edit(user) {
		this.replaceState({ form: 'userEdit', currentUser: user });
	},

	add() {
		
		this.replaceState({ form: 'userEdit' });
	},

	toTable() {
		this.setState({ form: 'table' });
	},

	

	userEdit() {
		let newRec = {};

		let editorDelete = function () {
			this.props.handleClick({ 
				action: 'editorDelete',
				user: this.state.currentUser
			});
		};

		let editorUpdate = function () {

			let update = function() {
				newRec.id = this.state.currentUser.id;
				this.props.handleClick({ 
					action: 'editorUpdate',
					user: newRec
				});
			};

			this.validator.check(update.bind(this), x => console.log('no valid'));
		};

		let editorInsert = function() {
			let insert = function() { 
				this.props.handleClick({ 
					action: 'editorInsert',
					user: newRec
				});
			}

			this.validator.check(insert.bind(this), x => console.log('no valid'));
		};

		let buttonsEdit = (<div className='buttomsbar'>
						<Button text='Удалить' click={editorDelete.bind(this)}/>
						<Button text='Применить' click={editorUpdate.bind(this)}/>
						<Button text='Отмена' click={this.toTable}/>
					</div>);

		let buttonsAdd = (<div className='buttomsbar'>
						<Button text='Добавить' click={editorInsert.bind(this)} />
						<Button text='Отмена' click={() => this.toTable()} />
					</div>);

		let buttons = this.state.currentUser ? buttonsEdit : buttonsAdd;

		let createWrapper = function(name) {
			return new WrapperData(newRec, this.state.currentUser, name, '');
		};

		

		let check = function(value) { 
				let u = this.props.data.find(x => x.username === value);
				if(!u) return true;
				return this.state.currentUser && this.state.currentUser.id === u.id;
			};

		const checkUserName = {
			check: check.bind(this),
			message: 'Такой пользователь уже существует.'
		};

		let ch = new ConditionsKit(fillField, checkUserName);

		return (<div>
					<div className='form-content'>
						<FieldText label='ФИО' text={createWrapper.bind(this)('name')} validator={this.validator.get(fillField)} focus={true} />
						<FieldText label='Должность' text={createWrapper.bind(this)('post')} validator={this.validator.get(fillField)} />
						<FieldText label='Пользователь' text={createWrapper.bind(this)( 'username')} validator={this.validator.get(ch)} />
						<FieldText label='Пароль' text={createWrapper.bind(this)('password')} validator={this.validator.get(fillField)} />
					</div>
					{buttons}
			</div>);
	},

	table() {
		let h = {
			username: 'Пользователь',
			name: 'ФИО',
			post: 'Должность'
		}

		return (<div>
					<div className='form-content'>
						<Button text='Добавить редактора' click={this.add} />
						<Row className='row head' user={h}  btn={''}/>
						<Table items={this.props.data} edit={this.edit}/>
					</div>
					<div className='buttomsbar'>
						<Button text='Закрыть' click={() => this.props.handleClick('close')} />
					</div>
				</div>);
	},

	render: function() {
		return this[this.state.form]();
	}
});
