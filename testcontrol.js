import React from 'react';
import ReactDom from 'react-dom';
import requests from './src/requests.js';
import getRole from './auth/roles.js';

/*
import FieldSolution from './controls/fieldSolution/fieldSolution.js';

import './controls/modalform/modalform.css';

requests.request('POST', '/user')
	.then(x => setRole(getRole(x)) );




let setRole = function(user) {
	ReactDom.render(
			<div className='form-box-t'>
				<div className='form-box-c'>
					<div className='form-body'>
						<div className='form-content'>
							<FieldSolution 
								recordNew = {{}} 
								recordOld = {{nameField_date: new Date(), nameField_num: 'заметка'}} 
								className={'solutiongik margin-bottom'}
								label={'АПЗ'}
								nameField='nameField'
								editor='Редактор'
								enable={true}
								type={{type: 'getType_2', date: '_date', note: '_num'}}/>
						</div>
					</div>
				</div>
			</div>,
		  	document.getElementById('test')
		);
}/**/