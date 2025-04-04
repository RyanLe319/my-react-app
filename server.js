// Import necessary modules
import express from "express";
import bodyParser from "body-parser"; // Deprecated in modern Express, but still okay for older setups
import pg from "pg"; // PostgreSQL client
import env from "dotenv"; // Loads environment variables from .env file
import cors from "cors"; // Handles Cross-Origin Resource Sharing
import ejs from "ejs"; // Optional: for server-side templating (currently unused here)

const app = express();
const port = 3000;
env.config(); // Load environment variables from .env

// Enable CORS for all routes
app.use(cors());

// Middleware setup
app.use(express.static("public")); // Serve static files from 'public' folder
app.use(express.json()); // Parse JSON request bodies

// Setup PostgreSQL client using environment variables
const db = new pg.Client({
	user: process.env.PG_USER,
	host: process.env.PG_HOST,
	database: process.env.PG_DATABASE,
	password: process.env.PG_PASSWORD,
	port: process.env.PG_PORT,
});

db.connect(); // Connect to the database

// Route to add a manga to the database
app.post("/adding-manga", async (req, res) => {
  try {

    // Deconstruct and store fields from request body
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

    // Ensure required fields are present
    if (!title) {
      return res.status(400).json({
        error: "Title is required",
        details: "No title was provided in the request body",
      });
    }

    // Start transaction , transaction 100% complete or no deal
    await db.query('BEGIN');

    // Insert manga into the 'manga' table
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

    // If manga has a status "WatchList", add it to the watchlist and update is_watched to true
    if (status === "WatchList") {
      try {
        // Insert manga into the watchlist
        await db.query(
          `INSERT INTO watchlist (
            manga_id,
            last_chapter_read,
            date_added_to_watchlist
          ) VALUES ($1, $2, NOW())`,
          [
            mangaId,
            lastChapterRead || 0,
          ]
        );

        // Update is_watched to true for the manga
        await db.query(
          `UPDATE watchlist
          SET is_watched = true
          WHERE manga_id = $1`,
          [mangaId]
        );

      } catch (error) {
        console.error("Error updating watchlist or is_watched:", error);
        res.status(500).json({
          error: "Failed to add manga to watchlist or update is_watched",
          details: error.message,
        });
      }
    }


    // Insert genres if provided
    if (genres && genres.length > 0) {

      // use for of with async functions as it waits for the async op to finish before moving to the next iteration
      for (const genreName of genres) {

        // Check if genre already exists
        const genreCheck = await db.query(
          'SELECT genre_id FROM genres WHERE genre_name = $1',
          [genreName]
        );

        let genreId;
        if (!genreCheck.rows.length) {

          // Insert new genre
          const newGenre = await db.query(
            'INSERT INTO genres (genre_name) VALUES ($1) RETURNING genre_id',
            [genreName]
          );

          genreId = newGenre.rows[0].genre_id;
        } else {
          genreId = genreCheck.rows[0].genre_id;
        }

        // Create relationship in join table
        await db.query(
          'INSERT INTO mangagenres (manga_id, genre_id) VALUES ($1, $2)',
          [mangaId, genreId]
        );
      }
    }

    await db.query('COMMIT'); // Commit the transaction

    res.json({
      success: true,
      manga_id: mangaId
    });

  } catch (error) {
    await db.query('ROLLBACK'); // Rollback on error
    console.error("DB error:", error);
    res.status(500).json({
      error: "Failed to add manga",
      details: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

// Updated GET endpoint with search functionality
app.get('/api/manga', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10,
      genres = '',
      min_chapters = 0,
      sort = 'newest',
      search = ''  // New search parameter
    } = req.query;

    const offset = (page - 1) * limit;
    const genreList = genres ? genres.split(',') : [];
    const minChaptersNum = Number(min_chapters) || 0;

    // Sorting options
    const sortOptions = {
      'a-z': { field: 'm.title', order: 'ASC' },
      'newest': { field: 'm.record_created', order: 'DESC' },
      'updated': { field: 'm.latest_chapter_date', order: 'DESC' },
      'chapters': { field: 'm.latest_chapter', order: 'DESC' },
      'unread': { 
        field: '(m.latest_chapter - COALESCE(w.last_chapter_read, 0))', 
        order: 'DESC' 
      }
    };

    const currentSort = sortOptions[sort] || sortOptions.newest;

    let query = `
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
    `;

    const whereClauses = [];
    const queryParams = [];

    // Add search condition (searches title, alternative title, and description)
    if (search) {
      whereClauses.push(`
        (m.title ILIKE $${queryParams.length + 1} OR 
         m.alternative_title ILIKE $${queryParams.length + 1} OR
         m.description ILIKE $${queryParams.length + 1})
      `);
      queryParams.push(`%${search}%`);
    }

    // Add genre filter
    if (genreList.length > 0) {
      whereClauses.push(`
        m.manga_id IN (
          SELECT mg.manga_id 
          FROM mangagenres mg
          JOIN genres g ON mg.genre_id = g.genre_id
          WHERE g.genre_name = ANY($${queryParams.length + 1})
        )
      `);
      queryParams.push(genreList);
    }

    // Add minimum chapters filter
    if (minChaptersNum > 0) {
      whereClauses.push(`m.latest_chapter >= $${queryParams.length + 1}`);
      queryParams.push(minChaptersNum);
    }

    // Combine WHERE clauses if they exist
    if (whereClauses.length > 0) {
      query += ' WHERE ' + whereClauses.join(' AND ');
    }

    // Add sorting and pagination
    query += ` ORDER BY ${currentSort.field} ${currentSort.order}`;
    queryParams.push(limit, offset);
    query += ` LIMIT $${queryParams.length - 1} OFFSET $${queryParams.length}`;

    const { rows } = await db.query(query, queryParams);

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

// GET endpoint to retrieve user's watchlist
app.get('/api/watchlist', async (req, res) => {
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
        w.is_watched,
        COUNT(*) OVER() as total_count
      FROM manga m
      JOIN watchlist w ON m.manga_id = w.manga_id
      WHERE w.is_watched = true
      ORDER BY w.date_added_to_watchlist DESC
      LIMIT $1 OFFSET $2
    `;

    const { rows } = await db.query(query, [limit, offset]);

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
      error: 'Failed to fetch watchlist',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// GET endpoint for individual manga details by ID
app.get('/api/manga/:id', async (req, res) => {
  try {
    const mangaId = req.params.id;

    // Fetch main manga info
    const mangaQuery = `
      SELECT 
        m.*,
        w.last_chapter_read,
        w.date_added_to_watchlist
      FROM manga m
      LEFT JOIN watchlist w ON m.manga_id = w.manga_id
      WHERE m.manga_id = $1
    `;
    
    const mangaResult = await db.query(mangaQuery, [mangaId]);

    if (mangaResult.rows.length === 0) {
      return res.status(404).json({ error: 'Manga not found' });
    }

    // Fetch genres
    const genresQuery = `
      SELECT g.genre_id, g.genre_name
      FROM genres g
      JOIN mangagenres mg ON g.genre_id = mg.genre_id
      WHERE mg.manga_id = $1
    `;
    
    const genresResult = await db.query(genresQuery, [mangaId]);

    res.json({
      ...mangaResult.rows[0],
      genres: genresResult.rows
    });

  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ 
      error: 'Failed to fetch manga details',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// DELETE endpoint to remove manga by ID
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
      deleted: result.rows[0]
    });

  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ 
      error: 'Failed to delete manga',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});


// Add this to your server.js (before app.listen)
app.get('/api/genres', async (req, res) => {
  try {
    // Simple query to get all genres sorted by name
    const result = await db.query(`
      SELECT genre_id, genre_name 
      FROM genres 
      ORDER BY genre_name ASC
    `);
    
    // Log the query result for debugging
    console.log('Genres fetched:', result.rows);
    
    // Return the genres array
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching genres:', err);
    res.status(500).json({ 
      error: 'Failed to fetch genres',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});


// Add this to your server.js (before app.listen)
app.post('/api/genres', async (req, res) => {
  const { genre_name } = req.body;

  // Ensure the genre name is provided
  if (!genre_name) {
    return res.status(400).json({ error: 'Genre name is required' });
  }

  try {
    // Insert new genre into the Genres table
    const result = await db.query(`
      INSERT INTO genres (genre_name) 
      VALUES ($1) 
      RETURNING genre_id, genre_name;
    `, [genre_name]);

    // Log the result for debugging
    console.log('New genre added:', result.rows[0]);

    // Return the newly added genre
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding genre:', err);
    res.status(500).json({ 
      error: 'Failed to add genre',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});


app.put('/api/genres/:name', async (req, res) => {
  const rawGenreName = req.params.name;
  const genreName = decodeURIComponent(rawGenreName);
  const { genre_name: newGenreName } = req.body;

  if (!newGenreName || !genreName) {
    return res.status(400).json({ error: 'Both current and new genre names are required' });
  }

  try {
    await db.query('BEGIN');

    // Check if genre exists
    const checkQuery = 'SELECT genre_id FROM genres WHERE genre_name = $1';
    const checkResult = await db.query(checkQuery, [genreName]);
    
    if (checkResult.rowCount === 0) {
      await db.query('ROLLBACK');
      return res.status(404).json({ error: 'Genre not found' });
    }

    const genreId = checkResult.rows[0].genre_id;

    // Check if new name already exists
    const existsQuery = 'SELECT genre_id FROM genres WHERE genre_name = $1 AND genre_id != $2';
    const existsResult = await db.query(existsQuery, [newGenreName, genreId]);
    
    if (existsResult.rowCount > 0) {
      await db.query('ROLLBACK');
      return res.status(409).json({ error: 'Genre name already exists' });
    }

    // Update genre
    const updateQuery = `
      UPDATE genres 
      SET genre_name = $1 
      WHERE genre_id = $2 
      RETURNING genre_id, genre_name
    `;
    const updateResult = await db.query(updateQuery, [newGenreName, genreId]);

    await db.query('COMMIT');
    
    res.status(200).json(updateResult.rows[0]);
  } catch (err) {
    await db.query('ROLLBACK');
    console.error('Error updating genre:', err);
    res.status(500).json({
      error: 'Failed to update genre',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});


app.delete('/api/genres/:name', async (req, res) => {
  const rawGenreName = req.params.name;
  const genreName = decodeURIComponent(rawGenreName);

  try {
    await db.query('BEGIN');

    // Check if genre exists
    const checkQuery = 'SELECT genre_id FROM genres WHERE genre_name = $1';
    const checkResult = await db.query(checkQuery, [genreName]);

    if (checkResult.rowCount === 0) {
      await db.query('ROLLBACK');
      return res.status(404).json({ error: 'Genre not found' });
    }

    const genreId = checkResult.rows[0].genre_id;

    // Remove references in mangagenres (or any related table)
    const deleteReferencesQuery = 'DELETE FROM mangagenres WHERE genre_id = $1';
    await db.query(deleteReferencesQuery, [genreId]);

    // Delete the genre itself
    const deleteGenreQuery = 'DELETE FROM genres WHERE genre_id = $1';
    await db.query(deleteGenreQuery, [genreId]);

    await db.query('COMMIT');

    res.status(200).json({ message: `Genre "${genreName}" deleted successfully` });
  } catch (err) {
    await db.query('ROLLBACK');
    console.error('Error deleting genre:', err);
    res.status(500).json({
      error: 'Failed to delete genre',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
