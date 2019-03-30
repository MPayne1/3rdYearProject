const mysql = require('mysql');
const dbCon  = require('../../connection.js');

/*
  select everything for a given username
*/
var selectUser  = async function(userID, callback) {
  var res;
    var sql = `SELECT message, teamname FROM users, playsfor, team, teamannouncement
    WHERE users.UserID =  + ${mysql.escape(userID)} and users.userID = playsfor.UserID
    and playsfor.teamID = team.TeamID and team.TeamID = teamannouncement.teamID`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
          callback(null, res);
    });

}

module.exports = selectUser;
