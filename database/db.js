'use strict'

var db = require('./connectionPostgreSQL.js');
var makerQueries = require('./makerQueries');

require("./polyfill.js");

var log = function() {
    console.log();
    console.log(Array.from(arguments));
    console.log();
}

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

var someRequests = function(getPromises) {
	return db.task(_db => _db.batch(getPromises(_db)));
}

var LastEditors = function(body, rec) {
    
    let last = [];

    this.add = function(field) {
        last.push({
            nametable: body.layer,
            col: field,
            idrec: body.id,
            id_editor: body.editor,
            date: rec.editing_date
        });
    }

    this.setId = function(id) {
        last.forEach(x => x.idrec = id);
    }

    this.getSomeRequests = function() {
        return someRequests(_db => last.map(x => _db.none("DELETE FROM last WHERE (nametable=${nametable} AND col=${col} AND idrec=${idrec} ); INSERT INTO last(nametable, col, idrec, id_editor, date) VALUES(${nametable}, ${col}, ${idrec}, ${id_editor}, ${date});", x)));
    }

}

var delupt = function(req, res, query) {
    var body = req.body.body;
    return db.task(t => t.batch(body.map(x => t.one(query, x))))
        .then(data => {
            res.status(200).send('OK');
        })
        /*.catch(error => {
            res.send(error);
        });;*/
}

var handler = {
    select: function(req, res) {
    return db.any("SELECT * FROM $1~", [req.body.layer])
            .then(function (data) {
                if(req.body.filters) {
                    var result = filter(req.body.filters)(data);
                    res.send({ result: result, addition: {} });
                }
                else {
                    res.send(data);
                }
            });
            /*.catch(function (error) {
                res.send('error');
            });*/
    },

    insert: function(req, res) {
        var body = req.body.body;
        var fields = Object.assign( { editing_date : new Date() } , body.fields);
        var namesFields = Object.keys(fields);
        var last = new LastEditors(body, fields);
        namesFields.forEach(x => last.add(x));
        var query = makerQueries.createInsert(body.layer, fields);
        return db.one(query, fields)
            .then(data => {
                id = data;
                last.setId(data.id);
                return last.getSomeRequests();
            })
            .then(data => {
                res.status(201).send(id);
            });
    },

    update: function(req, res) {
    	var dateNow = new Date();
    	req.body.body.forEach(x => x.editingDate = dateNow);

        return delupt(req, res, "UPDATE ${layer~} SET geom=${geom}, editor=${editor}, editing_date=${editingDate} WHERE id=${id}");
    },

    delete: function(req, res) {
        return delupt(req, res, "DELETE FROM ${layer~} WHERE id=${id}");
    },

    selectForEdit: function(req, res) {

        var arrayToObj = function(arr, transform) {
            if(!transform) transform = x => x;
            return arr.reduce((prev, cur) => { 
                if(cur.name) prev[cur.name] = transform(cur.value);
                return prev 
            }, {});
        }
      
        var prec = new Promise((resolve, reject) => {
        	var record;
        	var editors;
            if(!req.body.body)
                resolve({});
            db.one("SELECT * FROM ${layer~} WHERE id=${id}", req.body.body)
                .then(data => {
                    record = data;
                    return db.any("SELECT * FROM last WHERE (nametable=${layer} AND idrec=${id});", req.body.body);
                })
                .then(data => {
                    editors = data;
                    return db.any("SELECT * FROM users");
                })
                .then(data => {
                    return editors.reduce(
                        (prev, cur) => { 
                            var editor = data.find(x => x.id === cur.id_editor);
                            prev[cur.col] = { name: editor.name, date: cur.date }; return prev},
                        {}
                    );
                })
                .then(data => {
                    record.editors = data;
                    resolve({ name:'record', value:record });
                });
        });

	    var ptab = new Promise((resolve, reject) => {
	    	
	       var getTable = (name, _db) => _db.any("SELECT * FROM $1~", name)
                .then(value => ({name, value}));

            db.task(t => t.batch(req.body.tables.map(x => getTable(x, t))))
            	.then(data => {
            		resolve({ name:'refTables', value: arrayToObj(data) });
            	});
	    });

	    return Promise.all([prec, ptab])
	    	.then( data => {
                var result = arrayToObj(data);
	    		res.send(result);
	    	});
    },

    updateChanges: function(req, res, cb) {
        var body = req.body.body;
      
        var rec = {}
        rec.layer = body.layer;
        rec.editor = body.editor;
        rec.editing_date = new Date();
        rec.id = body.id;

        var q = '';
        var last = new LastEditors(body, rec);

        for(var field in  body.fields) {
            rec[field] = body.fields[field]
            last.add(field);
            q += (', ' + field + '=${' + field + '}');
        }

        var qy = "UPDATE ${layer~} SET editor=${editor}, editing_date=${editing_date}" + q + " WHERE id=${id}";

        return db.query(qy, rec)
            .then(data => {
            	return last.getSomeRequests();
            })
            .then(data => {
                res.status(201).send(data);
                cb();
            });
    },

    showeditors(req, res) {
        var body = req.body.body;

        return db.any("SELECT * FROM users WHERE role='editor'")
            .then(data => {
                res.send(data);
            });
    },

    editorInsert(req, res) {
        var fields = Object.assign({ role: 'editor' }, req.body.user);
        var query = makerQueries.createInsert('users', fields);
        return db.one(query, fields)
            .then(id => {
                res.status(201).send(id);
            })
    },

    editorDelete(req, res) {
        return db.one("DELETE FROM users WHERE id=${id}", req.body.user)
            .then(data => {
                res.status(200).send('OK');
            });
    },

    editorUpdate(req, res) {
        return db.one("UPDATE users SET name=${name}, post=${post}, username=${username}, password=${password} WHERE id=${id}", req.body.user)
            .then(data => {
                res.status(200).send('OK');
            });
    }
}


let longpollFuncs = [
    'updateChanges',
    'delete',
    'update',
    'insert'
];


module.exports.database = function(req, res, cb) {
    
    if(!req.body.action) { 
        res.send(false);
        return;
    }

    handler[req.body.action](req, res, cb)
        .then(() => {
            if(longpollFuncs.includes(req.body.action))
                cb();
        })
        .catch(error => {
            res.send(error);
        });
}
