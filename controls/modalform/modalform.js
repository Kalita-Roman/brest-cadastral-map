import React from 'react';
import ReactDOM from 'react-dom';

import FormInput from './../formInput/formInput.js'
import FormFilter from './../formFilter/formFilter.js'
import FormEditors from './../formEditors/formEditors.js'

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
			<div className='form-box-t'>
				<div className='form-box-c'>
					<div className='form-body'>
						{this.state.form}
					</div>
				</div>
			</div>
		</div>)
	}
});

ReactDOM.render(
    <FormBox />,
    document.getElementById('modalform')
);

const forms = {
	fm_input(handlActions, data, user) {
		return <FormInput handleClick={handlActions} data={data} user={user} />;
	}, 

	fm_filter(handlActions, data, user) {
		return <FormFilter handleClick={handlActions} data={data} user={user} />;
	},

	fm_editors(handlActions, data, user) {
		return <FormEditors handleClick={handlActions} data={data} user={user} />;
	}
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