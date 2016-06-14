var pgp = require("pg-promise")();

var connection = {
    	host: 'localhost',
    	port: 5432,
		database: 'brestdb',
    	user: 'postgres',
    	password: 'root'
	};

/*
var connection = {
        host: 'ec2-54-243-204-195.compute-1.amazonaws.com',
        port: 5432,
        database: 'degu98g3me9l74',
        user: 'iqujckjxjswxii',
        password: '_DSzPBjQ3VAVk_gZTGP7lgogir'
    };
*/

module.exports = pgp(connection);