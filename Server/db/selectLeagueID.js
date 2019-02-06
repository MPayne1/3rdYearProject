// handles all mysql select queries

const mysql = require('mysql');
const dbCon  = require('./connection.js');

/*
  select leagueID for a leagueName
*/
var selectLeagueID  = async function(name, callback) {
  var res;
    var sql = `SELECT leagueID FROM league WHERE LeagueName = ${mysql.escape(name)}`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
        callback(null, res);
    });
}

module.exports = selectLeagueID;
