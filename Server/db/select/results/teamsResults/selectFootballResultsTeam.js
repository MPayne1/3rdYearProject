const mysql = require('mysql');
const dbCon  = require('../../connection.js');

/*
  select the football results
*/
var selectFootballResultsTeam  = async function(teamID, callback) {
  var res;
    var sql = `

    `;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
        callback(null, res);
    });
}

module.exports = selectFootballResultsTeam;
// teamID = 165;
