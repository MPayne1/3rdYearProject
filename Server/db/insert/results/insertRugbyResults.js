const mysql = require('mysql');
const dbCon  = require('../../connection.js');


//insert a new result in db
var insertRugbyResults  = async function(fixtureID, HomePointsScoredHT
  , AwayPointsScoredHT, HomePointsScoredFT, AwayPointsScoredFT
  , MatchDescription, callback) {
    var sql = `INSERT INTO RugbyResults(fixtureID, HomePointsScoredHT
      , AwayPointsScoredHT, HomePointsScoredFT, AwayPointsScoredFT, MatchDescription)
      VALUES(${mysql.escape(fixtureID)}, ${mysql.escape(HomePointsScoredHT)},
       ${mysql.escape(AwayPointsScoredHT)}, ${mysql.escape(HomePointsScoredFT)},
       ${mysql.escape(AwayPointsScoredFT)}, ${mysql.escape(MatchDescription)});`;
	  await dbCon.query(sql , (err, result) => {
		    if(err) callback(err);
        console.log('result added');
    });
}


module.exports = insertRugbyResults;
