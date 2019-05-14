const mysql = require('mysql');
const dbCon  = require('../../../connection.js');

/*
  select the basketball results
*/
var selectBasketballResults  = async function(teamID, callback) {
  var res;
    var sql = `SELECT HomeTeamName, AwayTeamName, HomeTeamID, AwayTeamID,
    hometeam.fixtureID, homeTeam.HomePointsScoredQ1, homeTeam.HomePointsScoredHT,
    homeTeam.HomePointsScoredQ3, homeTeam.HomePointsScoredFT, awayTeam.AwayPointsScoredQ1,
    awayTeam.AwayPointsScoredHT, awayTeam.AwayPointsScoredQ3,
    awayTeam.AwayPointsScoredFT, awayTeam.MatchDescription
    from (select teamName as HomeTeamName, HometeamID , fixture.fixtureID,
      HomePointsScoredQ1, HomePointsScoredHT, HomePointsScoredQ3, HomePointsScoredFT,
      MatchDescription
      from team, fixture, BasketballResults, season where HomeTeamID = teamID and
      season.leagueID = team.leagueID and played = 'true' and
      BasketballResults.fixtureID = fixture.fixtureID and
      season.seasonID = fixture.seasonID and finished = 'false') as HomeTeam,
     (select teamName as AwayTeamName, AwayteamID , fixture.fixtureID,
     AwayPointsScoredQ1, AwayPointsScoredHT, AwayPointsScoredQ3, AwayPointsScoredFT,
      MatchDescription
       from team, fixture, BasketballResults, season where AwayTeamID = teamID and
       season.leagueID = team.leagueID and played = 'true' and
        BasketballResults.fixtureID = fixture.fixtureID and
        season.seasonID = fixture.seasonID and finished = 'false') as awayTeam
     where homeTeam.fixtureID = awayTeam.fixtureID and
     HomeTeamID = ${mysql.escape(teamID)} or AwayTeamID = ${mysql.escape(teamID)}
      GROUP BY homeTeam.fixtureID;`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
        callback(null, res);
    });
}

module.exports = selectBasketballResults;
