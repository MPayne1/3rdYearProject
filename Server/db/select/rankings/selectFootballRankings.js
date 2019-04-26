const mysql = require('mysql');
const dbCon  = require('../../connection.js');

/*
  select the football rankings
*/
var selectFootballRankings  = async function(leagueID, callback) {
  var res;
    var sql = `SELECT footballRankings.seasonID, footballrankings.teamID,
    teamname, Played, Wins, Draws, Losses, GoalsScored, GoalsConceded, points, imagePath
    FROM footballRankings, season, team
    WHERE season.leagueID = ${mysql.escape(leagueID)}
    and season.seasonID = footballRankings.seasonID and Finished = 'false'
    and team.teamID = footballrankings.teamID order by points desc`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
        callback(null, res);
    });
}

module.exports = selectFootballRankings;
