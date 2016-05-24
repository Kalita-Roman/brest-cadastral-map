import React from 'react';
import ReactDOM from 'react-dom';
import './modalform.css';
import { FormInput } from './forminput.js'




let Shadow = React.createClass({
	render: function() {
		return (<div className='form-shadow'></div>)
	}
});

let f;

let FormBox = React.createClass({
	
	getInitialState: function() {
    	return { value: false };
  	},

  	componentDidMount() {
  		f = this.setState.bind(this);
  	},

	render: function() {
		if(!this.state.value) 
			return (<div></div>);

		return (<div>
			<Shadow />
			<FormInput handleClick = {this.state.handleClick}/>
		</div>)
	}
});

ReactDOM.render(
    <FormBox />,
    document.getElementById('modalform')
);

module.exports.show = function(callBack) {
	f( {
			value: true,
			handleClick(res) {
					callBack(res);
					f({ value: false });
				}
	 } );
}

module.exports.showForm = function() {
	return new Promise((resolve, reject) => {
		f( {
			value: true,
			handleClick(res) {
					resolve(res);
					f({ value: false });
				}
	 	} );
	})
}