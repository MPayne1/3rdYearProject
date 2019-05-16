const mysql = require('mysql');
const dbCon  = require('../connection.js');

// insert a new season into db and then retireve the seaosnID
var insertSelectSeason  = async function(leagueID, callback) {
  var res;
    var sql = `INSERT INTO season(leagueID)
      VALUES(${mysql.escape(leagueID)}); `;
	  await dbCon.query(sql , (err, result) => {
		    if(err) throw err;
        console.log('season added');
    });
    var sql2 = `SELECT seasonID FROM season WHERE LeagueID = ${mysql.escape(leagueID)};`;
    await dbCon.query(sql2, (err, result, fields) => {
      if(err) throw err;
      callback(null, result);
    });
}

module.exports = insertSelectSeason;
