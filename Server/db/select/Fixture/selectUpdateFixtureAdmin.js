const mysql = require('mysql');
const dbCon  = require('../../connection.js');

/*
  select leagueadmin/team captains
*/
var selectUpdateFixtureAdmin = async function(userID,fixtureID, callback) {
  var res;
    var sql = `SELECT DISTINCT LeagueAdmin, TeamAdmin FROM league, fixture, team WHERE
    FixtureID = ${mysql.escape(fixtureID)} and team.LeagueID = league.LeagueID
    and (HomeTeamID = team.teamID OR AwayTeamID = team.teamID)
    and (TeamAdmin = ${mysql.escape(userID)} OR leagueAdmin = ${mysql.escape(userID)});`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
        callback(null, res);
    });
}

module.exports = selectUpdateFixtureAdmin;
