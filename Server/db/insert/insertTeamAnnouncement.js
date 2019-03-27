const mysql = require('mysql');
const dbCon  = require('../connection.js');

//insert a new announcement
var insertTeamAnnouncement  = async function(TeamID, message) {
    var sql = `INSERT INTO teamAnnouncement(TeamID, message)
      VALUES(${mysql.escape(TeamID)}, ${mysql.escape(message)});`;
	  await dbCon.query(sql , (err, result) => {
		    if(err) throw err;
        console.log('team announcement added');
    });
}

module.exports = insertTeamAnnouncement;
