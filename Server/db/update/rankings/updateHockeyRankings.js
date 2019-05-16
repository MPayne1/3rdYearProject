const mysql = require('mysql');
const dbCon  = require('../../connection.js');

// update hockey rankings
var updateHockeyRanking  = async function(seasonID, teamID, wins , draw, loss, PointsScored, PointsConceded, points) {
    var sql = `UPDATE hockeyRankings SET played = played + 1,
    wins = wins + ${mysql.escape(wins)}, draws = draws + ${mysql.escape(draw)},
    losses = losses + ${mysql.escape(loss)},
    GoalsScored = GoalsScored + ${mysql.escape(PointsScored)},
    GoalsConceded = GoalsConceded + ${mysql.escape(PointsConceded)},
    Points = Points + ${mysql.escape(points)}
    WHERE seasonID = ${mysql.escape(seasonID)} and teamID = ${mysql.escape(teamID)};`;
	  await dbCon.query(sql , (err, result) => {
		    if(err) throw err;
        console.log('Hockey ranking updated');
    });
}

module.exports = updateHockeyRanking;
