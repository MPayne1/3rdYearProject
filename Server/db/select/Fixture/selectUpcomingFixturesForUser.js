// select all upcoming fixtures
const mysql = require('mysql');
const dbCon  = require('../../connection.js');

var selectUpcomingFixtures  = async function(UserID, callback) {
  var res;
    var sql = `SELECT HomeTeamName, AwayTeamName, HomeTeamID, AwayTeamID,
    hometeam.fixtureID, hometeam.date,hometeam.address, hometeam.city,
    hometeam.county, hometeam.postcode, hometeam.Sport
    from (select teamName as HomeTeamName, HometeamID , fixtureID,
      date, address, city, county, postcode, Sport
      from team, fixture, playsFor where HometeamID = playsFor.TeamID and
      playsFor.TeamID = team.TeamID and
      playsFor.UserID = ${mysql.escape(UserID)} and played = 'false') as HomeTeam,
     (select teamName as AwayTeamName, AwayteamID , fixtureID
       from team, fixture, playsFor where AwayTeamID = playsFor.TeamID
      and playsFor.TeamID = team.TeamID
      and played = 'false') as awayTeam
     where homeTeam.fixtureID = awayTeam.fixtureID;`;


	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
        callback(null, res);
    });
}

module.exports = selectUpcomingFixtures;

/*

var sql = `SELECT DISTINCT fixtureID, HomeTeamID, AwayTeamID, HomeTeamName,
 AwayTeamName, date, address, city, county, postcode, Sport
 FROM fixture, Season,
(SELECT teamName as HomeTeamName, Sport FROM team, fixture WHERE HomeTeamID = teamID
  and team.leagueID = fixture.leagueID and team.leagueID = ${mysql.escape(leagueID)})as HomeTeam,
(SELECT teamName as AwayTeamName FROM team, fixture WHERE AwayTeamID = teamID
  and team.leagueID = fixture.leagueID and team.leagueID = ${mysql.escape(leagueID)})as AwayTeam
WHERE fixture.LeagueID = ${mysql.escape(leagueID)}
AND Season.SeasonID = fixture.SeasonID
AND Finished = 'false' AND Played = 'false';`;

*/
