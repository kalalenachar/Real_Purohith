import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all SOS alerts
router.get('/', (req, res) => {
  try {
    const alerts = db.prepare('SELECT * FROM sos_alerts ORDER BY created_at DESC').all();
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch SOS alerts.' });
  }
});

// DISPATCH emergency SOS
router.post('/dispatch', (req, res) => {
  try {
    const { devoteeName = 'Devotee', location = 'Bengaluru' } = req.body;
    const id = `SOS-${Date.now()}`;
    const slaExpiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    db.prepare(`
      INSERT INTO sos_alerts (id, devotee_name, location, status, sla_expires_at)
      VALUES (?, ?, ?, 'ACTIVE', ?)
    `).run(id, devoteeName, location, slaExpiresAt);

    res.status(201).json({
      id,
      devoteeName,
      location,
      status: 'ACTIVE',
      slaExpiresAt,
      message: '⚡ Emergency 30-Min SLA Apara Dispatch alert recorded in database!'
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to record SOS dispatch alert.' });
  }
});

export default router;
