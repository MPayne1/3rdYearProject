const mysql = require('mysql');
const dbCon  = require('../../connection.js');

/*
  select all announcements for a given teamID
*/
var selectTeamAnnouncements = async function(TeamID, callback) {
  var res;
    var sql = `SELECT * FROM teamAnnouncement WHERE TeamID =  + ${mysql.escape(TeamID)}`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
          callback(null, res);
    });

}

module.exports = selectTeamAnnouncements;
