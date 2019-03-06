const mysql = require('mysql');
const dbCon  = require('../connection.js');

/*
  select teams from a league
*/
var selectSportFromSeasonID  = async function(seasonID, callback) {
  var res;
    var sql = `SELECT sport FROM league, season
    WHERE SeasonID = ${mysql.escape(seasonID)}
    and league.leagueID = season.leagueID`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
        callback(null, res);
    });
}

module.exports = selectSportFromSeasonID;
