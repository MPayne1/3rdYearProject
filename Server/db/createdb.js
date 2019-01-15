//Creates the mysql db

const db  = require('./connection.js');
const mysql = require('mysql');

const dotenv = require('dotenv').config();
if (dotenv.error) {
  console.log(dotenv.error)
}
console.log(dotenv.parsed)

// create users table
async function createUsersTable(err) {
	if(err) throw err;
	var sql = "CREATE TABLE users(UserID int NOT NULL AUTO_INCREMENT, " +
	"username VARCHAR(20), password VARCHAR(255), LastName VARCHAR(255),"+
	" FirstName VARCHAR(255), Email VARCHAR(50), PRIMARY KEY (UserID))";
	await db.query(sql, function(err, result) {
		if(err) throw err;
		console.log("Users Table created");
	});
};

// create League table
async function createLeagueTable(err) {
	if(err) throw err;
	var sql = "CREATE TABLE League(LeagueID int NOT NULL AUTO_INCREMENT,"+
	"LeagueName VARCHAR(20), LeagueAdmin int, Sport VARCHAR(30), maxTeams int, " +
  "pointsForLoss int , pointsForDraw int, pointsForWin int, PRIMARY KEY (LeagueID), "+
	"FOREIGN KEY (LeagueAdmin) REFERENCES Users(UserID));";
	await db.query(sql, function(err, result) {
		if(err) throw err;
		console.log("League Table created");
	});
};

// create teams table
async function createTeamTable(err) {
	if(err) throw err;
	var sql = "CREATE TABLE Team(TeamID int NOT NULL AUTO_INCREMENT,"+
	"TeamName VARCHAR(20), TeamAdmin int,LeagueID int, Sport VARCHAR(30) ,PRIMARY KEY (TeamID), "+
	"FOREIGN KEY (LeagueID) REFERENCES League(LeagueID), "+
	"FOREIGN KEY (TeamAdmin) REFERENCES Users(UserID))";
	await db.query(sql, function(err, result) {
		if(err) throw err;
		console.log("Team Table created");
	});
};

// create Plays for Table
async function createPlaysForTable(err) {
	if(err) throw err;
	var sql = "CREATE TABLE PlaysFor(TeamID int, UserID int, " +
	"PRIMARY KEY (TeamID, UserID), " +
	"FOREIGN KEY (UserID) REFERENCES Users(UserID), " +
	"FOREIGN KEY (TeamID) REFERENCES Team(TeamID));";
	await db.query(sql, function(err, result) {
		if(err) throw err;
		console.log("PlaysFor Table Created");
	});
}

async function createFixturesTable(err) {
  if(err) throw err;
  var sql = "CREATE TABLE FIXTURE(FixtureID int NOT NULL AUTO_INCREMENT" +
    " ,LeagueID int, HomeTeamID int, AwayTeamID int, Date DATETIME" +
    ", latitude DECIMAL(10,8) , Longitude(11, 8)" +
    ", PRIMARY KEY(FixtureID), FOREIGN KEY (LeagueID) REFERENCES League(LeagueID)" +
    ", FOREIGN KEY (HomeTeamID) REFERENCES Team(TeamID)" +
    ", FOREIGN KEY (AwayTeamID) REFERENCES Team(TeamID));";
    await db.query(sql, function(err, result) {
      if(err) throw err;
      console.log("Fixtures Table Created");
    });
}

// createUsersTable();
// createLeagueTable();
// createTeamTable();
// createPlaysForTable();
createFixturesTable()
