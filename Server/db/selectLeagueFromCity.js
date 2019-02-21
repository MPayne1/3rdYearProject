const mysql = require('mysql');
const dbCon  = require('./connection.js');

/*
  select all leagues for a city
*/
var selectLeagues  = async function(city, county, country, sport, callback) {
  var res;
    var sql = `SELECT LeagueName, Sport, League.leagueID, maxTeams FROM League, (select count(teamId) as noTeams, leagueId  from team group by leagueID) as teamNo
      WHERE city = ${mysql.escape(city)} and county = ${mysql.escape(county)}  and country = ${mysql.escape(country)} and Sport = ${mysql.escape(sport)} and teamNo.noTeams < League.MaxTeams and teamNo.LeagueID = League.LeagueID;
 ;`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
        callback(null, result);
    });
}

module.exports = selectLeagues;

/*

Select leagueName, foundLeagues.sport from
(SELECT LeagueName, Sport, leagueID, maxTeams FROM League WHERE city = "Swansea" and county = "county"  and country = "country" and Sport = "sport") as foundLeagues,
team where team.LeagueId = foundLeagues.LeagueID and count(teamName)> foundLeagues.maxTeams;

no. of teams in a league: select count(teamId) as noTeams from team where LeagueID = 15;
no of teams in each league: select count(teamId) as noTeams, leagueId  from team group by leagueID;
only return leagues with room:  SELECT LeagueName, Sport, League.leagueID, maxTeams FROM League, (select count(teamId) as noTeams, leagueId  from team group by leagueID) as teamNo
  WHERE city = "Swansea" and county = "Swansea"  and country = "Wales" and Sport = "Tennis" and teamNo.noTeams < League.MaxTeams and teamNo.LeagueID = League.LeagueID;
*/
