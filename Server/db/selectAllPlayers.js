// handles all mysql select queries

const mysql = require('mysql');
const dbCon  = require('./connection.js');

/*
  select everything for a given username
*/
var selectPlayers  = async function(teamname, callback) {
  var res;
    var sql = `SELECT username FROM playsfor, users, team WHERE playsfor.userID = users.userID and playsfor.teamID = team.TeamID and team.teamname = ${mysql.escape(teamname)}`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
        callback(null, res);
    });

}

module.exports = selectPlayers;
