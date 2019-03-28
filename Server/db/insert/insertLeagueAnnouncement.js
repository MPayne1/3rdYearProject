const mysql = require('mysql');
const dbCon  = require('../connection.js');

//insert a new announcement
var insertLeagueAnnouncement  = async function(LeagueID, message) {
    var sql = `INSERT INTO leagueAnnouncement(LeagueID, message)
      VALUES(${mysql.escape(LeagueID)}, ${mysql.escape(message)});`;
	  await dbCon.query(sql , (err, result) => {
		    if(err) throw err;
        console.log('league announcement added');
    });
}

module.exports = insertLeagueAnnouncement;
