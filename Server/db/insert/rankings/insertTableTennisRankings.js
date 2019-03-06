const mysql = require('mysql');
const dbCon  = require('../../connection.js');

//insert a new ranking in db, for initialising ranking for the season
var insertTableTennisRankings  = async function(seasonID, teamID, played,
  wins, draws, losses, SetsFor, SetsAgainst, Points) {
    var sql = `INSERT INTO TableTennisRankings(seasonID, TeamID, played,
      wins, draws, losses, SetsFor, SetsAgainst, Points)
      VALUES(${mysql.escape(seasonID)}, ${mysql.escape(teamID)},
       ${mysql.escape(played)},  ${mysql.escape(wins)},
       ${mysql.escape(draws)},  ${mysql.escape(losses)},
       ${mysql.escape(SetsFor)},  ${mysql.escape(SetsAgainst)},
       ${mysql.escape(Points)});`;
	  await dbCon.query(sql , (err, result) => {
		    if(err) throw(err);
        console.log('ranking added');
    });
}

module.exports = insertTableTennisRankings;
