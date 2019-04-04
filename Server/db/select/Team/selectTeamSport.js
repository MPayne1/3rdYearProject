const mysql = require('mysql');
const dbCon  = require('../../connection.js');

/*
  select sport for a leagueID
*/
var selectTeamSport  = async function(teamID, callback) {
  var res;
    var sql = `SELECT Sport, teamDescription FROM team, league
    WHERE TeamID = ${mysql.escape(teamID)} and league.leagueID = team.leagueID`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
        callback(null, res);
    });
}

module.exports = selectTeamSport;
