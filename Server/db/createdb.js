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
  "pointsForLoss int , pointsForDraw int, pointsForWin int, city VARCHAR(30),"+
  " county VARCHAR(30), country VARCHAR(30), games int, PRIMARY KEY (LeagueID),"+
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

// create fixtures table
async function createFixturesTable(err) {
  if(err) throw err;
  var sql = "CREATE TABLE FIXTURE(FixtureID int NOT NULL AUTO_INCREMENT" +
    " ,LeagueID int, SeasonID int, HomeTeamID int, AwayTeamID int, date DATETIME" +
    ", address VARCHAR(30), city VARCHAR(30), county VARCHAR(30), postcode VARCHAR(30) " +
    ", Played ENUM('false', 'true') NOT NULL DEFAULT 'false'" +
    ", PRIMARY KEY(FixtureID), FOREIGN KEY (LeagueID) REFERENCES League(LeagueID)" +
    ", FOREIGN KEY (HomeTeamID) REFERENCES Team(TeamID)" +
    ", FOREIGN KEY (SeasonID) REFERENCES Season(SeasonID)" +
    ", FOREIGN KEY (AwayTeamID) REFERENCES Team(TeamID));";
    await db.query(sql, function(err, result) {
      if(err) throw err;
      console.log("Fixtures Table Created");
    });
}


// create season table
async function createSeasonsTable(err) {
	if(err) throw err;
	var sql = "CREATE TABLE Season(SeasonID int NOT NULL AUTO_INCREMENT," +
    "LeagueID int, Finished  ENUM('false', 'true') NOT NULL DEFAULT 'false'," +
	  "PRIMARY KEY (SeasonID), " +
	  "FOREIGN KEY (LeagueID) REFERENCES League(LeagueID));";
	await db.query(sql, function(err, result) {
		if(err) throw err;
		console.log("Seasons Table Created");
	});
}

// ------  create results tables  ------

// create Football result table
async function createFootballResultsTable(err) {
  if(err) throw err;
  var sql = "CREATE TABLE FootballResults(FixtureID int, HomeGoalsScoredHT int,"+
  " AwayGoalsScoredHT int,HomeGoalsScoredFT int, AwayGoalsScoredFT int, " +
  "PRIMARY KEY (FixtureID), FOREIGN KEY (FixtureID) REFERENCES Fixture(FixtureID));";
  await db.query(sql, function(err, result){
    if(err) throw err;
    console.log("FootballResults table created");
  });
}

// create Rugby result table
async function createRugbyResultsTable(err) {
  if(err) throw err;
  var sql = "CREATE TABLE RugbyResults(FixtureID int, HomePointsScoredHT int,"+
  " AwayPointsScoredHT int,HomePointsScoredFT int, AwayPointsScoredFT int, " +
  "PRIMARY KEY (FixtureID), FOREIGN KEY (FixtureID) REFERENCES Fixture(FixtureID));";
  await db.query(sql, function(err, result){
    if(err) throw err;
    console.log("FootballResults table created");
  });
}



// createUsersTable();
// createLeagueTable();
// createTeamTable();
// createPlaysForTable();
// createSeasonsTable();
// createFixturesTable();
