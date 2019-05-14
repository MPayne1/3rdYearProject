const mysql = require('mysql');
const dbCon  = require('../../connection.js');

/*
  select the tennis results
*/
var selectTennisResults  = async function(leagueID, callback) {
  var res;
    var sql = `SELECT HomeTeamName, AwayTeamName, HomeTeamID, AwayTeamID,
    hometeam.fixtureID, homeTeam.HomePointsScoredS1, homeTeam.HomePointsScoredS2,
    homeTeam.HomePointsScoredS3, homeTeam.HomePointsScoredS4, homeTeam.HomePointsScoredS5,
    awayTeam.AwayPointsScoredS1, awayTeam.AwayPointsScoredS2, awayTeam.AwayPointsScoredS3,
    awayTeam.AwayPointsScoredS4,awayTeam.AwayPointsScoredS5, awayTeam.MatchDescription
    from (select teamName as HomeTeamName, HometeamID , fixture.fixtureID,
      HomePointsScoredS1, HomePointsScoredS2, HomePointsScoredS3, HomePointsScoredS4,
      HomePointsScoredS5, MatchDescription
      from team, fixture, tennisResults, season where HometeamID = TeamID and
      season.leagueID = team.leagueID and
      team.leagueID = ${mysql.escape(leagueID)} and played = 'true' and
      tennisResults.fixtureID = fixture.fixtureID and
      season.seasonID = fixture.seasonID and finished = 'false') as HomeTeam,
     (select teamName as AwayTeamName, AwayteamID , fixture.fixtureID,
     AwayPointsScoredS1, AwayPointsScoredS2, AwayPointsScoredS3, AwayPointsScoredS4,
      AwayPointsScoredS5, MatchDescription
       from team, fixture, tennisResults, season where AwayTeamID = teamID and
       season.leagueID = team.leagueID and
       team.leagueID = ${mysql.escape(leagueID)} and played = 'true' and
        tennisResults.fixtureID = fixture.fixtureID and
        season.seasonID = fixture.seasonID and finished = 'false') as awayTeam
     where homeTeam.fixtureID = awayTeam.fixtureID;`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
        callback(null, res);
    });
}

module.exports = selectTennisResults;

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
