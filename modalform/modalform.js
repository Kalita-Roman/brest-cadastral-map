import React from 'react';
import ReactDOM from 'react-dom';
import './modalform.css';
import { FormInput } from './forminput.js'
import { FormFilter_1 } from './formFilter_1.js'

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

let func_1 = function(typeform) {
	if(typeform === 'input') { return f1; };
	if(typeform === 'filter_1') {};
}

let f1 = function(user, data) {
	return function(resolve, reject) {

		let handlActions = function(res) {
			if(res)
				resolve(res);
			setState({ visible: false });
		};

		setState( {
			visible: true,
			form: <FormInput handleClick={handlActions} data={data} user={user} />
	 	} );
	};
}

let f2 = function(user, data) {
	return function(resolve, reject) {
		let handlActions = function(res) {
			if(res)
				resolve(res);
			setState({ visible: false });
		};

		setState( {
			visible: true,
			form: <FormFilter_1 handleClick={handlActions} data={data} />
	 	} );
	}
}


module.exports.showForm = function(user, data, typeform) {

	//let f0 = func_1(typeform)(user, data);
	let ff = f1(user, data);

	return new Promise(ff);
}




module.exports.show = function() {
	return new Promise((resolve, reject) => {
		
	});
}
