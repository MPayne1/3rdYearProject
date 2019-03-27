const mysql = require('mysql');
const dbCon  = require('../connection.js');

//delete a team announcement
var deleteTeamAnnouncement  = async function(AnnouncementID) {
    var sql = `DELETE FROM  teamAnnouncement
    WHERE AnnouncementID = ${mysql.escape(AnnouncementID)};`;
	  await dbCon.query(sql , (err, result) => {
		    if(err) throw err;
        console.log('team announcement deleted');
    });
}

module.exports = deleteTeamAnnouncement;
