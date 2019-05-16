const mysql = require('mysql');
const dbCon  = require('../../connection.js');

/*
  select info for emailing a forgotten password
*/
var selectUser  = async function(username, email, callback) {
  var res;
    var sql = `SELECT * FROM users WHERE username =  ${mysql.escape(username)} and email = ${mysql.escape(email)} ;`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
        callback(null, res);
    });

}

module.exports = selectUser;
