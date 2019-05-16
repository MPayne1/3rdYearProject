const mysql = require('mysql');
const dbCon  = require('../connection.js');

// insert a new player into team db
var insertPlayer  = async function(userID, teamname, callback) {
  var userID;

// add the player to team in db
  var sql = `INSERT INTO playsfor(userID, teamID)
    VALUES(${mysql.escape(userID)}, (SELECT teamID FROM team WHERE teamname =  + ${mysql.escape(teamname)})); `;
  await dbCon.query(sql , async function(err, result) {
      if(err) callback(err, null);
      console.log('player added');
      callback(null, result);
  });
}

module.exports = insertPlayer;
