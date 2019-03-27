const mysql = require('mysql');
const dbCon  = require('../../connection.js');

// update users password
var updateUserPhoneNumber  = async function(userID, phoneNumber) {
    var sql = `UPDATE users SET phoneNumber = ${mysql.escape(phoneNumber)}
    WHERE userID = ${mysql.escape(userID)};`;
	  await dbCon.query(sql , (err, result) => {
		    if(err) next(err);
        console.log('phoneNumber updated');
    });
}

module.exports = updateUserPhoneNumber;
