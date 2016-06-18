'use strict'

var db = require('./connectionPostgreSQL.js');

require("./polyfill.js");

var addTable = function(fils,  filters, nameTable) {
    var f = filters.find(x =>  x.filterName === nameTable);
    if(f)
        fils.push(x => f.value.includes(x[nameTable]));
}

var filter = function(filters) {
    var fils = [];

    var f = filters.find(x =>  x.filterName === 'rangeDate');

    var dateStart = new Date(f.start);
    var dateEnd = new Date(f.end);
    dateEnd.setDate(dateEnd.getDate() + 1);

    if(f.start) fils.push(x => dateStart <= x.editing_date);
    if(f.end) fils.push(x => dateEnd >= x.editing_date);

    addTable(fils, filters, 'type_build');
    addTable(fils, filters, 'type_project');

    var check = function(record) {
        return fils.every(x => x(record));
    }

    return function(data) {
        return data.filter(check);
    }
}

var delupt = function(req, res, query) {
    var body = req.body.body;
    db.task(t => t.batch(body.map(x => t.one(query, x))))
        .then(function (data) {
            res.status(200).send('OK');
        })
        .catch(function (error) {
            res.send(error);
        });;
}

var handler = {
    select: function(req, res) {
        db.any("SELECT * FROM $1~", [req.body.layer])
            .then(function (data) {
                if(req.body.filters) {
                    var result = filter(req.body.filters)(data);
                    var addition = {};
                    res.send({ result: result, addition: addition });
                }
                else {
                    res.send(data);
                }
            })
            .catch(function (error) {
                res.send('error');
            });
    },

    insert: function(req, res) {
        var body = req.body.body;
    	var rec = {}
        rec.editing_date = new Date();
        rec.editor = body.editor;
        rec.layer = body.layer;
        rec.geom = body.geom;

        var q1 = '';
        var q2 = '';

        for(var field in  body.fields) {
            rec[field] = body.fields[field]
            q1 += (', '+ field);
            q2 += (', ${' + field + '}');
        }

        db.one("INSERT INTO ${layer~}(geom, editor, editing_date" + q1 +") VALUES(${geom}, ${editor}, ${editing_date}" + q2 +") returning id", rec)
            .then(function (data) {
                console.log(data);
                res.status(201).send(data);
            })
            .catch(function (error) {
                console.log(error);
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
      
        var prec = new Promise((resolve, reject) => {
            if(!req.body.body)
                resolve({});
            db.one("SELECT * FROM ${layer~} WHERE id=${id}", req.body.body)
                .then(data => {
					resolve({ name:'record', value:data });
				});
        });

        var arrayToObj = function(arr, transform) {
            if(!transform) transform = x => x;
            return arr.reduce((prev, cur) => { 
                if(cur.name) prev[cur.name] = transform(cur.value);
                return prev 
            }, {});
        }

	    var ptab = new Promise((resolve, reject) => {
	    	
	       var getTable = (name, _db) => _db.any("SELECT * FROM $1~", name)
                .then(value => ({name, value}));

            db.task(t => t.batch(req.body.tables.map(x => getTable(x, t))))
            	.then(data => {
            		resolve({ name:'refTables', value: arrayToObj(data) });
            	});
	    });

	    Promise.all([prec, ptab])
	    	.then( data => {
                var result = arrayToObj(data);
	    		res.send(result);
	    	});
    },

    updateChanges: function(req, res) {
        var body = req.body.body;
      
        var rec = {}
        rec.layer = body.layer;
        rec.editor = body.editor;
        rec.editing_date = new Date();
        rec.id = body.id;



        var q = '';
        for(var field in  body.fields) {
            rec[field] = body.fields[field]
            q += (', ' + field + '=${' + field + '}');
        }

        console.log();
        console.log();
        console.log(rec);
        console.log();
        console.log();
      
        var qy = "UPDATE ${layer~} SET editor=${editor}, editing_date=${editing_date}" + q + " WHERE id=${id}";

        db.query(qy, rec)
            .then(function (data) {
                res.status(201).send(data);
            })
            .catch(function (error) {
                console.log(error);
                res.send(error);
            });
    },



    showeditors(req, res) {
        var body = req.body.body;

        db.any("SELECT * FROM users")
            .then(function (data) {
                res.send(data);
            })
            .catch(function (error) {
                res.send('error');
            });
    },

    editorInsert(req, res) {
        db.one("INSERT INTO users(name, post, username, password, role) VALUES(${name}, ${post}, ${username}, ${password}, 'editor') returning id", req.body.user)
            .then(function (id) {
                res.status(201).send(id);
            })
            .catch(function (error) {
                res.send(error);
            });
    },

    editorDelete(req, res) {
        db.one("DELETE FROM users WHERE id=${id}", req.body.user)
            .then(function (data) {
                res.status(200).send('OK');
            })
            .catch(function (error) {
                res.send(error);
            });
    },

    editorUpdate(req, res) {
      
        db.one("UPDATE users SET name=${name}, post=${post}, username=${username}, password=${password} WHERE id=${id}", req.body.user)
            .then(function (data) {
                res.status(200).send('OK');
            })
            .catch(function (error) {
                res.send(error);
            });
    }
}


module.exports.database = function(req, res) {
    
    if(!req.body.action) { 
        res.send(false);
        return;
    }

    handler[req.body.action](req, res);
}
