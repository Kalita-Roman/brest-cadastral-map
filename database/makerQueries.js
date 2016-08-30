module.exports = {
    createInsert: function(table, fields) {
        var namesFields = Object.keys(fields);
        var cols = namesFields.join(', ');
        var values = namesFields.map(x => '${' + x + '}').join(', ');
        return 'INSERT INTO ' + table + '(' + cols + ') VALUES(' + values + ') returning id';
               
    }
}