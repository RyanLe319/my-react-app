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
app.use(express.json()); // For parsing application/json

// PostgreSQL client setup
const db = new pg.Client({
	user: process.env.PG_USER,
	host: process.env.PG_HOST,
	database: process.env.PG_DATABASE,
	password: process.env.PG_PASSWORD,
	port: process.env.PG_PORT,
});

db.connect();

app.post("/adding-manga", async (req, res) => {
  try {
    // Destructure all possible fields from request body
    const {
      title,
      lastChapterRead,
      lastReadDate,
      status,
      latestChapter,
      latestChapterDate,
      description,
      image,
      genres
    } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({
        error: "Title is required",
        details: "No title was provided in the request body",
      });
    }

    // Start transaction
    await db.query('BEGIN');

    // Insert manga
    const mangaResult = await db.query(
      `INSERT INTO manga (
        title, 
        description,
        cover_art_url,
        status,
        latest_chapter,
        latest_chapter_date,
        record_created
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW()) 
      RETURNING manga_id`,
      [
        title,
        description || null,
        image || null,
        status || null,
        latestChapter || null,
        latestChapterDate || null
      ]
    );

    const mangaId = mangaResult.rows[0].manga_id;

    // Only add to watchlist if status is "Stacking"
    if (status === "Stacking") {
      await db.query(
        `INSERT INTO watchlist (
          manga_id,
          last_chapter_read,
          date_added_to_watchlist
        ) VALUES ($1, $2, $3)`,
        [
          mangaId,
          lastChapterRead || 0,  // Default to 0 if not provided
          lastReadDate ? new Date(lastReadDate) : new Date()  // Use current date if not provided
        ]
      );
    }

    // Process genres if they exist
    if (genres && genres.length > 0) {
      for (const genreName of genres) {
        const genreCheck = await db.query(
          'SELECT genre_id FROM Genres WHERE genre_name = $1',
          [genreName]
        );

        let genreId;
        if (!genreCheck.rows.length) {
          const newGenre = await db.query(
            'INSERT INTO Genres (genre_name) VALUES ($1) RETURNING genre_id',
            [genreName]
          );
          genreId = newGenre.rows[0].genre_id;
        } else {
          genreId = genreCheck.rows[0].genre_id;
        }

        await db.query(
          'INSERT INTO MangaGenres (manga_id, genre_id) VALUES ($1, $2)',
          [mangaId, genreId]
        );
      }
    }

    await db.query('COMMIT');

    res.json({
      success: true,
      manga_id: mangaId
    });

  } catch (error) {
    await db.query('ROLLBACK');
    console.error("DB error:", error);
    res.status(500).json({
      error: "Failed to add manga",
      details: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});


// server.js (updated)
app.get('/api/manga', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const query = `
      SELECT 
        m.manga_id,
        m.title,
        m.alternative_title,
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

    const { rows } = await db.query(query, [limit, offset]);
    console.log(rows);
    res.json({
      success: true,
      data: rows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: rows[0]?.total_count || 0
      }
    });
    
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch manga',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

app.delete('/api/manga/:id', async (req, res) => {
  try {
    const result = await db.query(
      'DELETE FROM manga WHERE manga_id = $1 RETURNING *',
      [req.params.id]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Manga not found' });
    }
    
    res.json({ 
      success: true,
      deletedManga: result.rows[0]
    });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ 
      error: 'Failed to delete manga',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
