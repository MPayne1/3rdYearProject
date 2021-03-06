// adds new league to db
const mysql = require('mysql');
const dbCon  = require('../connection.js');

//insert a new user into the db
var insertLeague  = async function(LeagueName, LeagueAdmin, Sport, maxTeams,
  pointsForLoss, pointsForDraw, pointsForWin, city, county, country, games, leagueDescription) {
    var sql = `INSERT INTO League(LeagueName, LeagueAdmin, Sport,
      maxTeams, pointsForLoss, pointsForDraw, pointsForWin, city, county, country, games, leagueDescription)
      VALUES(${mysql.escape(LeagueName)}, ${mysql.escape(LeagueAdmin)},
       ${mysql.escape(Sport)},  ${mysql.escape(maxTeams)},
        ${mysql.escape(pointsForLoss)},  ${mysql.escape(pointsForDraw)},
        ${mysql.escape(pointsForWin)},   ${mysql.escape(city)},
        ${mysql.escape(county)},  ${mysql.escape(country)},
         ${mysql.escape(games)}, ${mysql.escape(leagueDescription)});`;
	  await dbCon.query(sql , (err, result) => {
		    if(err) throw err;
        console.log('league added');
    });
}

module.exports = insertLeague;
