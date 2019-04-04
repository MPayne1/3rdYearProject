const mysql = require('mysql');
const dbCon  = require('../../connection.js');

/*
  select sport for a leagueID
*/
var selectLeagueSport  = async function(leagueID, callback) {
  var res;
    var sql = `SELECT Sport, leagueDescription FROM league WHERE LeagueID = ${mysql.escape(leagueID)}`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
        callback(null, res);
    });
}

module.exports = selectLeagueSport;
