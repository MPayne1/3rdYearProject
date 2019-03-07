const mysql = require('mysql');
const dbCon  = require('../../connection.js');

/*
  select the rugby rankings
*/
var selectRugbyRankings  = async function(leagueID, callback) {
  var res;
    var sql = `SELECT rugbyRankings.seasonID, rugbyrankings.teamID,
    teamname, Played, Wins, Draws, Losses, PointsScored, PointsConceded, points
    FROM rugbyRankings, season, team
    WHERE season.leagueID = ${mysql.escape(leagueID)}
    and season.seasonID = rugbyRankings.seasonID and Finished = 'false'
    and team.teamID = rugbyrankings.teamID order by points desc`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
        callback(null, res);
    });
}

module.exports = selectRugbyRankings;
