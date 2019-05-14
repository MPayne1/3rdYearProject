const mysql = require('mysql');
const dbCon  = require('../../connection.js');

/*
  select the volleyball results
*/
var selectVolleyballResults  = async function(leagueID, callback) {
  var res;
    var sql = `SELECT HomeTeamName, AwayTeamName, HomeTeamID, AwayTeamID,
    hometeam.fixtureID, homeTeam.HomePointsScoredG1, homeTeam.HomePointsScoredG2,
    homeTeam.HomePointsScoredG3, homeTeam.HomePointsScoredG4, homeTeam.HomePointsScoredG5,
    awayTeam.AwayPointsScoredG1, awayTeam.AwayPointsScoredG2, awayTeam.AwayPointsScoredG3,
    awayTeam.AwayPointsScoredG4,awayTeam.AwayPointsScoredG5, awayTeam.MatchDescription
    from (select teamName as HomeTeamName, HometeamID , fixture.fixtureID,
      HomePointsScoredG1, HomePointsScoredG2, HomePointsScoredG3, HomePointsScoredG4,
      HomePointsScoredG5, MatchDescription
      from team, fixture, volleyballResults, season where HometeamID = TeamID and
      season.leagueID = team.leagueID and
      team.leagueID = ${mysql.escape(leagueID)} and played = 'true' and
      volleyballResults.fixtureID = fixture.fixtureID and
      season.seasonID = fixture.seasonID and finished = 'false') as HomeTeam,
     (select teamName as AwayTeamName, AwayteamID , fixture.fixtureID,
     AwayPointsScoredG1, AwayPointsScoredG2, AwayPointsScoredG3, AwayPointsScoredG4,
      AwayPointsScoredG5, MatchDescription
       from team, fixture, volleyballResults, season where AwayTeamID = teamID and
       season.leagueID = team.leagueID and
       team.leagueID = ${mysql.escape(leagueID)} and played = 'true' and
        volleyballResults.fixtureID = fixture.fixtureID and
        season.seasonID = fixture.seasonID and finished = 'false') as awayTeam
     where homeTeam.fixtureID = awayTeam.fixtureID;`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
        callback(null, res);
    });
}

module.exports = selectVolleyballResults;

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
