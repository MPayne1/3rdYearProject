const mysql = require('mysql');
const dbCon  = require('../connection.js');

//delete a league announcement
var deleteLeagueAnnouncement  = async function(AnnouncementID) {
    var sql = `DELETE FROM  LeagueAnnouncement
    WHERE LeagueAnnouncementID = ${mysql.escape(AnnouncementID)};`;
	  await dbCon.query(sql , (err, result) => {
		    if(err) throw err;
        console.log('league announcement deleted');
    });
}

module.exports = deleteLeagueAnnouncement;
