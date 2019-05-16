const mysql = require('mysql');
const dbCon  = require('../connection.js');

// update fixture details
var updateFixture  = async function(fixtureID, date, startTime, endTime, address, city, county, postcode) {
    var sql = `UPDATE fixture SET date = ${mysql.escape(date)},
    address = ${mysql.escape(address)}, city = ${mysql.escape(city)},
    county = ${mysql.escape(county)}, postcode = ${mysql.escape(postcode)}
    ,startTime = ${mysql.escape(startTime)}, endTime = ${mysql.escape(endTime)}
    WHERE fixtureID = ${mysql.escape(fixtureID)};`;
	  await dbCon.query(sql , (err, result) => {
		    if(err) throw err;
        console.log('fixture updated');
    });
}

module.exports = updateFixture;
