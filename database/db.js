var pgp = require("pg-promise")();


var connection = {
    	host: 'localhost',
    	port: 5432,
//    	database: 'cd',
		database: 'brestdb',
    	user: 'postgres',
 //   	password: 'pass'
    	password: 'root'
	};

/*
var connection = {
        host: 'ec2-23-23-162-78.compute-1.amazonaws.com',
        port: 5432,
        database: 'd88b2fmsbmie2q',
        user: 'dpnsnduzfqpghf',
        password: 'w-_JN76Y5kDzH28N29fINxWLN_'
    };
*/

var db = pgp(connection);

var addTable = function(fils,  filters, nameTable) {
    var f = filters.find(x =>  x.filterName === nameTable);
    if(f)
        fils.push(x => f.value.includes(x[nameTable]));
}

var filter = function(filters) {
    var fils = [];

    var f = filters.find(x =>  x.filterName === 'rangeDate');
    if(f.start) fils.push(x => new Date(f.start) <= new Date(x.editing_date));
    if(f.end) fils.push(x => new Date(f.end) >=  new Date(x.editing_date));


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

    	var rec = {}
        rec.editingDate = new Date();
        rec.editor = req.body.body.editor;
        rec.layer = req.body.body.layer;
        rec.geom = req.body.body.geom,
        rec.name = req.body.body.name;
        req.body.body.tables.forEach(x => rec[x.table] = x.value);

        var q1 = '';
        var q2 = '';
        var q = req.body.body.tables.forEach(x => { q1 += (', '+x.table), q2 += (', ${' + x.table + '}')});

		db.one("INSERT INTO ${layer~}(geom, name, editor, editing_date" + q1 +") VALUES(${geom}, ${name}, ${editor}, ${editingDate}" + q2 +") returning id", rec)
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
      
        var prec = new Promise((resolve, reject) => {
        	if(!req.body.body)
        		resolve({});
        	db.one("SELECT * FROM ${layer~} WHERE id=${id}", req.body.body)
	        	.then(data => {
					resolve({ name:'record', value:data });
				});
        });

	    var ptab = new Promise((resolve, reject) => {
	    	var getTable = (x, t) => {
                return new Promise((resolve, reject) => {
                    t.any("SELECT * FROM $1~", [x])
						.then(data => {
							resolve({name: x, data: data});
						})
					});
                }
            db.task(t => t.batch(req.body.tables.map(x => getTable(x, t))))
            	.then(data => {
            		resolve({ name:'t', value: data });
            	});
	    });
	    Promise.all([prec, ptab])
	    	.then( data => {
	    		var result = data.reduce((prev, cur) => {
	    			if(cur.name)
	    				prev[cur.name] = cur.value; 
	    			return prev;
	    		} ,{});
	    		res.send(result);
	    	});
    },

    updateChanges: function(req, res) {
        var rec = {}
        rec.editingDate = new Date();
        rec.editor = req.body.body.editor;
        rec.layer = req.body.body.layer;
        rec.name = req.body.body.name;
        rec.id = req.body.body.id;
        rec = req.body.body.tables.reduce((prev, cur) => { rec[cur.table] = cur.value ; return rec } , rec);

        var q = req.body.body.tables.map(x => ', ' + x.table + '=${' + x.table + '}');

        var qy = "UPDATE ${layer~} SET name=${name}, editor=${editor}, editing_date=${editingDate}" + q.join('') + " WHERE id=${id}";

        db.query(qy, rec)
            .then(function (data) {
                res.status(201).send(data);
            })
            .catch(function (error) {
                console.log(error);
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
