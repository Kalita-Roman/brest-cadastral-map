var pgp = require("pg-promise")();

var connection = {
    	host: 'localhost', // server name or IP address;
    	port: 5432,
    	database: 'cadastre-site',
    	user: 'postgres',
    	password: 'root'
	};

var db = pgp(connection);


var delupt = function(req, res, query) {
        var body = req.body.body;
        db.task(t => t.batch(body.map(x => t.none(query, x))))
            .then(function (data) {
                res.status(200).send('ОК');
            })
            .catch(function (error) {
                res.send(error);
            });;
}

var handler = {
    select: function(req, res) {
        db.query("SELECT * FROM layer_1")
            .then(function (data) {
                res.send(data);
            })
            .catch(function (error) {
                res.send(error);
            });
    },

    insert: function(req, res) {
        db.query("INSERT INTO layer_1(geom) VALUES(${body})", req.body)
            .then(function (data) {
                res.status(201).send('Created');
            })
            .catch(function (error) {
                res.send(error);
            });
    },

    update: function(req, res) {
        delupt(req, res, "UPDATE layer_1 SET geom=${geom} WHERE id=${id}");
    },

    delete: function(req, res) {
        delupt(req, res, "DELETE FROM layer_1 WHERE id=${id}");
    }
}


module.exports.database = function(req, res) {
    
    if(!req.body.action) { 
        res.send(false);
        return;
    }

    handler[req.body.action](req, res);
}