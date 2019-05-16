const mysql = require('mysql');
const dbCon  = require('../../connection.js');

// update cricket rankings
var updateCricketRanking = async function(seasonID, teamID, wins , draw, loss,
  RunsFor, WicketsFor, RunsAgainst, WicketsAgainst, points) {
    var sql = `UPDATE CricketRankings SET played = played + 1,
    wins = wins + ${mysql.escape(wins)}, draws = draws + ${mysql.escape(draw)},
    losses = losses + ${mysql.escape(loss)},
    RunsFor = RunsFor + ${mysql.escape(RunsFor)},
    WicketsFor = WicketsFor + ${mysql.escape(WicketsFor)},
    RunsAgainst = RunsAgainst + ${mysql.escape(RunsAgainst)},
    WicketsAgainst = WicketsAgainst + ${mysql.escape(WicketsAgainst)},
    Points = Points + ${mysql.escape(points)}
    WHERE seasonID = ${mysql.escape(seasonID)} and teamID = ${mysql.escape(teamID)};`;
	  await dbCon.query(sql , (err, result) => {
		    if(err) throw err;
        console.log('cricket ranking updated');
    });
}

module.exports = updateCricketRanking;
