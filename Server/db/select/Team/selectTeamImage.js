const mysql = require('mysql');
const dbCon  = require('../../connection.js');

/*
  select image for a teamID
*/
var selectTeamImage  = async function(teamID, callback) {
  var res;
    var sql = `SELECT imagePath FROM team WHERE TeamID = ${mysql.escape(teamID)}`;
	  await dbCon.query(sql , (err, result, fields) => {
		    if(err) throw err;
        res = result;
        callback(null, res);
    });
}

module.exports = selectTeamImage;
