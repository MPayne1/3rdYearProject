const mysql = require('mysql');
const dbCon  = require('./connection.js');

/*
  select everything for a given username
*/
var selectUser  = async function(username, callback) {
  var res;
    var sql = `SELECT * FROM users WHERE username =  + ${mysql.escape(username)}`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
          callback(null, res);
    });

}

module.exports = selectUser;
