const mysql = require('mysql');
const dbCon  = require('./connection.js');

//insert a new user into the db
var updateFixture  = async function(fixtureID, date, address, city, county, postcode) {
    var sql = `UPDATE fixture SET date = ${mysql.escape(date)},
    address = ${mysql.escape(address)}, city = ${mysql.escape(city)},
    county = ${mysql.escape(county)}, postcode = ${mysql.escape(postcode)}
    WHERE fixtureID = ${mysql.escape(fixtureID)};`;
	  await dbCon.query(sql , (err, result) => {
		    if(err) throw err;
        console.log('fixture updated');
    });
}

module.exports = updateFixture;
