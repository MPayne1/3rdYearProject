const mysql = require('mysql');
const dbCon  = require('../connection.js');

/*
  select everything for a given userID
*/
var selectUser  = async function(userID, callback) {
  var res;
    var sql = `SELECT LastName, FirstName, Email, PhoneNumber, Bio, publiclyShow FROM users WHERE userID =  + ${mysql.escape(userID)}`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
        callback(null, res);
    });
}

module.exports = selectUser;
