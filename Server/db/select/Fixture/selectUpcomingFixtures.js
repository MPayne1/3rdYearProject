// select all upcoming fixtures in league
const mysql = require('mysql');
const dbCon  = require('../../connection.js');

var selectUpcomingFixtures  = async function(leagueID, callback) {
  var res;
    var sql = `SELECT HomeTeamName, AwayTeamName, HomeTeamID, AwayTeamID,
    hometeam.fixtureID, hometeam.date,hometeam.startTime, hometeam.endTime,
    hometeam.address, hometeam.city,
    hometeam.county, hometeam.postcode, hometeam.Sport
    from (select teamName as HomeTeamName, HometeamID , fixtureID,
      date, startTime, endTime, address, fixture.city, fixture.county, postcode, Sport
      from team, fixture, league, season where HometeamID = TeamID and team.leagueID = league.leagueID
      and season.leagueID = team.leagueID and fixture.seasonID = season.seasonID and
      team.leagueID = ${mysql.escape(leagueID)} and played = 'false') as HomeTeam,
     (select teamName as AwayTeamName, AwayteamID , fixtureID
       from team, fixture, league, season where AwayTeamID = teamID and
       fixture.seasonID = season.seasonID and season.leagueID = league.leagueID
       and team.leagueID = league.leagueID and
       team.leagueID = ${mysql.escape(leagueID)}
      and fixture.seasonID = season.seasonID  and played = 'false') as awayTeam
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


`SELECT HomeTeamName, AwayTeamName, HomeTeamID, AwayTeamID,
hometeam.fixtureID, hometeam.date,hometeam.startTime, hometeam.endTime,
hometeam.address, hometeam.city,
hometeam.county, hometeam.postcode, hometeam.Sport
from (select teamName as HomeTeamName, HometeamID , fixtureID,
  date, startTime, endTime, address, fixture.city, fixture.county, postcode, Sport
  from team, fixture, league, season where HometeamID = TeamID and team.leagueID = league.leagueID
  and season.leagueID = team.leagueID and fixture.seasonID = season.seasonID and
  team.leagueID =  "38" and played = 'false') as HomeTeam,
 (select teamName as AwayTeamName, AwayteamID , fixtureID
   from team, fixture, league, season where AwayTeamID = teamID and
   fixture.seasonID = season.seasonID and season.leagueID = league.leagueID
   and team.leagueID = league.leagueID and
   team.leagueID = "38"
  and fixture.seasonID = season.seasonID  and played = 'false') as awayTeam
 where homeTeam.fixtureID = awayTeam.fixtureID;

*/
