const mysql = require('mysql');
const dbCon  = require('../../connection.js');

//insert a new result in db
var insertVolleyballResults  = async function(fixtureID, HomePointsScoredG1,
  AwayPointsScoredG1, HomePointsScoredG2, AwayPointsScoredG2, HomePointsScoredG3,
  AwayPointsScoredG3, HomePointsScoredG4, AwayPointsScoredG4, HomePointsScoredG5,
  AwayPointsScoredG5, MatchDescription, callback) {
    var sql = `INSERT INTO VolleyballResults(fixtureID, HomePointsScoredG1,
      AwayPointsScoredG1, HomePointsScoredG2, AwayPointsScoredG2, HomePointsScoredG3,
      AwayPointsScoredG3, HomePointsScoredG4, AwayPointsScoredG4, HomePointsScoredG5,
      AwayPointsScoredG5, MatchDescription)
      VALUES(${mysql.escape(fixtureID)}, ${mysql.escape(HomePointsScoredG1)},
       ${mysql.escape(AwayPointsScoredG1)},  ${mysql.escape(HomePointsScoredG2)},
       ${mysql.escape(AwayPointsScoredG2)},  ${mysql.escape(HomePointsScoredG3)},
       ${mysql.escape(AwayPointsScoredG3)},  ${mysql.escape(HomePointsScoredG4)},
       ${mysql.escape(AwayPointsScoredG4)},  ${mysql.escape(HomePointsScoredG5)},
       ${mysql.escape(AwayPointsScoredG5)}, ${mysql.escape(MatchDescription)});`;
	  await dbCon.query(sql , (err, result) => {
		    if(err) callback(err);
        console.log('result added');
    });
}

module.exports = insertVolleyballResults;
