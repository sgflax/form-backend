import express from 'express';
import cors from 'cors';
import db from './db.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '5mb' })); // sculpted shapes can have a lot of vertex data

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'FORM backend is running' });
});

//save a new piece
app.post('/api/pieces', (req, res) => {
  const { vertices } = req.body;

  if (!vertices) {
    return res.status(400).json({ error: 'vertices is required' });
  }

  const stmt = db.prepare('INSERT INTO pieces (vertices) VALUES (?)');
  const result = stmt.run(JSON.stringify(vertices));

  res.status(201).json({ id: result.lastInsertRowid });
});

//load a piece by id
app.get('/api/pieces/:id', (req, res) => {
  const { id } = req.params;

  const stmt = db.prepare('SELECT * FROM pieces WHERE id = ?');
  const piece = stmt.get(id);

  if (!piece) {
    return res.status(404).json({ error: 'Piece not found' });
  }

  res.json({
    id: piece.id,
    vertices: JSON.parse(piece.vertices),
    created_at: piece.created_at,
  });
});

//list all pieces (for the gallery)
app.get('/api/pieces', (req, res) => {
  const stmt = db.prepare('SELECT id, created_at FROM pieces ORDER BY created_at DESC');
  const pieces = stmt.all();
  res.json(pieces);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});