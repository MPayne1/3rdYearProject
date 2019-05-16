const mysql = require('mysql');
const dbCon  = require('../connection.js');

// insert a new user into the db
var insertTeam  = async function(TeamName, TeamAdmin, LeagueID, teamDescription, path) {
    var sql = `INSERT INTO Team(TeamName, TeamAdmin,LeagueID, teamDescription, imagePath)
      VALUES(${mysql.escape(TeamName)}, ${mysql.escape(TeamAdmin)},
       ${mysql.escape(LeagueID)}, ${mysql.escape(teamDescription)}, ${mysql.escape(path)});`;
	  await dbCon.query(sql , (err, result) => {
		    if(err) throw err;
        console.log('team added');
    });
}

module.exports = insertTeam;
