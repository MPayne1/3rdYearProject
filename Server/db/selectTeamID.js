// handles all mysql select queries

const mysql = require('mysql');
const dbCon  = require('./connection.js');

/*
  select all teams with the teamname, to check teamnames when create
*/
var selectTeamID  = async function(name, callback) {
  var res;
    var sql = `SELECT teamID FROM team WHERE TeamName = ${mysql.escape(name)}`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
        callback(null, result);
    });
}

module.exports = selectTeamID;
