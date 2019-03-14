const mysql = require('mysql');
const dbCon  = require('../../../connection.js');

/*
  select the football results
*/
var selectFootballResults  = async function(teamID, callback) {
  var res;
    var sql = `SELECT HomeTeamName, AwayTeamName, HomeTeamID, AwayTeamID,
    hometeam.fixtureID, homeTeam.HomeGoalsScoredHT, homeTeam.HomeGoalsScoredFT,
    awayTeam.AwayGoalsScoredHT, awayTeam.AwayGoalsScoredFT, awayTeam.MatchDescription
    from (select teamName as HomeTeamName, HometeamID , fixture.fixtureID,
      HomeGoalsScoredHT, HomeGoalsScoredFT, MatchDescription
      from team, fixture, footballResults, season where
      fixture.leagueID = team.leagueID and played = 'true' and
      footballResults.fixtureID = fixture.fixtureID and
      season.seasonID = fixture.seasonID and finished = 'false') as HomeTeam,
     (select teamName as AwayTeamName, AwayteamID , fixture.fixtureID,
     AwayGoalsScoredHT, AwayGoalsScoredFT, MatchDescription
       from team, fixture, footballResults, season where
       fixture.leagueID = team.leagueID and played = 'true' and
        footballResults.fixtureID = fixture.fixtureID and
        season.seasonID = fixture.seasonID and finished = 'false') as awayTeam
     where homeTeam.fixtureID = awayTeam.fixtureID and HomeTeamID = ${mysql.escape(teamID)} or AwayTeamID = ${mysql.escape(teamID)} GROUP BY homeTeam.fixtureID;`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
        callback(null, res);
    });
}

module.exports = selectFootballResults;

/*
SELECT  HomeTeamName, AwayTeamName, HomeTeamID, AwayTeamID,
hometeam.fixtureID, homeTeam.HomeGoalsScoredHT, homeTeam.HomeGoalsScoredFT,
awayTeam.AwayGoalsScoredHT, awayTeam.AwayGoalsScoredFT, awayTeam.MatchDescription
from (select  teamName as HomeTeamName, HometeamID , fixture.fixtureID,
  HomeGoalsScoredHT, HomeGoalsScoredFT, MatchDescription
  from team, fixture, footballResults, season where
  fixture.leagueID = team.leagueID and played = 'true'
  and footballResults.fixtureID = fixture.fixtureID and season.seasonID = fixture.seasonID and finished = 'false') as HomeTeam,
 (select teamName as AwayTeamName, AwayteamID , fixture.fixtureID,
 AwayGoalsScoredHT, AwayGoalsScoredFT, MatchDescription
   from team, fixture, footballResults, season where
   fixture.leagueID = team.leagueID and played = 'true'
   and footballResults.fixtureID = fixture.fixtureID and season.seasonID = fixture.seasonID and finished = 'false') as awayTeam
 where homeTeam.fixtureID = awayTeam.fixtureID and HomeTeamID = 165 or AwayTeamID = 165 group by homeTeam.fixtureID`;
*/
