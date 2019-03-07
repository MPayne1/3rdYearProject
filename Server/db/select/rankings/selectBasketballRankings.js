const mysql = require('mysql');
const dbCon  = require('../../connection.js');

/*
  select the basketball rankings
*/
var selectBasketballRankings  = async function(leagueID, callback) {
  var res;
    var sql = `SELECT basketballRankings.seasonID, basketballRankings.teamID,
    teamname, Played, Wins, Draws, Losses, PointsScored, PointsConceded, points
    FROM basketballRankings, season, team
    WHERE season.leagueID = ${mysql.escape(leagueID)}
    and season.seasonID = basketballRankings.seasonID and Finished = 'false'
    and team.teamID = basketballRankings.teamID order by points desc`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
        callback(null, res);
    });
}

module.exports = selectBasketballRankings;
