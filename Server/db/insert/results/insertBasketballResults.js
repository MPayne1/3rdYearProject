const mysql = require('mysql');
const dbCon  = require('../../connection.js');


//insert a new result in db
var insertBasketballResults  = async function(fixtureID, HomePointsScoredQ1,
  AwayPointsScoredQ1, HomePointsScoredHT, AwayPointsScoredHT, HomePointsScoredQ3,
  AwayPointsScoredQ3, HomePointsScoredFT, AwayPointsScoredFT, MatchDescription, callback) {
    var sql = `INSERT INTO BasketballResults(fixtureID, HomePointsScoredQ1,
      AwayPointsScoredQ1, HomePointsScoredHT, AwayPointsScoredHT, HomePointsScoredQ3,
      AwayPointsScoredQ3, HomePointsScoredFT, AwayPointsScoredFT, MatchDescription)
      VALUES(${mysql.escape(fixtureID)}, ${mysql.escape(HomePointsScoredQ1)},
       ${mysql.escape(AwayPointsScoredQ1)},  ${mysql.escape(HomePointsScoredHT)},
       ${mysql.escape(AwayPointsScoredHT)},  ${mysql.escape(HomePointsScoredQ3)},
       ${mysql.escape(AwayPointsScoredQ3)},  ${mysql.escape(HomePointsScoredFT)},
       ${mysql.escape(AwayPointsScoredFT)},  ${mysql.escape(MatchDescription)});`;
	  await dbCon.query(sql , (err, result) => {
		    if(err) callback(err);
        console.log('result added');
    });
}


module.exports = insertBasketballResults;
