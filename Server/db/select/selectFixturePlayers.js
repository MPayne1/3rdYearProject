const mysql = require('mysql');
const dbCon  = require('../connection.js');

/*
  select everything for a given username
*/
var selectPlayers  = async function(fixtureID, callback) {
  var res;
    var sql = `SELECT users.userID, firstname, lastname, email
    FROM playsfor, users, fixtures
    WHERE playsfor.userID = users.userID and (playsfor.teamID = fixtures.HomeTeamID or playsfor.teamID = fixtures.AwayTeamID)
    and fixtures.fixtureID = ${mysql.escape(fixtureID)};`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
        callback(null, res);
    });

}

module.exports = selectPlayers;


/*
SELECT users.userID, firstname, lastname, email
FROM playsfor, users, fixtures
WHERE playsfor.userID = users.userID and (playsfor.teamID = fixtures.HomeTeamID or playsfor.teamID = fixtures.AwayTeamID)
and fixtures.fixtureID = ${mysql.escape(fixtureID)};`
*/
