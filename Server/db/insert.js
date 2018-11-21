// handles all mysql insert queries

const mysql = require('mysql');
const dbCon  = require('./connection.js');

//insert a new user into the db
var insertUser  = async function(username, password, LastName, FirstName, Email, callback) {
  var res;
    var sql = `INSERT INTO users(username, password, LastName, FirstName, Email)
      VALUES(${mysql.escape(username)}, ${mysql.escape(password)}, ${mysql.escape(LastName)},
      ${mysql.escape(FirstName)}, ${mysql.escape(Email)}); `;
	  await dbCon.query(sql , (err, result) => {
		    if(err) throw err;
        console.log('user added');
        callback(null, result);
    });
    
}

module.exports = insertUser;
