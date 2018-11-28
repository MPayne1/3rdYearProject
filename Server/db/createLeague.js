// adds new league to db

const mysql = require('mysql');
const dbCon  = require('./connection.js');

//insert a new user into the db
var insertLeague  = async function(LeagueName, LeagueAdmin, Sport, maxTeams,
  pointsForLoss, pointsForDraw, pointsForWin, games) {
    var sql = `INSERT INTO League(LeagueName, LeagueAdmin, Sport,
      maxTeams, pointsForLoss, pointsForDraw, pointsForWin, games)
      VALUES(${mysql.escape(LeagueName)}, ${mysql.escape(LeagueAdmin)},
       ${mysql.escape(Sport)},  ${mysql.escape(maxTeams)},
        ${mysql.escape(pointsForLoss)},  ${mysql.escape(pointsForDraw)},
        ${mysql.escape(pointsForWin)}, ${mysql.escape(games)});`;
	  await dbCon.query(sql , (err, result) => {
		    if(err) throw err;
        console.log('league added');
    });
}

module.exports = insertLeague;
