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
  " AwayGoalsScoredHT int,HomeGoalsScoredFT int, AwayGoalsScoredFT int, "+
  "MatchDescription VARCHAR(300), PRIMARY KEY (FixtureID),"+
  " FOREIGN KEY (FixtureID) REFERENCES Fixture(FixtureID));";
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
  "MatchDescription VARCHAR(300), PRIMARY KEY (FixtureID), "+
  "FOREIGN KEY (FixtureID) REFERENCES Fixture(FixtureID));";
  await db.query(sql, function(err, result){
    if(err) throw err;
    console.log("RugbyResults table created");
  });
}

// create Rugby result table
async function createAmericanFootballResultsTable(err) {
  if(err) throw err;
  var sql = "CREATE TABLE AmericanFootballResults(FixtureID int, HomePointsScoredQ1 int,"+
  " AwayPointsScoredQ1 int, HomePointsScoredHT int, AwayPointsScoredHT int,"+
  " HomePointsScoredQ3 int, AwayPointsScoredQ3 int, HomePointsScoredFT int, "+
  "AwayPointsScoredFT int, MatchDescription VARCHAR(300), PRIMARY KEY (FixtureID), "+
  "FOREIGN KEY (FixtureID) REFERENCES Fixture(FixtureID));";
  await db.query(sql, function(err, result){
    if(err) throw err;
    console.log("AmericanFootballResults table created");
  });
}

// create basketball results table
async function createBasketballResultsTable(err) {
  if(err) throw err;
  var sql = "CREATE TABLE BasketballResults(FixtureID int, HomePointsScoredQ1 int,"+
  " AwayPointsScoredQ1 int, HomePointsScoredHT int, AwayPointsScoredHT int,"+
  " HomePointsScoredQ3 int, AwayPointsScoredQ3 int, HomePointsScoredFT int, "+
  "AwayPointsScoredFT int, MatchDescription VARCHAR(300), PRIMARY KEY (FixtureID), "+
  "FOREIGN KEY (FixtureID) REFERENCES Fixture(FixtureID));";
  await db.query(sql, function(err, result){
    if(err) throw err;
    console.log("BasketballResults table created");
  });
}

// create tennis results table
async function createTennisResultsTable(err) {
  if(err) throw err;
  var sql = "CREATE TABLE TennisResults(FixtureID int, HomePointsScoredS1 int,"+
  " AwayPointsScoredS1 int, HomePointsScoredS2 int, AwayPointsScoredS2 int,"+
  " HomePointsScoredS3 int, AwayPointsScoredS3 int, HomePointsScoredS4 int, "+
  "AwayPointsScoredS4 int, HomePointsScoredS5 int, AwayPointsScoredS5 int, " +
  "MatchDescription VARCHAR(300), PRIMARY KEY (FixtureID),"+
  " FOREIGN KEY (FixtureID) REFERENCES Fixture(FixtureID));";
  await db.query(sql, function(err, result){
    if(err) throw err;
    console.log("TennisResults table created");
  });
}


// create cricket results table
async function createCricketResultsTable(err) {
  if(err) throw err;
  var sql = "CREATE TABLE CricketResults(FixtureID int, HomeRunsI1 int,"+
  " AwayRunsI1 int, HomeWicketsLostI1 int, AwayWicketsLostI1 int,"+
  " HomeRunsI2 int, AwayRunsI2 int, HomeWicketsLostI2 int, "+
  "AwayWicketsLostI2 int, MatchDescription VARCHAR(300), PRIMARY KEY (FixtureID),"+
  " FOREIGN KEY (FixtureID) REFERENCES Fixture(FixtureID));";
  await db.query(sql, function(err, result){
    if(err) throw err;
    console.log("CricketResults table created");
  });
}

// create volleyball results table
async function createVolleyballResultsTable(err) {
  if(err) throw err;
  var sql = "CREATE TABLE VolleyballResults(FixtureID int, HomePointsScoredG1 int,"+
  " AwayPointsScoredG1 int, HomePointsScoredG2 int, AwayPointsScoredG2 int,"+
  " HomePointsScoredG3 int, AwayPointsScoredG3 int, HomePointsScoredG4 int, "+
  "AwayPointsScoredG4 int, HomePointsScoredG5 int, AwayPointsScoredG5 int, " +
  "MatchDescription VARCHAR(300), PRIMARY KEY (FixtureID),"+
  " FOREIGN KEY (FixtureID) REFERENCES Fixture(FixtureID));";
  await db.query(sql, function(err, result){
    if(err) throw err;
    console.log("TennisResults table created");
  });
}

// create hockey result table
async function createHockeyResultsTable(err) {
  if(err) throw err;
  var sql = "CREATE TABLE HockeyyResults(FixtureID int, HomePointsScoredHT int,"+
  " AwayPointsScoredHT int,HomePointsScoredFT int, AwayPointsScoredFT int, " +
  "MatchDescription VARCHAR(300), PRIMARY KEY (FixtureID), "+
  "FOREIGN KEY (FixtureID) REFERENCES Fixture(FixtureID));";
  await db.query(sql, function(err, result){
    if(err) throw err;
    console.log("HockeyResults table created");
  });
}



// createUsersTable();
// createLeagueTable();
// createTeamTable();
// createPlaysForTable();
// createSeasonsTable();
// createFixturesTable();

// ------  create Results tables  ------
// createFootballResultsTable();
// createRugbyResultsTable();
// createAmericanFootballResultsTable();
// createBasketballResultsTable();
// createTennisResultsTable();
// createCricketResultsTable();
// createVolleyballResultsTable();
// createHockeyResultsTable();
