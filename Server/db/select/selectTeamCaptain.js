const mysql = require('mysql');
const dbCon  = require('../connection.js');

/*
  select everything for a given username
*/
var selectTeamCaptain  = async function(userID, teamID, callback) {
  var res;
    var sql = `SELECT TeamAdmin FROM team WHERE TeamAdmin =
      ${mysql.escape(userID)}  and teamID = ${mysql.escape(teamID)}`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
        callback(null, res);
    });
    console.log(res);
}

module.exports = selectTeamCaptain;
