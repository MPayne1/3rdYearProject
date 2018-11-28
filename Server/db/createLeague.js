// adds new league to db

const mysql = require('mysql');
const dbCon  = require('./connection.js');

//insert a new user into the db
var insertLeague  = async function(LeagueName, LeagueAdmin, Sport) {
    var sql = `INSERT INTO League(LeagueName, LeagueAdmin, Sport)
      VALUES(${mysql.escape(LeagueName)}, ${mysql.escape(LeagueAdmin)}, ${mysql.escape(Sport)});`;
	  await dbCon.query(sql , (err, result) => {
		    if(err) throw err;
        console.log('league added');
    });

}

module.exports = insertLeague;
