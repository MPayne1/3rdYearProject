const mysql = require('mysql');
const dbCon  = require('../connection.js');

// insert a new user into the db
var insertFixture  = async function(seasonID, HomeTeamID, AwayTeamID) {
    var sql = `INSERT INTO fixture(seasonID, HomeTeamID,
      AwayTeamID)
      VALUES(${mysql.escape(seasonID)},${mysql.escape(HomeTeamID)},
       ${mysql.escape(AwayTeamID)});`;
	  await dbCon.query(sql , (err, result) => {
		    if(err) throw err;
    });
}

module.exports = insertFixture;
