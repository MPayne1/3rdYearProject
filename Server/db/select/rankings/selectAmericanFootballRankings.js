const mysql = require('mysql');
const dbCon  = require('../../connection.js');

/*
  select the american football rankings
*/
var selectAmericanFootballRankings  = async function(leagueID, callback) {
  var res;
    var sql = `SELECT americanFootballRankings.seasonID, americanFootballRankings.teamID,
    teamname, Played, Wins, Draws, Losses, PointsScored, PointsConceded, points, imagePath
    FROM americanFootballRankings, season, team
    WHERE season.leagueID = ${mysql.escape(leagueID)}
    and season.seasonID = americanFootballRankings.seasonID and Finished = 'false'
    and team.teamID = americanFootballRankings.teamID order by points desc`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
        callback(null, res);
    });
}

module.exports = selectAmericanFootballRankings;
