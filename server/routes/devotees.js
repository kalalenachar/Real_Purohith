import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all devotees with ancestors
router.get('/', (req, res) => {
  try {
    const devotees = db.prepare('SELECT * FROM devotees').all();
    const result = devotees.map(dev => {
      const ancestors = db.prepare('SELECT * FROM ancestors WHERE devotee_id = ?').all(dev.id).map(a => ({
        id: a.id,
        relation: a.relation,
        name: a.name,
        month: a.month,
        paksha: a.paksha,
        tithi: a.tithi,
        passingYear: a.passing_year
      }));
      return {
        id: dev.id,
        userId: dev.user_id,
        name: dev.name,
        gotram: dev.gotram,
        vedaShakha: dev.veda_shakha,
        sutram: dev.sutram,
        sampradaya: dev.sampradaya,
        mutt: dev.mutt,
        kulaDaivam: dev.kula_daivam,
        location: dev.location,
        ancestors
      };
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Database error fetching devotees.' });
  }
});

// ADD an ancestor to a devotee vault
router.post('/:id/ancestors', (req, res) => {
  try {
    const { id: devotee_id } = req.params;
    const { relation, name, month, paksha, tithi, passingYear } = req.body;

    if (!relation || !name || !month || !tithi) {
      return res.status(400).json({ error: 'Please provide relation, name, month, and tithi.' });
    }

    const ancestorId = `anc-${Date.now()}`;
    db.prepare(`
      INSERT INTO ancestors (id, devotee_id, relation, name, month, paksha, tithi, passing_year)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(ancestorId, devotee_id, relation, name, month, paksha || 'Shukla', tithi, passingYear ? Number(passingYear) : null);

    res.status(201).json({ id: ancestorId, devoteeId: devotee_id, relation, name, month, paksha, tithi, passingYear });
  } catch (err) {
    console.error('Add ancestor error:', err);
    res.status(500).json({ error: 'Failed to insert ancestor into database.' });
  }
});

// DELETE an ancestor from vault
router.delete('/:id/ancestors/:ancestorId', (req, res) => {
  try {
    const { ancestorId } = req.params;
    db.prepare('DELETE FROM ancestors WHERE id = ?').run(ancestorId);
    res.json({ message: 'Ancestor record deleted from database.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete ancestor.' });
  }
});

export default router;
