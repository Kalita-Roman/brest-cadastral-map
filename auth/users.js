var db = require('./../database/connectionPostgreSQL.js');

var tick = function (f) {
    process.nextTick(function() {
        db.any("SELECT * FROM users")
            .then(records => { 
                f(records);
            });
    });
}

exports.findById = function(id, cb) {
    tick(records => { 
            var record = records.find(x => x.id === id);
            if (record) {
                var res = ['id', 'name', 'post', 'role'].reduce((prev, cur) => { prev[cur] = record[cur]; return prev; }, {});
                cb(null, res);
            } else {
                cb(new Error('User ' + id + ' does not exist'));
            }
        });
}

exports.findByUsername = function(username, cb) {
    tick(records => { 
            for (var i = 0, len = records.length; i < len; i++) {
                var record = records[i];
                if (record.username === username) {
                    return cb(null, record);
                }
            }
            return cb(null, null);
        });
}
