const mysql = require('mysql');
const dbCon  = require('../../connection.js');

// update rugby rankings
var updateRugbyRanking  = async function(seasonID, teamID, wins , draw, loss, PointsScored, PointsConceded, points) {
    var sql = `UPDATE rugbyRankings SET played = played + 1,
    wins = wins + ${mysql.escape(wins)}, draws = draws + ${mysql.escape(draw)},
    losses = losses + ${mysql.escape(loss)},
    PointsScored = PointsScored + ${mysql.escape(PointsScored)},
    PointsConceded = PointsConceded + ${mysql.escape(PointsConceded)},
    Points = Points + ${mysql.escape(points)}
    WHERE seasonID = ${mysql.escape(seasonID)} and teamID = ${mysql.escape(teamID)};`;
	  await dbCon.query(sql , (err, result) => {
		    if(err) throw err;
        console.log('rugby ranking updated');
    });
}

module.exports = updateRugbyRanking;
