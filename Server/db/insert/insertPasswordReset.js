const mysql = require('mysql');
const dbCon  = require('../connection.js');

// insert a new user into the db
var insertUser  = async function(username) {
    var sql = `INSERT INTO passwordreset(UserID, resetToken, resetExpires)
      VALUES(
        (Select UserID from users where username = ${mysql.escape(username)} LIMIT 1), NULL, NULL); `;
	  await dbCon.query(sql , (err, result) => {
		    if(err) throw err;
        console.log('user password reset added');
    });
}

module.exports = insertUser;
