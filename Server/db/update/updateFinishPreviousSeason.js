const mysql = require('mysql');
const dbCon  = require('../connection.js');

// update season to be finished
var updateSeasonFinished  = async function(leagueID, finished) {
    var sql = `UPDATE season SET finished = ${mysql.escape(finished)}
    WHERE leagueID = ${mysql.escape(leagueID)};`;
	  await dbCon.query(sql , (err, result) => {
		    if(err) next(err);
        console.log('season updated');
    });
}

module.exports = updateSeasonFinished;
