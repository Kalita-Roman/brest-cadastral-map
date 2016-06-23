'use strict'

var db = require('./connectionPostgreSQL.js');

require("./polyfill.js");

var log = function(x,y) {
    console.log();
    console.log(x);
    console.log(y);
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
    	var rec = {}
        rec.editing_date = new Date();
        rec.editor = body.editor;
        rec.layer = body.layer;
        rec.geom = body.geom;

        var q1 = '';
        var q2 = '';
        var last = new LastEditors(body, rec);

        for(var field in  body.fields) {
            rec[field] = body.fields[field];
            last.add(field);
            q1 += (', '+ field);
            q2 += (', ${' + field + '}');
        }

        var id;

        return db.one("INSERT INTO ${layer~}(geom, editor, editing_date" + q1 +") VALUES(${geom}, ${editor}, ${editing_date}" + q2 +") returning id", rec)
            .then(data => {
                id = data;
                last.setId(data.id);
                return last.getSomeRequests();
            })
            .then(function (data) {
                res.status(201).send(id);
            });
            /*.catch(function (error) {
                res.send(error);
            });*/
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
            //log(req.body);
            db.one("SELECT * FROM ${layer~} WHERE id=${id}", req.body.body)
                .then(data => {
              //      log('__ЗАПИСЬ',data);
                    record = data;
                    return db.any("SELECT * FROM last WHERE (nametable=${layer} AND idrec=${id});", req.body.body);
                })
                .then(data => {
                //    log('__РЕДАДКЦИИ',data);
                    editors = data;
                    return db.any("SELECT * FROM users");
                })
                .then(data => {
                //    log('__РЕДАКТОРЫ',data);
                    return editors.reduce(
                        (prev, cur) => { 
                            var editor = data.find(x => x.id === cur.id_editor);
                            prev[cur.col] = { name: editor.name, date: cur.date }; return prev},
                        {}
                    );
                })
                .then(data => {
                //    log('__ПОСЛЕДНЕЕ',data);
                    record.editors = data;
                    resolve({ name:'record', value:record });
                });
            //log('конец');
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
            /*.catch(function (error) {
                console.log('ERROR\n',error);
                res.send(error);
            });*/
    },

    showeditors(req, res) {
        var body = req.body.body;

        return db.any("SELECT * FROM users WHERE role='editor'")
            .then(function (data) {
                res.send(data);
            });
            /*.catch(function (error) {
                res.send('error');
            });*/
    },

    editorInsert(req, res) {
        return db.one("INSERT INTO users(name, post, username, password, role) VALUES(${name}, ${post}, ${username}, ${password}, 'editor') returning id", req.body.user)
            .then(function (id) {
                res.status(201).send(id);
            })
          /*  .catch(function (error) {
                res.send(error);
            }); */
    },

    editorDelete(req, res) {
        return db.one("DELETE FROM users WHERE id=${id}", req.body.user)
            .then(function (data) {
                res.status(200).send('OK');
            });
            /*.catch(function (error) {
                res.send(error);
            });*/
    },

    editorUpdate(req, res) {
      
        return db.one("UPDATE users SET name=${name}, post=${post}, username=${username}, password=${password} WHERE id=${id}", req.body.user)
            .then(function (data) {
                res.status(200).send('OK');
            });
            /*.catch(function (error) {
                res.send(error);
            });*/
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
