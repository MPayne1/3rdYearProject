// Creates connection to mysql db

const mysql = require('mysql');
const dotenv = require('dotenv').config();
if (dotenv.error) {
  console.log(dotenv.error)
}


var con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DB
});

con.connect((err) => {
  if(err) throw err;
    console.log("db connected");
  });

module.exports = con;
