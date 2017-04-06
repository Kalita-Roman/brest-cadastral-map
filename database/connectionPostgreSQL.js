var pgp = require("pg-promise")();

const connection = {
	host: 'ec2-54-225-121-93.compute-1.amazonaws.com',
	port: 5432,
	database: 'd7ju1tiq6pteid',
	user: 'vzdjklcygtbeta',
	password: '5O0R9b4ydXWPbnQs6BGR6ZswvY',
	ssl: true
};


module.exports = pgp(connection);