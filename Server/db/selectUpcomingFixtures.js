// select all upcoming fixtures
const mysql = require('mysql');
const dbCon  = require('./connection.js');

var selectUpcomingFixtures  = async function(leagueID, callback) {
  var res;
    var sql = `SELECT DISTINCT fixtureID, HomeTeamID, AwayTeamID, HomeTeamName, AwayTeamName, Date, latitude, Longitude
    FROM fixture, Season,
    (SELECT teamName as HomeTeamName FROM team, fixture WHERE HomeTeamID = teamID)as HomeTeam,
    (SELECT teamName as AwayTeamName FROM team, fixture WHERE AwayTeamID = teamID)as AwayTeam
    WHERE fixture.LeagueID = ${mysql.escape(leagueID)}  AND Season.SeasonID = fixture.SeasonID AND Finished = 'false' AND Played = 'false';`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
        callback(null, res);
    });
}

module.exports = selectUpcomingFixtures;

/*
select Distinct fixtureID, HomeTeamID, AwayTeamID, HomeTeamName, AwayTeamName
FROM fixture, Season,
(select teamName as HomeTeamName From Team,fixture WHERE HomeTeamID = teamID)as HomeTeam,
(select teamName as AwayTeamName From team,fixture WHERE AwayTeamID = teamID)as AwayTeam
WHERE fixture.LeagueID=17 AND Season.SeasonID = fixture.SeasonID AND Finished = 'false' AND Played = 'false';
*/
