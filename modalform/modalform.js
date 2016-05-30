import React from 'react';
import ReactDOM from 'react-dom';

import FormInput from './forminput.js'
import FormFilter_1 from './formFilter_1.js'

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

let factoryForm = function(typeform) {
	if(typeform === 'fm_input') { return f1; };
	if(typeform === 'fm_filter_1') { return f2; };
}

let f1 = function(handlActions, data, user) {
	return <FormInput handleClick={handlActions} data={data} user={user} />;
}

let f2 = function(handlActions, data, user) {
	return <FormFilter_1 handleClick={handlActions} data={data} user={user} />;
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
			form: factoryForm(typeform)(handlActions, data, user)
	 	} );
	};

	return new Promise(ff);
}