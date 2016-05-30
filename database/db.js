var pgp = require("pg-promise")();

var connection = {
    	host: 'localhost', // server name or IP address;
    	port: 5432,
    	database: 'brestdb',
    	user: 'postgres',
    	password: 'root'
	};

var db = pgp(connection);

var filter = function(filters) {
    var f = filters[0];
    var fils = [];
    if(f.start) fils.push(x => new Date(f.start) <= x);
    if(f.end) fils.push(x => new Date(f.end) >= x);

    var check = function(record) {
        return fils.every(x => x(new Date(record.editing_date)));
    }

    return function(data) {
        return data.filter(check);
    }
}

var delupt = function(req, res, query) {
    var body = req.body.body;
    db.task(t => t.batch(body.map(x => t.none(query, x))))
        .then(function (data) {
            res.status(200).send('OK');
        })
        .catch(function (error) {
            res.send(error);
        });;
}

var handler = {
    select: function(req, res) {
        db.query("SELECT * FROM $1~", [req.body.layer])
            .then(function (data) {
                if(req.body.filters) {
                    console.log();
                    console.log();
                    console.log(req.body.filters);
                    res.send(filter(req.body.filters)(data));
                }
                else {
                    res.send(data);
                }
            })
            .catch(function (error) {
                res.send(error);
            });
    },

    insert: function(req, res) {
    	req.body.body.editingDate = new Date();
        db.query("INSERT INTO ${layer~}(geom, name, editor, editing_date) VALUES(${geom}, ${name}, ${editor}, ${editingDate}) returning id", req.body.body)
            .then(function (data) {
                res.status(201).send(data);
            })
            .catch(function (error) {
                res.send(error);
            });
    },

    update: function(req, res) {
    	var dateNow = new Date();
    	req.body.body.forEach(x => x.editingDate = dateNow);
        delupt(req, res, "UPDATE ${layer~} SET geom=${geom}, editor=${editor}, editing_date=${editingDate} WHERE id=${id}");
    },

    delete: function(req, res) {
        delupt(req, res, "DELETE FROM ${layer~} WHERE id=${id}");
    },

    edit: function(req, res) {
        db.query("SELECT * FROM ${layer~} WHERE id=${id}", req.body.body)
            .then(function (data) {
                res.send(data);
            })
            .catch(function (error) {
                res.send(error);
            });
    },

    updateChanges: function(req, res) {
    	req.body.body.editingDate = new Date();
        db.query("UPDATE ${layer~} SET name=${name}, editor=${editor}, editing_date=${editingDate} WHERE id=${id}", req.body.body)
            .then(function (data) {
                res.status(201).send(data);
            })
            .catch(function (error) {
                res.send(error);
            });
    },
}


module.exports.database = function(req, res) {
    
    if(!req.body.action) { 
        res.send(false);
        return;
    }

    handler[req.body.action](req, res);
}