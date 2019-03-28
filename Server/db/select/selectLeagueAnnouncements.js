const mysql = require('mysql');
const dbCon  = require('../connection.js');

/*
  select all announcements for a given leagueID
*/
var selectLeagueAnnouncements = async function(LeagueID, callback) {
  var res;
    var sql = `SELECT * FROM leagueAnnouncement WHERE LeagueID =  + ${mysql.escape(LeagueID)}`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
          callback(null, res);
    });

}

module.exports = selectLeagueAnnouncements;
