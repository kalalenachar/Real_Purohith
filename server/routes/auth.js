import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'real_purohit_sacred_vedic_secret_key_2026';

// Middleware to verify JWT token
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access token required.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token.' });
    req.user = user;
    next();
  });
}

// 1. REGISTER USER
router.post('/register', (req, res) => {
  try {
    const { name, phone, password, username, email, role = 'devotee', gotram = '', sampradaya = '', rashi = '', nakshatra = '' } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({ error: 'Please provide all mandatory fields: Full Name, Mobile Number, and Password.' });
    }

    const cleanPhone = phone.trim();
    const phoneDigits = cleanPhone.replace(/\D/g, '');
    if (phoneDigits.length < 7) {
      return res.status(400).json({ error: 'Please enter a valid mobile number.' });
    }

    const cleanUsername = (username && username.trim().length > 0) ? username.trim().toLowerCase() : `dev_${phoneDigits}`;
    const cleanEmail = (email && email.trim().length > 0) ? email.trim().toLowerCase() : `phone_${phoneDigits}@realpurohit.local`;

    if (role === 'admin') {
      return res.status(403).json({ error: 'Admin registration is restricted to system administrator.' });
    }

    // Check if user already exists by phone, username, or email
    const existing = db.prepare(`
      SELECT id FROM users 
      WHERE phone = ? 
         OR username = ? 
         OR email = ?
    `).get(cleanPhone, cleanUsername, cleanEmail);
    if (existing) {
      return res.status(409).json({ error: 'An account with that mobile number, username, or email already exists.' });
    }

    // Hash password with bcrypt
    const salt = bcrypt.genSaltSync(10);
    const password_hash = bcrypt.hashSync(password, salt);
    const id = `user-${Date.now()}`;
    const avatar = role === 'admin' ? '👑' : role === 'purohit' ? '🪔' : '🕉️';

    // Insert user into SQLite
    db.prepare(`
      INSERT INTO users (id, username, email, phone, password_hash, role, name, gotram, sampradaya, rashi, nakshatra, avatar)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, cleanUsername, cleanEmail, cleanPhone, password_hash, role, name, gotram, sampradaya, rashi, nakshatra, avatar);

    // If devotee, insert devotee profile record
    if (role === 'devotee') {
      const devId = `dev-${Date.now()}`;
      db.prepare(`
        INSERT INTO devotees (id, user_id, name, gotram, veda_shakha, sutram, sampradaya, mutt, kula_daivam, location, rashi, nakshatra, phone)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        devId, id, name,
        gotram || '',
        '',
        '',
        sampradaya || 'secular',
        '',
        '',
        '',
        rashi || '',
        nakshatra || '',
        cleanPhone
      );
    }

    // Generate JWT token
    const token = jwt.sign({ id, username: cleanUsername, role, name, phone: cleanPhone }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Account successfully registered in database!',
      token,
      user: { id, username: cleanUsername, email: cleanEmail, phone: cleanPhone, name, role, gotram, sampradaya, rashi, nakshatra, avatar }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Internal database error during user registration.' });
  }
});

// 2. LOGIN USER
router.post('/login', (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Please enter your Mobile Number / Username and Password.' });
    }

    const term = identifier.trim();
    const termLower = term.toLowerCase();
    const digitsOnly = term.replace(/\D/g, '');

    // Query user from SQLite database by phone, username, or email
    let user = db.prepare('SELECT * FROM users WHERE phone = ? OR username = ? OR email = ?').get(term, termLower, termLower);

    if (!user && digitsOnly.length >= 7) {
      user = db.prepare('SELECT * FROM users WHERE phone LIKE ?').get(`%${digitsOnly}%`);
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid Mobile Number / Username or password.' });
    }

    // Verify bcrypt hashed password
    const valid = bcrypt.compareSync(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid Mobile Number / Username or password.' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role, name: user.name, phone: user.phone }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Successfully authenticated via database!',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone || '',
        name: user.name,
        role: user.role,
        gotram: user.gotram,
        sampradaya: user.sampradaya,
        rashi: user.rashi || '',
        nakshatra: user.nakshatra || '',
        avatar: user.avatar
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal database authentication error.' });
  }
});

// 3. GET CURRENT USER PROFILE (/api/auth/me)
router.get('/me', authenticateToken, (req, res) => {
  try {
    const user = db.prepare('SELECT id, username, email, role, name, gotram, sampradaya, rashi, nakshatra, avatar, created_at FROM users WHERE id = ?').get(req.user.id);
    if (!user) return res.status(404).json({ error: 'User profile not found.' });

    // Try to fetch additional devotee attributes if existing
    const dev = db.prepare('SELECT veda_shakha, sutram, kula_daivam, location, rashi, nakshatra FROM devotees WHERE user_id = ? OR id = ?').get(user.id, user.id);

    res.json({
      user: {
        ...user,
        rashi: user?.rashi || dev?.rashi || '',
        nakshatra: user?.nakshatra || dev?.nakshatra || '',
        vedaShakha: dev?.veda_shakha || '',
        sutram: dev?.sutram || '',
        kulaDaivam: dev?.kula_daivam || '',
        location: dev?.location || ''
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Database fetch error.' });
  }
});

// 4. UPDATE USER PROFILE (/api/auth/profile)
router.put('/profile', authenticateToken, (req, res) => {
  try {
    const { name, gotram, sampradaya, rashi, nakshatra, avatar, vedaShakha, sutram, kulaDaivam, location } = req.body;
    const userId = req.user.id;

    // Update users table
    db.prepare(`
      UPDATE users 
      SET name = COALESCE(?, name),
          gotram = COALESCE(?, gotram),
          sampradaya = COALESCE(?, sampradaya),
          rashi = COALESCE(?, rashi),
          nakshatra = COALESCE(?, nakshatra),
          avatar = COALESCE(?, avatar)
      WHERE id = ?
    `).run(name, gotram, sampradaya, rashi, nakshatra, avatar, userId);

    // Also update or insert in devotees table
    const existingDev = db.prepare('SELECT id FROM devotees WHERE user_id = ? OR id = ?').get(userId, userId);
    if (existingDev) {
      db.prepare(`
        UPDATE devotees
        SET name = COALESCE(?, name),
            gotram = COALESCE(?, gotram),
            sampradaya = COALESCE(?, sampradaya),
            rashi = COALESCE(?, rashi),
            nakshatra = COALESCE(?, nakshatra),
            veda_shakha = COALESCE(?, veda_shakha),
            sutram = COALESCE(?, sutram),
            kula_daivam = COALESCE(?, kula_daivam),
            location = COALESCE(?, location)
        WHERE id = ?
      `).run(name, gotram, sampradaya, rashi, nakshatra, vedaShakha, sutram, kulaDaivam, location, existingDev.id);
    } else {
      const devId = `dev-${Date.now()}`;
      db.prepare(`
        INSERT INTO devotees (id, user_id, name, gotram, veda_shakha, sutram, sampradaya, mutt, kula_daivam, location, rashi, nakshatra)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(devId, userId, name || req.user.name, gotram || '', vedaShakha || '', sutram || '', sampradaya || '', '', kulaDaivam || '', location || '', rashi || '', nakshatra || '');
    }

    const updatedUser = db.prepare('SELECT id, username, email, role, name, gotram, sampradaya, rashi, nakshatra, avatar FROM users WHERE id = ?').get(userId);

    res.json({
      message: 'Profile updated successfully!',
      user: {
        ...updatedUser,
        rashi,
        nakshatra,
        vedaShakha,
        sutram,
        kulaDaivam,
        location
      }
    });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Failed to update user profile in database.' });
  }
});

export default router;
