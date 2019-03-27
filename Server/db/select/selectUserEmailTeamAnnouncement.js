const mysql = require('mysql');
const dbCon  = require('../connection.js');

/*
  select everything for a given username
*/
var selectUser  = async function(TeamID, callback) {
  var res;
    var sql = `SELECT email, firstname, lastname, teamname FROM users, team, playsfor
    WHERE team.TeamID =  + ${mysql.escape(TeamID)}
    and team.TeamID = playsfor.TeamID and playsfor.UserID = users.UserID`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
          callback(null, res);
    });

}

module.exports = selectUser;
