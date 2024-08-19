const dotenv = require("dotenv");

dotenv.config({ path: "../../config.env" });

/*if (process.env.DATABASE_PASSWORD == undefined) {
  console.error(
    "DATABASE_PASSWORD environment variable is undefined, check if .env is present in the current working directory."
  );
  process.exit(2);
}*/

const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.DATABASE_PASSWORD || "SherlockHolmes",
  database: "BairwaysData",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.stack);
    return;
  }
  console.log("Connected to the database as id " + connection.threadId);
});

module.exports = connection;
