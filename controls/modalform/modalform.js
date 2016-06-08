import React from 'react';
import ReactDOM from 'react-dom';

import FormInput from './../formInput/formInput.js'
import FormFilter from './../formFilter/formFilter.js'

import './modalform.css';

let Shadow = React.createClass({
	render: function() {
		return (<div className='form-shadow'></div>)
	}
});

let setState;

let FormBox = React.createClass({
	
	getInitialState: function() {
    	return { visible: false };
  	},

  	componentDidMount() {
  		setState = this.setState.bind(this);
  	},

	render: function() {
		if(!this.state.visible) 
			return (<div></div>);

		return (<div>
			<Shadow />
			{this.state.form}
		</div>)
	}
});

ReactDOM.render(
    <FormBox />,
    document.getElementById('modalform')
);

let f1 = function(handlActions, data, user) {
	return <FormInput handleClick={handlActions} data={data} user={user} />;
}

let f2 = function(handlActions, data, user) {
	return <FormFilter handleClick={handlActions} data={data} user={user} />;
}

const forms = {
	'fm_input':f1, 
	'fm_filter':f2
}

module.exports.showForm = function(user, data, typeform) {

	let ff = function(resolve, reject) {

		let handlActions = function(res) {
			if(res)
				resolve(res);
			setState({ visible: false });
		};

		setState( {
			visible: true,
			form: forms[typeform](handlActions, data, user)
	 	} );
	};

	return new Promise(ff);
}