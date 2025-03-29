import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";
import env from "dotenv";
import ejs from "ejs";


const app = express();
const port = 3000;
env.config();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


const db = new pg.Client({
user: process.env.PG_USER,
host: process.env.PG_HOST,
database: process.env.PG_DATABASE,
password: process.env.PG_PASSWORD,
port: process.env.PG_PORT,
});

// db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


// Async function to test database connection
async function testDatabaseConnection() {
    try {
      // Connect to the database
      await db.connect();
  
      // Run a simple query to check the connection
      const result = await db.query("SELECT NOW()"); // Fetch current timestamp from the database
      console.log("Connected to the database!");
      console.log("Database Time: ", result.rows[0].now); // Display current time from the database
    } catch (error) {
      console.error("Error connecting to the database:", error.stack);
    }
  }
  
// Call the function to test the connection
testDatabaseConnection();
  
// https://api.mangadex.org/manga?title=reinforced%20wooden

//https://api.mangadex.org/manga/a1c7c817-4e59-43b7-9365-09675a149a6f/feed?order[chapter]=desc

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
  