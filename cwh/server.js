/**
 * Simple Node API to accept form data and store it in MySQL.
 *
 * Setup:
 * 1. In c:\xampp\htdocs\cwh run:
 *    npm init -y
 *    npm install express mysql2 cors
 * 2. Create DB/table (see create_db.sql below) in phpMyAdmin or mysql CLI.
 * 3. Adjust DB credentials in the pool if needed.
 * 4. Start server: node server.js
 *
 * The frontend at c:\xampp\htdocs\cwh\index.html posts JSON to:
 *   POST http://localhost:3000/submit
 */
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ...adjust these credentials if your MySQL uses different user/password...
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'cwh_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.post('/submit', async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Missing fields' });

  try {
    const [result] = await pool.execute(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [name, email]
    );
    res.json({ message: 'Record added', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Optional: quickly list stored users for verification
app.get('/list', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email, created_at FROM users ORDER BY id DESC');
    res.json({ rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
