const mysql = require('mysql');
const dbCon  = require('../connection.js');

// update users email
var updateUserEmail  = async function(userID, email) {
    var sql = `UPDATE users SET email = ${mysql.escape(email)}
    WHERE userID = ${mysql.escape(userID)};`;
	  await dbCon.query(sql , (err, result) => {
		    if(err) next(err);
        console.log('email updated');
    });
}

module.exports = updateUserEmail;
