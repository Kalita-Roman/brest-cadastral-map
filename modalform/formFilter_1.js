import React from 'react';
import Button from './button/button.js';
import CtrlDate from './date/date.js';
import './modalform.css';


const start = { value: null };
const end = { value: null };

let Wrapper = function()
{

}


module.exports = React.createClass({
	
	f1: {
		filterName: 'rangeDate',
		start: null,
		end: null
	},

	HandleOk() {
		console.log(this.f1);
		return [ this.f1 ];
	},

	render: function() {
		let range = null;
		if( this.props.data.filters )
			this.f1 = this.props.data.filters.find(x => x.filterName === 'rangeDate');
		console.log(this.f1);

		return (<div className='form-input'>
					<div className='form-content'>
						<h1>Фильтр для: {this.props.data.layer}</h1>	
						<div>
							<h2>Выбор по дате создания</h2> 
							<div>
								<CtrlDate label='От' date={this.f1.start} accept={x => this.f1.start = x}/>
								<CtrlDate label='До' date={this.f1.end} accept={x => this.f1.end = x}/>
							</div>
						</div>
					</div>
					<div className='buttomsbar'>
						<Button text='Принять' click={() => this.props.handleClick(this.HandleOk())} />
						<Button text='Отмена' click={() => this.props.handleClick()} />
					</div>
				</div>)
	}
});
