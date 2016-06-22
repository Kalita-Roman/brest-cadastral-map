import React from 'react';
import './button-led.css';

module.exports = React.createClass({
	handlerClick(e) {
		e.stopPropagation();
		this.props.onClick();
	},

	render () {
		let clOn = this.props.on
			? 'button-on'
			: 'button-off';
		let clName = 'button-led-body ' +  clOn;
		let className = this.props.className ? ' ' + this.props.className : '';
		return (
			<div className={"button-led-round"+className} >
				<div className={clName} onClick={this.handlerClick}>
				</div>
			</div>
		);
	}
});