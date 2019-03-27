const mysql = require('mysql');
const dbCon  = require('../../connection.js');

// update users bio
var updateUserBio  = async function(userID, bio) {
    var sql = `UPDATE users SET Bio = ${mysql.escape(bio)}
    WHERE userID = ${mysql.escape(userID)};`;
	  await dbCon.query(sql , (err, result) => {
		    if(err) next(err);
        console.log('bio updated');
    });
}

module.exports = updateUserBio;
