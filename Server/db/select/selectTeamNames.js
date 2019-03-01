const mysql = require('mysql');
const dbCon  = require('../connection.js');

/*
  select all teams with the teamname, to check teamnames when create
*/
var selectTeamNames  = async function(name, callback) {
  var res;
    var sql = `SELECT TeamName FROM team WHERE TeamName = ${mysql.escape(name)}`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
        callback(null, result);
    });
}

module.exports = selectTeamNames;
 //select teamname, team.sport from team,league where teamname = "mattTeam" and league.sport = "Tennis";
