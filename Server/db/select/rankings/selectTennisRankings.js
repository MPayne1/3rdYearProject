const mysql = require('mysql');
const dbCon  = require('../../connection.js');

/*
  select the tennis rankings
*/
var selectTennisRankings  = async function(leagueID, callback) {
  var res;
    var sql = `SELECT tennisRankings.seasonID, tennisRankings.teamID,
    teamname, Played, Wins, Draws, Losses, SetsFor, SetsAgainst, points, imagePath
    FROM tennisRankings, season, team
    WHERE season.leagueID = ${mysql.escape(leagueID)}
    and season.seasonID = tennisRankings.seasonID and Finished = 'false'
    and team.teamID = tennisRankings.teamID order by points desc`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
        callback(null, res);
    });
}

module.exports = selectTennisRankings;
