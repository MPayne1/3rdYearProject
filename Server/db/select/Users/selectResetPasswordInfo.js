const mysql = require('mysql');
const dbCon  = require('../../connection.js');

/*
  select info for reset password
*/
var selectUser  = async function(token, callback) {
  var res;
    var sql = `SELECT * FROM passwordreset, users
    WHERE resetToken =  ${mysql.escape(token)} and
    users.UserID = passwordreset.UserID`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
          callback(null, res);
    });

}

module.exports = selectUser;
