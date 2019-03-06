const mysql = require('mysql');
const dbCon  = require('../../connection.js');

//insert a new ranking in db, for initialising ranking for the season
var insertVolleyballRankings  = async function(seasonID, teamID, played,
  wins, draws, losses, GamesFor, GamesAgainst, Points) {
    var sql = `INSERT INTO VolleyballRankings(seasonID, TeamID, played,
      wins, draws, losses, GamesFor, GamesAgainst, Points)
      VALUES(${mysql.escape(seasonID)}, ${mysql.escape(teamID)},
       ${mysql.escape(played)},  ${mysql.escape(wins)},
       ${mysql.escape(draws)},  ${mysql.escape(losses)},
       ${mysql.escape(GamesFor)},  ${mysql.escape(GamesAgainst)},
       ${mysql.escape(Points)});`;
	  await dbCon.query(sql , (err, result) => {
		    if(err) throw(err);
        console.log('ranking added');
    });
}

module.exports = insertVolleyballRankings;
