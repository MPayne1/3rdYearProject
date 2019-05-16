const mysql = require('mysql');
const dbCon  = require('../connection.js');

// fixture played
var updateFixture  = async function(fixtureID, played) {
    var sql = `UPDATE fixture SET played = ${mysql.escape(played)}
    WHERE fixtureID = ${mysql.escape(fixtureID)};`;
	  await dbCon.query(sql , (err, result) => {
		    if(err) callback(err);
        console.log('fixture updated');
    });
}

module.exports = updateFixture;
