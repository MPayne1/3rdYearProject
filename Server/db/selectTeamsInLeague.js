const mysql = require('mysql');
const dbCon  = require('./connection.js');

/*
  select teams from a league
*/
var selectTeamsInLeague  = async function(leagueID, callback) {
  var res;
    var sql = `SELECT teamID FROM team WHERE LeagueID = ${mysql.escape(leagueID)}`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
        callback(null, res);
    });
}

module.exports = selectTeamsInLeague;
