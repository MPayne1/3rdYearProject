const mysql = require('mysql');
const dbCon  = require('../connection.js');

/*
  select everything for a given username
*/
var selectUser  = async function(LeagueID, callback) {
  var res;
    var sql = `SELECT email, firstname, lastname, teamname FROM users, team, playsfor, league
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
