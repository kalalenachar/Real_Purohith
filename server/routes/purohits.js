import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all purohits
router.get('/', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM purohits ORDER BY trust_score DESC').all();
    const result = rows.map(r => ({
      ...r,
      languages: JSON.parse(r.languages_json || '[]'),
      specialties: JSON.parse(r.specialties_json || '[]'),
      experienceYears: r.experience_years,
      reviewsCount: r.reviews_count,
      trustScore: r.trust_score,
      vedaShakha: r.veda_shakha
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Database error fetching purohits.' });
  }
});

// CREATE a new purohit
router.post('/', (req, res) => {
  try {
    const { name, sampradaya, mutt, vedaShakha, sutram, experienceYears = 5, rating = 5.0, reviewsCount = 0, languages = [], specialties = [], trustScore = 95, status = 'Verified Acharya' } = req.body;

    const id = `pur-${Date.now()}`;
    db.prepare(`
      INSERT INTO purohits (id, name, sampradaya, mutt, veda_shakha, sutram, experience_years, rating, reviews_count, languages_json, specialties_json, trust_score, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, name, sampradaya, mutt, vedaShakha, sutram, experienceYears, rating, reviewsCount, JSON.stringify(languages), JSON.stringify(specialties), trustScore, status);

    res.status(201).json({ id, name, sampradaya, mutt, vedaShakha, sutram, experienceYears, rating, reviewsCount, languages, specialties, trustScore, status });
  } catch (err) {
    console.error('Create purohit error:', err);
    res.status(500).json({ error: 'Failed to insert Acharya into database.' });
  }
});

// UPDATE a purohit
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, sampradaya, mutt, vedaShakha, sutram, experienceYears, rating, reviewsCount, languages, specialties, trustScore, status } = req.body;

    db.prepare(`
      UPDATE purohits
      SET name = ?, sampradaya = ?, mutt = ?, veda_shakha = ?, sutram = ?, experience_years = ?, rating = ?, reviews_count = ?, languages_json = ?, specialties_json = ?, trust_score = ?, status = ?
      WHERE id = ?
    `).run(name, sampradaya, mutt, vedaShakha, sutram, experienceYears, rating, reviewsCount, JSON.stringify(languages || []), JSON.stringify(specialties || []), trustScore, status, id);

    res.json({ message: 'Acharya profile updated in SQLite database.' });
  } catch (err) {
    res.status(500).json({ error: 'Database update failed.' });
  }
});

// DELETE a purohit
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM purohits WHERE id = ?').run(id);
    res.json({ message: 'Acharya deleted from database.' });
  } catch (err) {
    res.status(500).json({ error: 'Database delete failed.' });
  }
});

export default router;
