var pgp = require("pg-promise")();

var connection = {
    	host: 'localhost', // server name or IP address;
    	port: 5432,
    	database: 'cadastre-site',
    	user: 'postgres',
    	password: 'root'
	};

var db = pgp(connection);


module.exports.database = function(req, res) {
	console.log(req.body);
	db.query("INSERT INTO layer_1(name) VALUES(${body})", req)
    	.then(function (data) {
        	console.log("success");
	    })
	    .catch(function (error) {
	        console.log(error);
	    })

	res.send('OK');
}



/*

var cn = {
    host: 'localhost', // server name or IP address;
    port: 5432,
    database: 'cadastre-site',
    user: 'postgres',
    password: 'root'
};

var db = pgp(cn);*/
/*
db.query("SELECT * FROM layer_1")
    .then(function (data) {
        console.log("DATA:", data.map(x => x.name));
    })
    .catch(function (error) {
        console.log("ERROR:", error);
    });
*/
/*
db.query("INSERT INTO layer_1(name) VALUES(${text})", req.body)
    .then(function (data) {
        console.log("success");
    })
    .catch(function (error) {
        console.log(error);
    })



	
	res.send('OK');*/