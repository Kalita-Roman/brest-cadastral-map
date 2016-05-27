import React from 'react';
import './modalform.css';

module.exports = React.createClass({
	render: function() {
		return (
			<button className='form-button' onClick={this.props.click}>
				{this.props.text}
			</button>
		)
	}
});