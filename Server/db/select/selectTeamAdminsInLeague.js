const mysql = require('mysql');
const dbCon  = require('../connection.js');

/*
  select team admins in the league
*/
var selectTeamAdmins = async function(leagueID, userID, callback) {
  var res;
    var sql = `SELECT TeamAdmin FROM league, team WHERE
    team.LeagueID = league.LeagueID and league.leagueID = ${mysql.escape(leagueID)}
    and teamAdmin =  ${mysql.escape(userID)};`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
        callback(null, res);
    });
}

module.exports = selectTeamAdmins;
