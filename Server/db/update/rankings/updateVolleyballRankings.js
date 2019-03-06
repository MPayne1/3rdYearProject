const mysql = require('mysql');
const dbCon  = require('../../connection.js');

//insert a new user into the db
var updateVolleyballRanking = async function(seasonID, teamID, wins , draw, loss, GamesFor, GamesAgainst, points) {
    var sql = `UPDATE VolleyballRankings SET played = played + 1,
    wins = wins + ${mysql.escape(wins)}, draws = draws + ${mysql.escape(draw)},
    losses = losses + ${mysql.escape(loss)},
    GamesFor = GamesFor + ${mysql.escape(GamesFor)},
    GamesAgainst = GamesAgainst + ${mysql.escape(GamesAgainst)},
    Points = Points + ${mysql.escape(points)}
    WHERE seasonID = ${mysql.escape(seasonID)} and teamID = ${mysql.escape(teamID)};`;
	  await dbCon.query(sql , (err, result) => {
		    if(err) throw err;
        console.log('volleyball ranking updated');
    });
}

module.exports = updateVolleyballRanking;
