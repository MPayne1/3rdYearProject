// select all upcoming fixtures where team is the away team
const mysql = require('mysql');
const dbCon  = require('../../connection.js');

var selectUpcomingFixtures  = async function(UserID, callback) {
  var res;
    var sql = `SELECT HomeTeamName, AwayTeamName, HomeTeamID, AwayTeamID,
    awayTeam.fixtureID, awayTeam.date, awayTeam.startTime, awayTeam.endTime,
    awayTeam.address, awayTeam.city,
    awayTeam.county, awayTeam.postcode, awayTeam.Sport
    from (select teamName as HomeTeamName, HometeamID , fixtureID
      from team, fixture, playsFor, league where HometeamID = playsFor.TeamID and
      playsFor.TeamID = team.TeamID and team.leagueID = league.leagueID
      and played = 'false') as HomeTeam,
     (select teamName as AwayTeamName, AwayteamID , fixtureID,
       date,startTime, endTime, address, fixture.city,fixture.county, postcode, Sport
       from team, fixture, playsFor, league where AwayTeamID = playsFor.TeamID
      and playsFor.TeamID = team.TeamID and team.leagueID = league.leagueID
      and playsFor.UserID = ${mysql.escape(UserID)}
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
