const chai = require('chai');
const assert = chai.assert;

var makerQueries = require('./../database/makerQueries');

describe("pow", function() {
    it("возводит в n-ю степень", function() {
        var table = 'table';
        var fields = {
            name: 'Name',
            value: 'Value',
            num: 5
        };
        assert.equal(
            makerQueries.createInsert(table, fields), 
            'INSERT INTO table(name, value, num) VALUES(${name}, ${value}, ${num}) returning id'
        );
    });
});