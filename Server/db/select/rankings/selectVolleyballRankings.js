const mysql = require('mysql');
const dbCon  = require('../../connection.js');

/*
  select the volleyball rankings
*/
var selectVolleyballRankings  = async function(leagueID, callback) {
  var res;
    var sql = `SELECT volleyballRankings.seasonID, volleyballRankings.teamID,
    teamname, Played, Wins, Draws, Losses, GamesFor, GamesAgainst, points, imagePath
    FROM volleyballRankings, season, team
    WHERE season.leagueID = ${mysql.escape(leagueID)}
    and season.seasonID = volleyballRankings.seasonID and Finished = 'false'
    and team.teamID = volleyballRankings.teamID order by points desc`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
        callback(null, res);
    });
}

module.exports = selectVolleyballRankings;
