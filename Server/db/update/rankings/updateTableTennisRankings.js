const mysql = require('mysql');
const dbCon  = require('../../connection.js');

//insert a new user into the db
var updateTableTennisRanking = async function(seasonID, teamID, wins , draw, loss, SetsFor, SetsAgainst, points) {
    var sql = `UPDATE TableTennisRankings SET played = played + 1,
    wins = wins + ${mysql.escape(wins)}, draws = draws + ${mysql.escape(draw)},
    losses = losses + ${mysql.escape(loss)},
    SetsFor = SetsFor + ${mysql.escape(SetsFor)},
    SetsAgainst = SetsAgainst + ${mysql.escape(SetsAgainst)},
    Points = Points + ${mysql.escape(points)}
    WHERE seasonID = ${mysql.escape(seasonID)} and teamID = ${mysql.escape(teamID)};`;
	  await dbCon.query(sql , (err, result) => {
		    if(err) throw err;
        console.log('table tennis ranking updated');
    });
}

module.exports = updateTableTennisRanking;
