const mysql = require('mysql');
const dbCon  = require('../../connection.js');

/*
  select everything for a given username
*/
var selectUser  = async function(userID, callback) {
  var res;
    var sql = `SELECT message, leaguename FROM users, playsfor, team, leagueannouncement, league
    WHERE users.UserID = ${mysql.escape(userID)} and users.userID = playsfor.UserID
    and playsfor.teamID = team.TeamID and team.LeagueID = leagueannouncement.LeagueID
    and league.leagueID = team.leagueID;`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
          callback(null, res);
    });

}

module.exports = selectUser;
