const mysql = require('mysql');
const dbCon  = require('../../connection.js');

/*
  select everything for a given username
*/
var selectLeaguesPlayIn  = async function(userID, callback) {
  var res;
    var sql = `SELECT leagueName FROM playsfor, team, league WHERE userID =
      ${mysql.escape(userID)} and team.teamID = playsFor.teamID
      and league.leagueID = team.leagueID;`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
        callback(null, res);
    });

}

module.exports = selectLeaguesPlayIn;
