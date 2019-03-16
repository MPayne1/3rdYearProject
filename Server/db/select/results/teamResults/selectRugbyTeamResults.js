const mysql = require('mysql');
const dbCon  = require('../../../connection.js');

/*
  select the rugby results
*/
var selectRugbyResults  = async function(teamID, callback) {
  var res;
    var sql = `SELECT HomeTeamName, AwayTeamName, HomeTeamID, AwayTeamID,
    hometeam.fixtureID, homeTeam.HomePointsScoredHT,
    homeTeam.HomePointsScoredFT, awayTeam.AwayPointsScoredHT,
    awayTeam.AwayPointsScoredFT, awayTeam.MatchDescription
    from (select teamName as HomeTeamName, HometeamID , fixture.fixtureID,
      HomePointsScoredHT, HomePointsScoredFT, MatchDescription
      from team, fixture, RugbyResults, season where HomeTeamID = teamID and
      fixture.leagueID = team.leagueID and played = 'true' and
      RugbyResults.fixtureID = fixture.fixtureID and
      season.seasonID = fixture.seasonID and finished = 'false') as HomeTeam,
     (select teamName as AwayTeamName, AwayteamID , fixture.fixtureID,
      AwayPointsScoredHT, AwayPointsScoredFT, MatchDescription
       from team, fixture, RugbyResults, season where AwayTeamID = teamID and
       fixture.leagueID = team.leagueID and played = 'true' and
        RugbyResults.fixtureID = fixture.fixtureID and
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

module.exports = selectRugbyResults;
