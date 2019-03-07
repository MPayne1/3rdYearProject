const mysql = require('mysql');
const dbCon  = require('../../connection.js');

/*
  select the table tennis rankings
*/
var selectTableTennisRankings  = async function(leagueID, callback) {
  var res;
    var sql = `SELECT tableTennisRankings.seasonID, tableTennisRankings.teamID,
    teamname, Played, Wins, Draws, Losses, SetsFor, SetsAgainst, points
    FROM tableTennisRankings, season, team
    WHERE season.leagueID = ${mysql.escape(leagueID)}
    and season.seasonID = tableTennisRankings.seasonID and Finished = 'false'
    and team.teamID = tableTennisRankings.teamID order by points desc`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
        callback(null, res);
    });
}

module.exports = selectTableTennisRankings;
