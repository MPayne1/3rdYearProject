const mysql = require('mysql');
const dbCon  = require('../../connection.js');

/*
  select all players in a team
*/
var selectPlayers  = async function(teamname, callback) {
  var res;
    var sql = `SELECT username, users.imagePath FROM playsfor, users, team WHERE playsfor.userID = users.userID and playsfor.teamID = team.TeamID and team.teamname = ${mysql.escape(teamname)}`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
        callback(null, res);
    });

}

module.exports = selectPlayers;
