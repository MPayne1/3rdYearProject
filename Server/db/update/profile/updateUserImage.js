const mysql = require('mysql');
const dbCon  = require('../../connection.js');

// update users image
var updateUserImage  = async function(userID, path) {
    var sql = `UPDATE users SET imagePath = ${mysql.escape(path)}
    WHERE userID = ${mysql.escape(userID)};`;
	  await dbCon.query(sql , (err, result) => {
		    if(err) next(err);
        console.log('image updated');
    });
}

module.exports = updateUserImage;
