// handles all mysql select queries

const mysql = require('mysql');
const dbCon  = require('./connection.js');

/*
  select everything for a given username
*/
var selectLeagueAdmin = async function(leagueID, callback) {
  var res;
    var sql = `SELECT LeagueAdmin FROM league WHERE leagueID = ${mysql.escape(leagueID)}`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
        callback(null, res);
    });
    console.log(res);
}

module.exports = selectLeagueAdmin;