//Creates the mysql db

const db  = require('./connection.js');
const mysql = require('mysql');

// create users table
async function createUsersTable(err) {
	if(err) throw err;
	var sql = "CREATE TABLE users(UserID int NOT NULL AUTO_INCREMENT, " +
	"username VARCHAR(20), password VARCHAR(255), LastName VARCHAR(255),"+
	" FirstName VARCHAR(255), Email VARCHAR(50), PRIMARY KEY (UserID))";
	await db.query(sql, function(err, result) {
		if(err) throw err;
		console.log("Table created");
	});
};

// create League table
async function createLeagueTable(err) {
	if(err) throw err;
	var sql = "CREATE TABLE League(LeagueID int NOT NULL AUTO_INCREMENT,"+
	"LeagueName VARCHAR(20), LeagueAdmin int, PRIMARY KEY (LeagueID), "+
	"FOREIGN KEY (LeagueAdmin) REFERENCES Users(UserID))";
	await db.query(sql, function(err, result) {
		if(err) throw err;
		console.log("Table created");
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
		console.log("Table created");
	});
};

createUsersTable();
createLeagueTable();
createTeamTable();

console.log('Tables createed');
