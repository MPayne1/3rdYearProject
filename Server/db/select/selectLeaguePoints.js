const mysql = require('mysql');
const dbCon  = require('../connection.js');

/*
  select the points allocation for the league, from the fixtureID
*/
var selectLeaguePoints = async function(fixtureID, callback) {
  var res;
    var sql = `SELECT pointsForWin, pointsForDraw, pointsForLoss FROM league,fixture WHERE fixtureID = ${mysql.escape(fixtureID)}
    and fixture.leagueID = league.leagueID`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
        callback(null, res);
    });
}

module.exports = selectLeaguePoints;
