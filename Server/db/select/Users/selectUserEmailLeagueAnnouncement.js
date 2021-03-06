const mysql = require('mysql');
const dbCon  = require('../../connection.js');

/*
  select info for emailing league announcements
*/
var selectUser  = async function(LeagueID, callback) {
  var res;
    var sql = `SELECT email, firstname, lastname, leagueName FROM users, team, playsfor, league
    WHERE team.LeagueID =  ${mysql.escape(LeagueID)}
    and team.TeamID = playsfor.TeamID and playsfor.UserID = users.UserID
    and league.LeagueID = team.LeagueID`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
          callback(null, res);
    });

}

module.exports = selectUser;
