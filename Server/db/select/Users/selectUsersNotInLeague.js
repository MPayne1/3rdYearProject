const mysql = require('mysql');
const dbCon  = require('../../connection.js');

/*
  select all users not in the league, for addplayer to team
*/
var selectUserNames  = async function(teamID, callback) {
  var res;
    var sql = `SELECT username FROM users WHERE userID NOT IN
    (SELECT userID FROM playsfor, team, league
    WHERE team.leagueID = (SELECT leagueID FROM team WHERE teamID = ${mysql.escape(teamID)})
      and team.leagueID = league.leagueID and team.teamID = playsfor.teamID);`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
        callback(null, result);
    });

}

module.exports = selectUserNames;
