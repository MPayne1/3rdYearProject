// Get all leagues based on City


const mysql = require('mysql');
const dbCon  = require('./connection.js');

/*
  select all leagues for a city
*/
var selectLeagues  = async function(city, county, country, sport, callback) {
  var res;
    var sql = `SELECT LeagueName, Sport FROM League WHERE city = ${mysql.escape(city)} and county = ${mysql.escape(county)}  and country =  ${mysql.escape(country)} and Sport =  ${mysql.escape(sport)} ;`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
        callback(null, result);
    });

}

module.exports = selectLeagues;

/*

(SELECT LeagueName, Sport FROM League WHERE city = "Swansea" and county = "county"  and country = "country" and Sport = "sport") ;

Select leagueName, foundLeagues.sport from
(SELECT LeagueName, Sport, leagueID, maxTeams FROM League WHERE city = "Swansea" and county = "county"  and country = "country" and Sport = "sport") as foundLeagues,
team where team.LeagueId = foundLeagues.LeagueID and count(teamName)> foundLeagues.maxTeams;

*/
