const mysql = require('mysql');
const dbCon  = require('../../connection.js');

/*
  select the basketball results
*/
var selectBasketballResults  = async function(leagueID, callback) {
  var res;
    var sql = `SELECT HomeTeamName, AwayTeamName, HomeTeamID, AwayTeamID,
    hometeam.fixtureID, homeTeam.HomePointsScoredQ1, homeTeam.HomePointsScoredHT,
    homeTeam.HomePointsScoredQ3, homeTeam.HomePointsScoredFT, awayTeam.AwayPointsScoredQ1,
    awayTeam.AwayPointsScoredHT, awayTeam.AwayPointsScoredQ3, awayTeam.AwayPointsScoredFT, awayTeam.MatchDescription
    from (select teamName as HomeTeamName, HometeamID , fixture.fixtureID,
      HomePointsScoredQ1, HomePointsScoredHT, HomePointsScoredQ3, HomePointsScoredFT, MatchDescription
      from team, fixture, basketballResults, season where HometeamID = TeamID and
      season.leagueID = team.leagueID and
      team.leagueID = ${mysql.escape(leagueID)} and played = 'true' and
      basketballResults.fixtureID = fixture.fixtureID and
      season.seasonID = fixture.seasonID and finished = 'false') as HomeTeam,
     (select teamName as AwayTeamName, AwayteamID , fixture.fixtureID, AwayPointsScoredQ1,
     AwayPointsScoredHT, AwayPointsScoredQ3, AwayPointsScoredFT, MatchDescription
       from team, fixture, basketballResults, season where AwayTeamID = teamID and
       season.leagueID = team.leagueID and
       team.leagueID = ${mysql.escape(leagueID)} and played = 'true' and
        basketballResults.fixtureID = fixture.fixtureID and
        season.seasonID = fixture.seasonID and finished = 'false') as awayTeam
     where homeTeam.fixtureID = awayTeam.fixtureID;`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
        callback(null, res);
    });
}

module.exports = selectBasketballResults;

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
