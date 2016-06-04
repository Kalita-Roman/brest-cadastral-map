

module.exports = {
	
	request (typeReq, url, body) {
		return new Promise((resolve, reject) => {
			let xhr = new XMLHttpRequest();
			xhr.open(typeReq, url, true);
			xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
			xhr.onload = function() {
				if (200 <= this.status && this.status < 300) {
					if(this.response === 'OK') return;
					let response = JSON.parse(this.response);
					if(response.name === 'error')
						reject(response);
					else
						resolve(response);
			    } else {
			        var error = new Error(this.statusText);
			        error.code = this.status;
			        reject(error);
			    }
			}
			xhr.send(JSON.stringify(body));
		});
	},

	requestToDB (body) {
		return this.request('POST', '/db', body);
	}
};