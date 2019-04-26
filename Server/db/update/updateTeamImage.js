const mysql = require('mysql');
const dbCon  = require('../connection.js');

// update teams image
var updateTeamImage  = async function(teamID, path) {
    var sql = `UPDATE team SET imagePath = ${mysql.escape(path)}
    WHERE teamID = ${mysql.escape(teamID)};`;
	  await dbCon.query(sql , (err, result) => {
		    if(err) next(err);
        console.log('team image updated');
    });
}

module.exports = updateTeamImage;
