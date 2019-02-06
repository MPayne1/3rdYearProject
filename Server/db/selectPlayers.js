const mysql = require('mysql');
const dbCon  = require('./connection.js');

/*
  select everything for a given username
*/
var selectPlayer  = async function(username, teamID, callback) {
  var res;
    var sql = `SELECT playsfor.userID FROM playsfor, users WHERE username =
      ${mysql.escape(username)} and playsfor.userID = users.userID and playsfor.teamID = ${mysql.escape(teamID)}`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
        callback(null, res);
    });

}

module.exports = selectPlayer;
