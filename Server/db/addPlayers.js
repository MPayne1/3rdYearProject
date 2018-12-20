// handles all mysql insert queries

const mysql = require('mysql');
const dbCon  = require('./connection.js');
const dbSelectUser  = require('./selectUser.js');



//insert a new user into the db
var insertPlayer  = async function(username, teamID) {
  var userID;


console.log(userID);

// add the player to team in db
  var sql = `INSERT INTO playsfor(userID, teamID)
    VALUES( (SELECT UserID FROM users WHERE username =  + ${mysql.escape(username)}),  ${mysql.escape(teamID)}); `;
  await dbCon.query(sql , async function(err, result) {
      if(err) throw err;
      console.log('player added');
  });
}

module.exports = insertPlayer;
// SELECT UserID FROM users WHERE username =  + ${mysql.escape(username)}
