const mysql = require('mysql');
const dbCon  = require('../connection.js');

// update users email
var updateUserEmail  = async function(userID, token, expires) {
    var sql = `UPDATE passwordreset SET resetToken = ${mysql.escape(token)},
    resetExpires = ${mysql.escape(expires)}
    WHERE userID = ${mysql.escape(userID)};`;
	  await dbCon.query(sql , (err, result) => {
		    if(err) next(err);
        console.log('resetpassword info updated');
    });
}

module.exports = updateUserEmail;
