const mysql = require('mysql');
const dbCon  = require('../connection.js');

//insert a new result in db
var insertTennisResults  = async function(fixtureID, HomePointsScoredS1,
  AwayPointsScoredS1, HomePointsScoredS2, AwayPointsScoredS2, HomePointsScoredS3,
  AwayPointsScoredS3, HomePointsScoredS4, AwayPointsScoredS4, HomePointsScoredS5,
  AwayPointsScoredS5, MatchDescription, callback) {
    var sql = `INSERT INTO TennisResults(fixtureID, HomePointsScoredS1,
      AwayPointsScoredS1, HomePointsScoredS2, AwayPointsScoredS2, HomePointsScoredS3,
      AwayPointsScoredS3, HomePointsScoredS4, AwayPointsScoredS4, HomePointsScoredS5,
      AwayPointsScoredS5, MatchDescription)
      VALUES(${mysql.escape(fixtureID)}, ${mysql.escape(HomePointsScoredS1)},
       ${mysql.escape(AwayPointsScoredS1)},  ${mysql.escape(HomePointsScoredS2)},
       ${mysql.escape(AwayPointsScoredS2)},  ${mysql.escape(HomePointsScoredS3)},
       ${mysql.escape(AwayPointsScoredS3)},  ${mysql.escape(HomePointsScoredS4)},
       ${mysql.escape(AwayPointsScoredS4)},  ${mysql.escape(HomePointsScoredS5)},
       ${mysql.escape(AwayPointsScoredS5)}, ${mysql.escape(MatchDescription)});`;
	  await dbCon.query(sql , (err, result) => {
		    if(err) callback(err);
        console.log('result added');
    });
}

module.exports = insertTennisResults;
