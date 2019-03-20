const mysql = require('mysql');
const dbCon  = require('../connection.js');

/*
  select everything for a given username
*/
var selectUser  = async function(token, email, callback) {
  var res;
    var sql = `SELECT * FROM resetpassword, users
    WHERE resetToken =  ${mysql.escape(token)} and
    users.UserID = resetPassword.UserID`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
          callback(null, res);
    });

}

module.exports = selectUser;
