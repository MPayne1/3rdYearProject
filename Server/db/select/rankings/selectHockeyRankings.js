const mysql = require('mysql');
const dbCon  = require('../../connection.js');

/*
  select the hockey rankings
*/
var selectHockeyRankings  = async function(leagueID, callback) {
  var res;
    var sql = `SELECT hockeyRankings .seasonID, hockeyRankings.teamID,
    teamname, Played, Wins, Draws, Losses, GoalsScored, GoalsConceded, points
    FROM hockeyRankings, season, team
    WHERE season.leagueID = ${mysql.escape(leagueID)}
    and season.seasonID = hockeyRankings.seasonID and Finished = 'false'
    and team.teamID = hockeyRankings.teamID order by points desc`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
        callback(null, res);
    });
}

module.exports = selectHockeyRankings;
