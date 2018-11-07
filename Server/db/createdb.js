//Creates the mysql db

const db  = require('./connection.js');
const mysql = require('mysql');

//need to fully create the users table and add primary/foreign keys
function createTable(err) {
	if(err) throw err;
	var sql = "CREATE TABLE users(username VARCHAR(255), password VARCHAR(255))";
	db.query(sql, function(err, result) {
		if(err) throw err;
		console.log("Table created");
	});
};

createTable();
