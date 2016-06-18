import React from 'react';
import ReactDom from 'react-dom';
import requests from './src/requests.js';
import getRole from './auth/roles.js';
/*
import FormInput from './controls/formInput/formInput.js';

let _data = {"layer":{
	"name":"Градопаспорта",
	"nameTable":"citypassport",
	"color":"#aaf",
	"setterStyle":{"color":"#aaf","currentOpacity":0.7},
	"form":"getForm_citypassport",
	"tables":[],
	"current":false,
	"filters":[{"filterName":"rangeDate","start":"2016-06-09T13:42:14.000Z","end":"2016-06-10T08:31:56.000Z"}]},
	"record":{
		"id":"2",
		"geom":"{\"type\":\"Feature\",\"properties\":{},\"geometry\":{\"type\":\"Polygon\",\"coordinates\":[[[23.69505286216736,52.094325939828664],[23.69600772857666,52.09472142228963],[23.696436882019043,52.09443140216104],[23.695428371429443,52.094022734234294],[23.69505286216736,52.094325939828664]]]}}","editor":2,"editing_date":"2016-06-09T13:42:14.000Z","name":"Какой-то объект","note":"Какой-то объект для непонятно чего. Ого! Это заметка.","area":15,"adress":null,"solgik_endpass":null,"winnerauction":null,"solgik_develpass_date":null,"solgik_develpass_num":null,"solgik_statepass_date":null,"solgik_statepass_num":null},
		"refTables":{}};

requests.request('POST', '/user')
	.then(x => setRole(getRole(x)) );


let setRole = function(user) {
	ReactDom.render(
			<div className='form-box-t'>
				<div className='form-box-c'>
					<div className='form-body'>
						<FormInput handleClick={x => {}} data={_data} user={user} />;
					</div>
				</div>
			</div>,
		  	document.getElementById('test')
		);
}/**/