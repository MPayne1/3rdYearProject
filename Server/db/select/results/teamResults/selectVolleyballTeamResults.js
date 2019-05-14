const mysql = require('mysql');
const dbCon  = require('../../../connection.js');

/*
  select the table tennis results
*/
var selectVolleyballResults  = async function(teamID, callback) {
  var res;
    var sql = `SELECT HomeTeamName, AwayTeamName, HomeTeamID, AwayTeamID,
    hometeam.fixtureID, homeTeam.HomePointsScoredG1, homeTeam.HomePointsScoredG2,
    homeTeam.HomePointsScoredG3, homeTeam.HomePointsScoredG4, homeTeam.HomePointsScoredG5,
    awayTeam.AwayPointsScoredG1, awayTeam.AwayPointsScoredG2, awayTeam.AwayPointsScoredG3,
    awayTeam.AwayPointsScoredG4,awayTeam.AwayPointsScoredG5, awayTeam.MatchDescription
    from (select teamName as HomeTeamName, HometeamID , fixture.fixtureID,
      HomePointsScoredG1, HomePointsScoredG2, HomePointsScoredG3, HomePointsScoredG4,
      HomePointsScoredG5, MatchDescription
      from team, fixture, VolleyballResults, season where HomeTeamID = teamID and
      season.leagueID = team.leagueID and played = 'true' and
      VolleyballResults.fixtureID = fixture.fixtureID and
      season.seasonID = fixture.seasonID and finished = 'false') as HomeTeam,
     (select teamName as AwayTeamName, AwayteamID , fixture.fixtureID,
     AwayPointsScoredG1, AwayPointsScoredG2, AwayPointsScoredG3, AwayPointsScoredG4,
      AwayPointsScoredG5, MatchDescription
       from team, fixture, VolleyballResults, season where AwayTeamID = teamID and
       season.leagueID = team.leagueID and played = 'true' and
        VolleyballResults.fixtureID = fixture.fixtureID and
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

module.exports = selectVolleyballResults;
