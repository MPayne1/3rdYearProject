// handles all mysql select queries

const mysql = require('mysql');
const dbCon  = require('./connection.js');

// select all users with the username, to check usernames when signup
async function selectUserNames(username) {
    var sql = 'SELECT username FROM users WHERE username ='  + mysql.escape(username);
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        console.log(result);
        return result;
    });
}

module.exports = selectUserNames;
