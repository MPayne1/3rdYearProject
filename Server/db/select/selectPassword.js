const mysql = require('mysql');
const dbCon  = require('../connection.js');

/*
  select password for a given username , to check passwords on login
*/
var selectPassword  = async function(username, callback) {
  var res;
    var sql = `SELECT password FROM users WHERE username =  + ${mysql.escape(username)}`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
        callback(null, result);
    });

}

module.exports = selectPassword;
