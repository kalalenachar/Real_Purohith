import express from 'express';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '..', 'database.db');
const db = new Database(dbPath);

// GET /api/sampradayas - List all traditions from SQLite database
router.get('/', (req, res) => {
  try {
    const sampradayas = db.prepare('SELECT id, name, badge_class as badgeClass, description, icon, image FROM sampradayas').all();
    res.json(sampradayas);
  } catch (error) {
    console.error('Error fetching sampradayas:', error);
    res.status(500).json({ error: 'Failed to fetch sampradayas' });
  }
});

// POST /api/sampradayas - Create a new tradition (Admin Only)
router.post('/', (req, res) => {
  try {
    const { id, name, badgeClass, description, icon, image } = req.body;
    if (!id || !name) {
      return res.status(400).json({ error: 'Id and name are required' });
    }

    const insert = db.prepare(`
      INSERT INTO sampradayas (id, name, badge_class, description, icon, image)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insert.run(id.toLowerCase().replace(/\s+/g, '-'), name, badgeClass || 'badge-secular', description || '', icon || '🛕', image || null);
    res.status(201).json({ message: 'Sampradaya created successfully' });
  } catch (error) {
    console.error('Error creating sampradaya:', error);
    res.status(500).json({ error: 'Failed to create sampradaya' });
  }
});

// PUT /api/sampradayas/:id - Update tradition (Admin Only)
router.put('/:id', (req, res) => {
  try {
    const { name, badgeClass, description, icon, image } = req.body;
    const { id } = req.params;

    const update = db.prepare(`
      UPDATE sampradayas
      SET name = COALESCE(?, name),
          badge_class = COALESCE(?, badge_class),
          description = COALESCE(?, description),
          icon = COALESCE(?, icon),
          image = COALESCE(?, image)
      WHERE id = ?
    `);

    update.run(name, badgeClass, description, icon, image, id);
    res.json({ message: 'Sampradaya updated successfully' });
  } catch (error) {
    console.error('Error updating sampradaya:', error);
    res.status(500).json({ error: 'Failed to update sampradaya' });
  }
});

// DELETE /api/sampradayas/:id - Delete tradition (Admin Only)
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM sampradayas WHERE id = ?').run(id);
    res.json({ message: 'Sampradaya deleted successfully' });
  } catch (error) {
    console.error('Error deleting sampradaya:', error);
    res.status(500).json({ error: 'Failed to delete sampradaya' });
  }
});

export default router;
