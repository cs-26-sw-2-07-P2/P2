const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve frontend
app.use(express.static('public'));

// Attempt to load database if USE_DB=true
let pool = null;
const useDb = process.env.USE_DB === 'true';

if (useDb) {
  try {
    pool = require('./db'); // only require db if USE_DB
    console.log('Database module loaded.');
  } catch (err) {
    console.warn('Database not available. Running in frontend-only mode.');
  }
}

// API route: only enable real queries if pool exists
app.get('/api/users', async (req, res) => {
  if (!pool) {
    return res.status(503).json({ error: 'Database not connected yet' });
  }

  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Fallback route for frontend
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/../public/index.html');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));