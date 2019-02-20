const mysql = require('mysql');
const dbCon  = require('../connection.js');

//insert a new result in db
var insertFootballResults  = async function(fixtureID, HomeTeamScoreHT,
  AwayTeamScoreHT, HomeTeamScoreFT, AwayTeamScoreFT, MatchDescription) {
    var sql = `INSERT INTO FootballResults(fixtureID, HomeTeamScoreHT, AwayTeamScoreHT,
      HomeTeamScoreFT, AwayTeamScoreFT, MatchDescription)
      VALUES(${mysql.escape(fixtureID)}, ${mysql.escape(HomeTeamScoreHT)},
       ${mysql.escape(AwayTeamScoreHT)},  ${mysql.escape(HomeTeamScoreFT)},
       ${mysql.escape(AwayTeamScoreFT)},  ${mysql.escape(MatchDescription)});`;
	  await dbCon.query(sql , (err, result) => {
		    if(err) throw err;
        console.log('result added');
    });
}

module.exports = insertFootballResults;
