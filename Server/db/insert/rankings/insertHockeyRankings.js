const mysql = require('mysql');
const dbCon  = require('../../connection.js');

//insert a new ranking in db, for initialising ranking for the season
var insertHockeyRankings  = async function(seasonID, teamID, played,
  wins, draws, losses, GoalsScored, GoalsConceded, Points) {
    var sql = `INSERT INTO hockeyRankings(seasonID, TeamID, played,
      wins, draws, losses, GoalsScored, GoalsConceded, Points)
      VALUES(${mysql.escape(seasonID)}, ${mysql.escape(teamID)},
       ${mysql.escape(played)},  ${mysql.escape(wins)},
       ${mysql.escape(draws)},  ${mysql.escape(losses)},
       ${mysql.escape(GoalsScored)},  ${mysql.escape(GoalsConceded)},
       ${mysql.escape(Points)});`;
	  await dbCon.query(sql , (err, result) => {
		    if(err) throw(err);
        console.log('ranking added');
    });
}

module.exports = insertHockeyRankings;
