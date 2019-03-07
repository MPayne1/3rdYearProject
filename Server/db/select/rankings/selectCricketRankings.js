const mysql = require('mysql');
const dbCon  = require('../../connection.js');

/*
  select the cricket rankings
*/
var selectCricketRankings  = async function(leagueID, callback) {
  var res;
    var sql = `SELECT cricketRankings.seasonID, cricketRankings.teamID,teamname,
    Played, Wins, Draws, Losses, RunsFor, WicketsFor, RunsAgainst,
    WicketsAgainst, points FROM cricketRankings, season, team
    WHERE season.leagueID = ${mysql.escape(leagueID)}
    and season.seasonID = cricketRankings.seasonID and Finished = 'false'
    and team.teamID = cricketRankings.teamID order by points desc`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
        callback(null, res);
    });
}

module.exports = selectCricketRankings;
