const mysql = require('mysql');
const dbCon  = require('../../connection.js');

/*
  select the cricket results
*/
var selectCricketResults  = async function(leagueID, callback) {
  var res;
    var sql = `SELECT HomeTeamName, AwayTeamName, HomeTeamID, AwayTeamID,
    hometeam.fixtureID, homeTeam.HomeRunsI1, homeTeam.HomeRunsI2,
    homeTeam.HomeWicketsLostI1, homeTeam.HomeWicketsLostI2,
    awayTeam.AwayRunsI1, awayTeam.AwayRunsI2, awayTeam.AwayWicketsLostI1,
    awayTeam.AwayWicketsLostI2, awayTeam.MatchDescription
    from (select teamName as HomeTeamName, HometeamID , fixture.fixtureID,
      HomeRunsI1, HomeRunsI2, HomeWicketsLostI1, HomeWicketsLostI2, MatchDescription
      from team, fixture, cricketResults, season where HometeamID = TeamID and
      season.leagueID = team.leagueID and
      team.leagueID = ${mysql.escape(leagueID)} and played = 'true' and
      cricketResults.fixtureID = fixture.fixtureID and
      season.seasonID = fixture.seasonID and finished = 'false') as HomeTeam,
     (select teamName as AwayTeamName, AwayteamID , fixture.fixtureID,
     AwayRunsI1, AwayRunsI2, AwayWicketsLostI1, AwayWicketsLostI2, MatchDescription
       from team, fixture, cricketResults, season where AwayTeamID = teamID and
       season.leagueID = team.leagueID and
       team.leagueID = ${mysql.escape(leagueID)} and played = 'true' and
        cricketResults.fixtureID = fixture.fixtureID and
        season.seasonID = fixture.seasonID and finished = 'false') as awayTeam
     where homeTeam.fixtureID = awayTeam.fixtureID;`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
        callback(null, res);
    });
}

module.exports = selectCricketResults;

/*
SELECT HomeTeamName, AwayTeamName, HomeTeamID, AwayTeamID,
hometeam.fixtureID, homeTeam.HomeGoalsScoredHT, homeTeam.HomeGoalsScoredFT,
awayTeam.AwayGoalsScoredHT, awayTeam.AwayGoalsScoredFT, awayTeam.MatchDescription
from (select teamName as HomeTeamName, HometeamID , fixture.fixtureID,
  HomeGoalsScoredHT, HomeGoalsScoredFT, MatchDescription
  from team, fixture, footballResults, season where HometeamID = TeamID and
  fixture.leagueID = team.leagueID and
  team.leagueID = 17 and played = 'true' and footballResults.fixtureID = fixture.fixtureID and season.seasonID = fixture.seasonID and finished = 'false') as HomeTeam,
 (select teamName as AwayTeamName, AwayteamID , fixture.fixtureID,
 AwayGoalsScoredHT, AwayGoalsScoredFT, MatchDescription
   from team, fixture, footballResults, season where AwayTeamID = teamID and
   fixture.leagueID = team.leagueID and
   team.leagueID = 17 and played = 'true' and footballResults.fixtureID = fixture.fixtureID and season.seasonID = fixture.seasonID and finished = 'false') as awayTeam
 where homeTeam.fixtureID = awayTeam.fixtureID;`;
*/
