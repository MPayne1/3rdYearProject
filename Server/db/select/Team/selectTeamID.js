const mysql = require('mysql');
const dbCon  = require('../../connection.js');

/*
  select teamID for a teamname
*/
var selectTeamID  = async function(name, callback) {
  var res;
    var sql = `SELECT teamID FROM team WHERE TeamName = ${mysql.escape(name)}`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
        callback(null, res);
    });
}

module.exports = selectTeamID;
