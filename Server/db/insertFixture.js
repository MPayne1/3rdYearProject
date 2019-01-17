// adds new league to db

const mysql = require('mysql');
const dbCon  = require('./connection.js');

//insert a new user into the db
var insertFixture  = async function(leagueID, seasonID, HomeTeamID, AwayTeamID) {
    var sql = `INSERT INTO fixture(leagueID, seasonID, HomeTeamID,
      AwayTeamID)
      VALUES(${mysql.escape(leagueID)}, ${mysql.escape(seasonID)},
       ${mysql.escape(HomeTeamID)},  ${mysql.escape(AwayTeamID)});`;
	  await dbCon.query(sql , (err, result) => {
		    if(err) throw err;
        console.log('fixture added');
    });
}

module.exports = insertFixture;
