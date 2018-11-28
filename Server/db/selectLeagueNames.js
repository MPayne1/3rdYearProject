// handles all mysql select queries

const mysql = require('mysql');
const dbCon  = require('./connection.js');

/*
  select all users with the username, to check usernames when signup
  return false if the username isn't currently in the db true otherwise
*/
var selectLeagueNames  = async function(name, callback) {
  var res;
    var sql = `SELECT LeagueName FROM League WHERE LeagueName =  + ${mysql.escape(name)}`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
        callback(null, result);
    });

}

module.exports = selectLeagueNames;
