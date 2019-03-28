const mysql = require('mysql');
const dbCon  = require('../../connection.js');

/*
  select all league with the leaguename, to check leaguenames when create
*/
var selectLeagueNames  = async function(name, callback) {
  var res;
    var sql = `SELECT LeagueName FROM League WHERE LeagueName = ${mysql.escape(name)}`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
        callback(null, result);
    });

}

module.exports = selectLeagueNames;
