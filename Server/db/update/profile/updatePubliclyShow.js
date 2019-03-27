const mysql = require('mysql');
const dbCon  = require('../../connection.js');

// update users publicly show value
var updateUserPubliclyShow  = async function(userID, publiclyShow) {
    var sql = `UPDATE users SET publiclyShow = ${mysql.escape(publiclyShow)}
    WHERE userID = ${mysql.escape(userID)};`;
	  await dbCon.query(sql , (err, result) => {
		    if(err) next(err);
        console.log('publiclyShow value updated');
    });
}

module.exports = updateUserPubliclyShow;
