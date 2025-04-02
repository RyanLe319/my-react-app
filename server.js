import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";
import cors from "cors"; // Import CORS
import ejs from "ejs";

const app = express();
const port = 3000;
env.config();

// Enable CORS for all routes
app.use(cors());

// Set up middleware
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
// Add this right after your CORS middleware
app.use(express.json());  // For parsing application/json

// PostgreSQL client setup
const db = new pg.Client({
	user: process.env.PG_USER,
	host: process.env.PG_HOST,
	database: process.env.PG_DATABASE,
	password: process.env.PG_PASSWORD,
	port: process.env.PG_PORT,
});

db.connect();

app.post("/", async (req, res) => {
	try {
    
    // Deconstructing the received json
		const { title, 
      lastChapterRead,
      lastReadDate,
      status,
      latestChapter,
      image} = req.body;

      // title is undefined = no title then return this error message
		if (!title) {
			return res.status(400).json({
				error: "Title is required",
				details: "No title was provided in the request body",
			});
		}

    // Insert a value and also return the row so it can be check if it was actually inserted
		const result = await db.query(
			`INSERT INTO manga (title, created_at) 
       VALUES ($1, NOW()) RETURNING *`,
			[title]
		);

    // Checking if it was actually inserted
		if (!result.rows[0]) {
			return res.status(500).json({
				error: "Insertion failed",
				details: "No rows were returned after insertion",
			});
		}

    // Sending back the inserted row
		res.json(result.rows[0]);

	} catch (error) {
		console.error("DB error:", error);
		res.status(500).json({
			error: "Failed to add manga",
			details: error.message, // Include the actual error message
			stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
		});
	}
});


// GET /api/manga?page=1&limit=10
app.get('/api/manga', async (req, res) => {
  // Page = default page 1, limit = # of items per page, offset = to calculate how many entries to skip
  // so page 2 = offset 10
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  // Pull all the relevant info needed for a manga card
  const query = `
    SELECT 
      m.manga_id,
      m.title,
      m.cover_art_url,
      m.description,
      m.status,
      m.latest_chapter,
      m.latest_chapter_date,
      w.last_chapter_read,
      w.date_added_to_watchlist,
      COUNT(*) OVER() as total_count
    FROM manga m
    LEFT JOIN watchlist w ON m.manga_id = w.manga_id
    ORDER BY m.record_created DESC
    LIMIT $1 OFFSET $2
  `;

  //Store the results in rows which the results are an array of objects 
  // and as a response , send it back stored in data
  try {
    const { rows } = await db.query(query, [limit, offset]);
    res.json({
      data: rows,
      total: rows[0]?.total_count || 0
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch manga" });
  }
});


app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
