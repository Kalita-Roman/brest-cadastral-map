import React from 'react';

import './userLabel.css';

module.exports = React.createClass({

	componentWillMount() {
		this.props.role.setСontroll(this);
	},

	setEditor() {
		this.buttons = null;
	},

	setAdmin() {
		this.buttons = (
				<button className='likebutton' onClick={e => this.props.pubsub.publish('showEditors', 'ред')}>Редакторы</button>
			);
	},

	render() {
		let user = this.props.role.user;
		return (
			<div className='userLabel'>
				<h1 className='userHead'>Пользователь:</h1>
				<p className='userName' >{user.name}</p>
				<p className='userPost' >{user.post}</p>
				{this.buttons}
				<a className='userExit likebutton' href="/logout">Выход</a>
			</div>
		);
	}
});