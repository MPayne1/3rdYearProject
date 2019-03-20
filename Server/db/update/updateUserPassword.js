const mysql = require('mysql');
const dbCon  = require('../connection.js');

// update users email
var updateUserPassword  = async function(userID, password) {
    var sql = `UPDATE users SET password = ${mysql.escape(password)}
    WHERE userID = ${mysql.escape(userID)};`;
	  await dbCon.query(sql , (err, result) => {
		    if(err) next(err);
        console.log('password updated');
    });
}

module.exports = updateUserPassword;
