// Creates connection to mysql db

const mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "sportsbook"
});

con.connect((err) => {
  if(err) throw err;
    console.log("db connected");
  });

module.exports = con;
