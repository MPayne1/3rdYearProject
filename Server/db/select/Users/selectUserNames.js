const mysql = require('mysql');
const dbCon  = require('../../connection.js');

/*
  select all users with the username, to check usernames when signup
  return false if the username isn't currently in the db true otherwise
*/
var selectUserNames  = async function(username, callback) {
  var res;
    var sql = `SELECT username FROM users WHERE username =  + ${mysql.escape(username)}`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
        callback(null, result);
    });

}

module.exports = selectUserNames;
