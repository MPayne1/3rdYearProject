const mysql = require('mysql');
const dbCon  = require('../connection.js');

//insert a new user into the db
var updateFixture  = async function(fixtureID, played) {
    var sql = `UPDATE fixture SET played = ${mysql.escape(played)}
    WHERE fixtureID = ${mysql.escape(fixtureID)};`;
	  await dbCon.query(sql , (err, result) => {
		    if(err) callback(err);
        console.log('fixture updated');
    });
}

module.exports = updateFixture;
