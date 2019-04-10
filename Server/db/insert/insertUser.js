const mysql = require('mysql');
const dbCon  = require('../connection.js');

//insert a new user into the db
var insertUser  = async function(username, password, LastName, FirstName, Email, phoneNumber, bio, publiclyShow, imagePath) {
  var res;
    var sql = `INSERT INTO users(username, password, LastName, FirstName, Email, phoneNumber, bio, publiclyShow, imagePath)
      VALUES(${mysql.escape(username)}, ${mysql.escape(password)}, ${mysql.escape(LastName)},
      ${mysql.escape(FirstName)}, ${mysql.escape(Email)},
      ${mysql.escape(phoneNumber)}, ${mysql.escape(bio)},
      ${mysql.escape(publiclyShow)}, ${mysql.escape(imagePath)}); `;
	  await dbCon.query(sql , (err, result) => {
		    if(err) throw err;
        console.log('user added');
    });
}

module.exports = insertUser;
