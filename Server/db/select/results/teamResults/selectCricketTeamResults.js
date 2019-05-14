const mysql = require('mysql');
const dbCon  = require('../../../connection.js');

/*
  select the table tennis results
*/
var selectCricketResults  = async function(teamID, callback) {
  var res;
    var sql = `SELECT HomeTeamName, AwayTeamName, HomeTeamID, AwayTeamID,
    hometeam.fixtureID, homeTeam.HomeRunsI1, homeTeam.HomeRunsI2,
    homeTeam.HomeWicketsLostI1, homeTeam.HomeWicketsLostI2,
    awayTeam.AwayRunsI1, awayTeam.AwayRunsI2, awayTeam.AwayWicketsLostI1,
    awayTeam.AwayWicketsLostI2, awayTeam.MatchDescription
    from (select teamName as HomeTeamName, HometeamID , fixture.fixtureID,
      HomeRunsI1, HomeRunsI2, HomeWicketsLostI1, HomeWicketsLostI2, MatchDescription
      from team, fixture, CricketResults, season where HomeTeamID = teamID and
      season.leagueID = team.leagueID and played = 'true' and
      CricketResults.fixtureID = fixture.fixtureID and
      season.seasonID = fixture.seasonID and finished = 'false') as HomeTeam,
     (select teamName as AwayTeamName, AwayteamID , fixture.fixtureID,
       AwayRunsI1, AwayRunsI2, AwayWicketsLostI1, AwayWicketsLostI2, MatchDescription
       from team, fixture, CricketResults, season where AwayTeamID = teamID and
       season.leagueID = team.leagueID and played = 'true' and
        CricketResults.fixtureID = fixture.fixtureID and
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

module.exports = selectCricketResults;
