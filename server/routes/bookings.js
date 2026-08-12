import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET all bookings
router.get('/', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM bookings ORDER BY created_at DESC').all();
    const result = rows.map(r => ({
      id: r.id,
      devoteeId: r.devotee_id,
      devoteeName: r.devotee_name,
      purohitId: r.purohit_id,
      purohitName: r.purohit_name,
      sampradaya: r.sampradaya,
      ritualName: r.ritual_name,
      date: r.date,
      muhurtaTime: r.muhurta_time,
      dakshinaAmount: r.dakshina_amount,
      dakshinaStatus: r.dakshina_status,
      samagriMode: r.samagri_mode,
      status: r.status,
      isAparaKaryam: Boolean(r.is_apara_karyam),
      location: r.location,
      createdAt: r.created_at
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Database error fetching bookings.' });
  }
});

// CREATE a booking
router.post('/', (req, res) => {
  try {
    const { devoteeId, devoteeName, purohitId, purohitName, sampradaya, ritualName, date, muhurtaTime, dakshinaAmount, samagriMode, isAparaKaryam, location } = req.body;

    const id = `BK-${Math.floor(8900 + Math.random() * 9000)}`;

    db.prepare(`
      INSERT INTO bookings (id, devotee_id, devotee_name, purohit_id, purohit_name, sampradaya, ritual_name, date, muhurta_time, dakshina_amount, dakshina_status, samagri_mode, status, is_apara_karyam, location)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      devoteeId || 'dev-1',
      devoteeName || 'Sri Devotee',
      purohitId || null,
      purohitName || 'Unassigned Acharya',
      sampradaya || 'uttaradhi',
      ritualName,
      date || new Date().toISOString().split('T')[0],
      muhurtaTime || '08:00 AM',
      dakshinaAmount || '₹ 3,500',
      'Direct On-the-Spot (0% Platform Fee)',
      samagriMode || 'Pandit Hand-Carried Custom Kit',
      'Scheduled',
      isAparaKaryam ? 1 : 0,
      location || 'Bengaluru'
    );

    res.status(201).json({ id, message: 'Booking record saved in database!' });
  } catch (err) {
    console.error('Booking create error:', err);
    res.status(500).json({ error: 'Failed to record booking in database.' });
  }
});

// UPDATE booking status
router.put('/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(status, id);
    res.json({ message: `Booking status updated to ${status} in database.` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update booking status.' });
  }
});

// DELETE booking
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM bookings WHERE id = ?').run(id);
    res.json({ message: 'Booking record deleted from database.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete booking.' });
  }
});

export default router;
