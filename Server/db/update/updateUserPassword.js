const mysql = require('mysql');
const dbCon  = require('../connection.js');

// update users password
var updateUserEmail  = async function(userID, password) {
    var sql = `UPDATE users SET password = ${mysql.escape(password)}
    WHERE userID = ${mysql.escape(userID)};`;
	  await dbCon.query(sql , (err, result) => {
		    if(err) next(err);
        console.log('password updated');
    });
}

module.exports = updateUserEmail;
