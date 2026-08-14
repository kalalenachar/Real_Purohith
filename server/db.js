import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'database.db');
const db = new Database(dbPath);

// Enable WAL mode for high performance
db.pragma('journal_mode = WAL');

export function initDb() {
  console.log('Initializing SQLite Database schema...');

  // 1. Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'devotee',
      name TEXT NOT NULL,
      gotram TEXT,
      sampradaya TEXT,
      avatar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Purohits table
  db.exec(`
    CREATE TABLE IF NOT EXISTS purohits (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      sampradaya TEXT NOT NULL,
      mutt TEXT NOT NULL,
      veda_shakha TEXT,
      sutram TEXT,
      experience_years INTEGER DEFAULT 0,
      rating REAL DEFAULT 5.0,
      reviews_count INTEGER DEFAULT 0,
      languages_json TEXT,
      specialties_json TEXT,
      trust_score INTEGER DEFAULT 95,
      status TEXT DEFAULT 'Verified Acharya'
    );
  `);

  // 3. Devotees table
  db.exec(`
    CREATE TABLE IF NOT EXISTS devotees (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      name TEXT NOT NULL,
      gotram TEXT NOT NULL,
      veda_shakha TEXT NOT NULL,
      sutram TEXT NOT NULL,
      sampradaya TEXT NOT NULL,
      mutt TEXT NOT NULL,
      kula_daivam TEXT NOT NULL,
      location TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // 4. Ancestors table
  db.exec(`
    CREATE TABLE IF NOT EXISTS ancestors (
      id TEXT PRIMARY KEY,
      devotee_id TEXT NOT NULL,
      relation TEXT NOT NULL,
      name TEXT NOT NULL,
      month TEXT NOT NULL,
      paksha TEXT NOT NULL,
      tithi TEXT NOT NULL,
      passing_year INTEGER,
      FOREIGN KEY (devotee_id) REFERENCES devotees(id) ON DELETE CASCADE
    );
  `);

  // 5. Bookings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      devotee_id TEXT NOT NULL,
      devotee_name TEXT NOT NULL,
      devotee_phone TEXT,
      purohit_id TEXT,
      purohit_name TEXT,
      sampradaya TEXT NOT NULL,
      ritual_name TEXT NOT NULL,
      date TEXT NOT NULL,
      muhurta_time TEXT NOT NULL,
      dakshina_amount TEXT NOT NULL,
      dakshina_status TEXT DEFAULT 'Direct On-the-Spot (0% Platform Fee)',
      samagri_mode TEXT DEFAULT 'Pandit Hand-Carried Custom Kit',
      status TEXT DEFAULT 'Scheduled',
      is_apara_karyam INTEGER DEFAULT 0,
      location TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  try {
    db.exec(`ALTER TABLE bookings ADD COLUMN devotee_phone TEXT`);
  } catch (e) {}

  try {
    db.exec(`ALTER TABLE bookings ADD COLUMN meet_link TEXT`);
  } catch (e) {}

  try {
    db.exec(`ALTER TABLE users ADD COLUMN rashi TEXT`);
  } catch (e) {}

  try {
    db.exec(`ALTER TABLE users ADD COLUMN nakshatra TEXT`);
  } catch (e) {}

  try {
    db.exec(`ALTER TABLE devotees ADD COLUMN rashi TEXT`);
  } catch (e) {}

  try {
    db.exec(`ALTER TABLE devotees ADD COLUMN nakshatra TEXT`);
  } catch (e) {}

  try {
    db.exec(`ALTER TABLE users ADD COLUMN phone TEXT`);
  } catch (e) {}

  try {
    db.exec(`ALTER TABLE devotees ADD COLUMN phone TEXT`);
  } catch (e) {}

  // 6. Feedbacks table
  db.exec(`
    CREATE TABLE IF NOT EXISTS feedbacks (
      id TEXT PRIMARY KEY,
      booking_id TEXT NOT NULL,
      devotee_name TEXT NOT NULL,
      purohit_id TEXT NOT NULL,
      purohit_name TEXT NOT NULL,
      sampradaya TEXT NOT NULL,
      ratings_json TEXT NOT NULL,
      sampradaya_paddhati_accuracy TEXT,
      review_text TEXT,
      ai_sentiment TEXT,
      ai_confidence TEXT,
      status TEXT DEFAULT 'Processed by AI System',
      date_submitted TEXT NOT NULL
    );
  `);

  // 7. SOS Alerts table
  db.exec(`
    CREATE TABLE IF NOT EXISTS sos_alerts (
      id TEXT PRIMARY KEY,
      devotee_name TEXT NOT NULL,
      location TEXT NOT NULL,
      status TEXT DEFAULT 'ACTIVE',
      sla_expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 8. Sampradayas table (Vedic Traditions under Admin Control)
  db.exec(`
    CREATE TABLE IF NOT EXISTS sampradayas (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      badge_class TEXT NOT NULL,
      description TEXT NOT NULL,
      icon TEXT NOT NULL,
      image TEXT
    );
  `);

  try {
    db.exec(`ALTER TABLE sampradayas ADD COLUMN image TEXT;`);
  } catch (e) {
    // Column already exists
  }

  seedInitialData();
}

function seedInitialData() {
  // Seed Sampradayas if table is empty
  const sampCount = db.prepare('SELECT count(*) as count FROM sampradayas').get().count;
  if (sampCount === 0) {
    console.log('Seeding Sampradaya traditions into SQLite...');
    const insertSamp = db.prepare(`
      INSERT INTO sampradayas (id, name, badge_class, description, icon)
      VALUES (?, ?, ?, ?, ?)
    `);

    insertSamp.run('uttaradhi', 'Uttaradhi Mutt (Dvaita)', 'badge-uttaradhi', 'Adhering strictly to Uttaradhi Mutt lineage.', '🛕');
    insertSamp.run('udupi', 'Udupi Madhva (Ashta Mutts)', 'badge-udupi', 'Trained under Udupi Ashta Mutts (Palimaru, Pejavara, Sodhe, etc.).', '🚩');
    insertSamp.run('vadagalai', 'Sri Vaishnava (Vadagalai)', 'badge-vadagalai', 'Following Vedanta Desika tradition.', '🪔');
    insertSamp.run('thengalai', 'Sri Vaishnava (Thengalai)', 'badge-thengalai', 'Following Manavala Mahamuni tradition.', '⚜️');
    insertSamp.run('shankara', 'Shankara Mutt (Smartha / Advaita)', 'badge-shankara', 'Following Sringeri, Kanchi, or other Sankara traditions.', '☸️');
    insertSamp.run('secular', 'Secular / Universal Vedic', 'badge-secular', 'Universal Vedic mantras for all householders.', '🕊️');
  }

  const userCount = db.prepare('SELECT count(*) as count FROM users').get().count;
  if (userCount > 0) return;

  console.log('Seeding initial Admin account into SQLite...');

  // Seed ONLY Chief Administrator with bcrypt hashed password
  const salt = bcrypt.genSaltSync(10);
  const adminPwdHash = bcrypt.hashSync('admin123', salt);

  const insertUser = db.prepare(`
    INSERT INTO users (id, username, email, phone, password_hash, role, name, gotram, sampradaya, avatar)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertUser.run('user-admin', 'admin', 'admin@real-purohit.org', '+91 9999999999', adminPwdHash, 'admin', 'Chief Administrator', '', '', '👑');

  console.log('Database initialized with Admin account only (no dummy devotees or purohits preloaded).');
}

export default db;
