const mysql = require('mysql');
const dbCon  = require('../../connection.js');

// update tennis rankings
var updateTennisRanking = async function(seasonID, teamID, wins , draw, loss, SetsFor, SetsAgainst, points) {
    var sql = `UPDATE TennisRankings SET played = played + 1,
    wins = wins + ${mysql.escape(wins)}, draws = draws + ${mysql.escape(draw)},
    losses = losses + ${mysql.escape(loss)},
    SetsFor = SetsFor + ${mysql.escape(SetsFor)},
    SetsAgainst = SetsAgainst + ${mysql.escape(SetsAgainst)},
    Points = Points + ${mysql.escape(points)}
    WHERE seasonID = ${mysql.escape(seasonID)} and teamID = ${mysql.escape(teamID)};`;
	  await dbCon.query(sql , (err, result) => {
		    if(err) throw err;
        console.log('tennis ranking updated');
    });
}

module.exports = updateTennisRanking;
