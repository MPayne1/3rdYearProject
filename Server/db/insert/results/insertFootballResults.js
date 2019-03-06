const mysql = require('mysql');
const dbCon  = require('../../connection.js');

//insert a new result in db
var insertFootballResults  = async function(fixtureID, HomeGoalsScoredHT,
  AwayGoalsScoredHT, HomeGoalsScoredFT, AwayGoalsScoredFT, MatchDescription, callback) {
    var sql = `INSERT INTO FootballResults(fixtureID, HomeGoalsScoredHT, AwayGoalsScoredHT,
      HomeGoalsScoredFT, AwayGoalsScoredFT, MatchDescription)
      VALUES(${mysql.escape(fixtureID)}, ${mysql.escape(HomeGoalsScoredHT)},
       ${mysql.escape(AwayGoalsScoredHT)},  ${mysql.escape(HomeGoalsScoredFT)},
       ${mysql.escape(AwayGoalsScoredFT)},  ${mysql.escape(MatchDescription)});`;
	  await dbCon.query(sql , (err, result) => {
		    if(err) callback(err);
        console.log('result added');
    });
}

module.exports = insertFootballResults;
