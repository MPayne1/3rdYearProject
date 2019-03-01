const mysql = require('mysql');
const dbCon  = require('../connection.js');

/*
  select everything for a given username
*/
var selectLeagueAdmin = async function(leagueAdmin, leagueID, callback) {
  var res;
    var sql = `SELECT LeagueAdmin, games FROM league WHERE leagueAdmin = ${mysql.escape(leagueAdmin)}
    and  leagueID = ${mysql.escape(leagueID)}`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
        callback(null, res);
    });
}

module.exports = selectLeagueAdmin;
