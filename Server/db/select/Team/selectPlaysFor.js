const mysql = require('mysql');
const dbCon  = require('../../connection.js');

/*
  select everything for a given username
*/
var selectPlaysFor  = async function(userID, callback) {
  var res;
    var sql = `SELECT teamName FROM playsfor, team WHERE userID =
      ${mysql.escape(userID)} and team.teamID = playsFor.teamID `;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
        callback(null, res);
    });

}

module.exports = selectPlaysFor;
