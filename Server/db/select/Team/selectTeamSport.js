const mysql = require('mysql');
const dbCon  = require('../../connection.js');

/*
  select sport for a leagueID
*/
var selectTeamSport  = async function(teamID, callback) {
  var res;
    var sql = `SELECT Sport FROM team WHERE TeamID = ${mysql.escape(teamID)}`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
        callback(null, res);
    });
}

module.exports = selectTeamSport;
