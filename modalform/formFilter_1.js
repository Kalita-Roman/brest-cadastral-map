import React from 'react';
import Button from './button.js';
import './modalform.css';

module.exports.FormFilter_1 = React.createClass({
	render: function() {
		return (<div className='form-input'>
					<div className='form-content'>
						фильтр 1						
					</div>
					<div className='buttomsbar'>
						<Button text='Принять' click={() => this.props.handleClick()} />
						<Button text='Отмена' click={() => this.props.handleClick()} />
					</div>
				</div>)
	}
});