const mysql = require('mysql');
const dbCon  = require('../../connection.js');


//insert a new result in db
var insertCricketResults  = async function(fixtureID, HomeRunsI1,
  AwayRunsI1, HomeWicketsLostI1, AwayWicketsLostI1, HomeRunsI2,
  AwayRunsI2, HomeWicketsLostI2, AwayWicketsLostI2, MatchDescription, callback) {
    var sql = `INSERT INTO Cricketresults(fixtureID, HomeRunsI1,
      AwayRunsI1, HomeWicketsLostI1, AwayWicketsLostI1, HomeRunsI2,
      AwayRunsI2, HomeWicketsLostI2, AwayWicketsLostI2, MatchDescription)
      VALUES(${mysql.escape(fixtureID)}, ${mysql.escape(HomeRunsI1)},
       ${mysql.escape(AwayRunsI1)},  ${mysql.escape(HomeWicketsLostI1)},
       ${mysql.escape(AwayWicketsLostI1)},  ${mysql.escape(HomeRunsI2)},
       ${mysql.escape(AwayRunsI2)},  ${mysql.escape(HomeWicketsLostI2)},
       ${mysql.escape(AwayWicketsLostI2)},  ${mysql.escape(MatchDescription)});`;
	  await dbCon.query(sql , (err, result) => {
		    if(err) callback(err);
        console.log('result added');
    });
}


module.exports = insertCricketResults;
