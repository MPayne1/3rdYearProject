const mysql = require('mysql');
const dbCon  = require('../../connection.js');

// update football rankings
var updateFootballRanking  = async function(seasonID, teamID, wins , draw, loss, GoalsScored, GoalsConceded, points) {
    var sql = `UPDATE footballRankings SET played = played + 1,
    wins = wins + ${mysql.escape(wins)}, draws = draws + ${mysql.escape(draw)},
    losses = losses + ${mysql.escape(loss)},
    GoalsScored = GoalsScored + ${mysql.escape(GoalsScored)},
    GoalsConceded = GoalsConceded + ${mysql.escape(GoalsConceded)},
    Points = Points + ${mysql.escape(points)}
    WHERE seasonID = ${mysql.escape(seasonID)} and teamID = ${mysql.escape(teamID)};`;
	  await dbCon.query(sql , (err, result) => {
		    if(err) throw err;
        console.log('football ranking updated');
    });
}

module.exports = updateFootballRanking;
