const mysql = require('mysql');
const dbCon  = require('../connection.js');

//insert a new user into the db
var insertTeam  = async function(TeamName, TeamAdmin, LeagueID, Sport) {
    var sql = `INSERT INTO Team(TeamName, TeamAdmin,LeagueID, Sport)
      VALUES(${mysql.escape(TeamName)}, ${mysql.escape(TeamAdmin)},
       ${mysql.escape(LeagueID)},  ${mysql.escape(Sport)});`;
	  await dbCon.query(sql , (err, result) => {
		    if(err) throw err;
        console.log('team added');
    });
}

module.exports = insertTeam;
