/*var records = [
    { id: 1, username: 'user', password: 'user', type: 'visitor' },
    { id: 2, username: 'editor', password: 'editor', type: 'editor' },
    { id: 3, username: '123', password: '123', type: 'editor' },
    { id: 4, username: 'qwe', password: 'qwe', type: 'editor' },
    { id: 5, username: 'default', password: 'default', type: 'default' }
];*/

var records = [
    { id: 1, username: 'user', password: 'user', user: {
        type: 'visitor', 
        id: 0
    } },
    { id: 2, username: 'editor', password: 'editor', user: { 
        name: 'editor',
        type: 'editor',
        id: 1
    } },
    { id: 3, username: '123', password: '123', user: {
        name: '123',
        type: 'editor',
        id: 2
    } },
    { id: 4, username: 'qwe', password: 'qwe',  user: {
        name: 'qwe',
        type: 'editor',
        id: 3
    }},
    { id: 5, username: 'default', password: 'default',  user: {
        type: 'default',
        id: 4
    }}
];

exports.findById = function(id, cb) {
    process.nextTick(function() {
        var idx = id - 1;
        if (records[idx]) {
            cb(null, records[idx]);
        } else {
            cb(new Error('User ' + id + ' does not exist'));
        }
    });
}

exports.findByUsername = function(username, cb) {
    process.nextTick(function() {
        for (var i = 0, len = records.length; i < len; i++) {
            var record = records[i];
            if (record.username === username) {
                return cb(null, record);
            }
        }
        return cb(null, null);
    });
}
