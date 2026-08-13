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

  console.log('Seeding initial production data into SQLite...');

  // Seed Users with bcrypt hashed passwords
  const salt = bcrypt.genSaltSync(10);
  const adminPwdHash = bcrypt.hashSync('admin123', salt);
  const userPwdHash = bcrypt.hashSync('user123', salt);

  const insertUser = db.prepare(`
    INSERT INTO users (id, username, email, password_hash, role, name, gotram, sampradaya, avatar)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertUser.run('user-admin', 'admin', 'admin@real-purohit.org', adminPwdHash, 'admin', 'Chief Administrator', '', '', '👑');
  insertUser.run('user-devotee-1', 'venkatesh', 'venkatesh@real-purohit.org', userPwdHash, 'devotee', 'Sri Venkatesh Rao', 'Kashyapa', 'uttaradhi', '🕉️');
  insertUser.run('user-purohit-1', 'acharyar', 'acharyar@real-purohit.org', userPwdHash, 'purohit', 'Vidwan Raghavendra Acharya', 'Kashyapa', 'uttaradhi', '🪔');

  // Seed Purohits
  const insertPurohit = db.prepare(`
    INSERT INTO purohits (id, name, sampradaya, mutt, veda_shakha, sutram, experience_years, rating, reviews_count, languages_json, specialties_json, trust_score, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertPurohit.run(
    'pur-101',
    'Vidwan Raghavendra Acharya',
    'uttaradhi',
    'Uttaradhi Mutt',
    'Rigveda',
    'Ashvalayana Sutram',
    18,
    4.9,
    142,
    JSON.stringify(['Kannada', 'Sanskrit', 'Telugu', 'English']),
    JSON.stringify(['Satyanarayana Pooja', 'Mahasudarshana Homam', 'Varshika Shraaddha', 'Garuda Purana Pravachanam']),
    98,
    'Verified Master Acharya'
  );

  insertPurohit.run(
    'pur-102',
    'Sri Krishna Bhat',
    'udupi',
    'Palimaru Mutt (Ashta Mutt)',
    'Rigveda',
    'Ashvalayana Sutram',
    15,
    4.85,
    98,
    JSON.stringify(['Kannada', 'Tulu', 'Sanskrit']),
    JSON.stringify(['Madhva Devara Pooja', 'Koti Gayatri Parayanam', 'Vastu Shanti']),
    96,
    'Verified Acharya'
  );

  insertPurohit.run(
    'pur-103',
    'Srinivasa Sampath Kumaran Acharya',
    'vadagalai',
    'Ahobila Mutt / Parakala Mutt',
    'Yajurveda',
    'Apastamba Sutram',
    22,
    4.95,
    210,
    JSON.stringify(['Tamil', 'Sanskrit', 'English']),
    JSON.stringify(['Sudarsana Homam', 'Seetha Rama Kalyanam', 'Desika Prabhanda Parayanam']),
    99,
    'Verified Master Acharya'
  );

  insertPurohit.run(
    'pur-104',
    'Sri Thiruvengada Ramanuja Jeeyar Swami',
    'thengalai',
    'Vanamamalai Mutt',
    'Sama Veda',
    'Drahyayana Sutram',
    20,
    4.92,
    175,
    JSON.stringify(['Tamil', 'Sanskrit', 'Telugu']),
    JSON.stringify(['Nalayira Divya Prabhandam', 'Thiruppavai Pravachanam', 'Nitya Aradhana']),
    97,
    'Verified Acharya'
  );

  insertPurohit.run(
    'pur-105',
    'Mahamahopadhyaya Shankara Narayana Ghanapathi',
    'orthodox',
    'Sringeri Sharada Peetham',
    'Krishna Yajurveda (Ghana Pathi)',
    'Bodhayana Sutram',
    32,
    5.0,
    310,
    JSON.stringify(['Sanskrit', 'Telugu', 'Tamil', 'Kannada', 'Hindi']),
    JSON.stringify(['Koti Chandi Homam', 'Somayagam', 'Strict Apara Karyams (13-day lifecycle)', 'Garuda Purana Pravachanam']),
    100,
    'High-Level Orthodox Veda Rathna'
  );

  insertPurohit.run(
    'pur-106',
    'Pt. Anish Sharma',
    'secular',
    'Secular / Multi-Lingual',
    'Yajurveda',
    'Apastamba Sutram',
    9,
    4.78,
    84,
    JSON.stringify(['English', 'Hindi', 'Telugu']),
    JSON.stringify(['Griha Pravesham with English Explanation', 'Compact Ganapathi Pooja', 'Baby Naming Ceremony']),
    92,
    'Verified Modern Acharya'
  );

  // Seed Devotees
  const insertDevotee = db.prepare(`
    INSERT INTO devotees (id, user_id, name, gotram, veda_shakha, sutram, sampradaya, mutt, kula_daivam, location)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertDevotee.run(
    'dev-1',
    'user-devotee-1',
    'Sri Venkatesh Rao',
    'Kashyapa',
    'Rigveda',
    'Ashvalayana Sutram',
    'uttaradhi',
    'Uttaradhi Mutt',
    'Tirupati Venkateswara Swamy',
    'Bengaluru, Karnataka'
  );

  // Seed Ancestors
  const insertAncestor = db.prepare(`
    INSERT INTO ancestors (id, devotee_id, relation, name, month, paksha, tithi, passing_year)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertAncestor.run('anc-1', 'dev-1', 'Paternal Grandfather', 'Late Ramachandra Rao', 'Bhadrapada', 'Krishna', 'Navami', 2018);
  insertAncestor.run('anc-2', 'dev-1', 'Paternal Grandmother', 'Late Sita Bai', 'Kartika', 'Shukla', 'Ekadashi', 2021);

  // Seed Bookings
  const insertBooking = db.prepare(`
    INSERT INTO bookings (id, devotee_id, devotee_name, purohit_id, purohit_name, sampradaya, ritual_name, date, muhurta_time, dakshina_amount, dakshina_status, samagri_mode, status, is_apara_karyam, location)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertBooking.run(
    'BK-8901',
    'dev-1',
    'Sri Venkatesh Rao',
    'pur-101',
    'Vidwan Raghavendra Acharya',
    'uttaradhi',
    'Varshika Shraaddha (Ancestral Rites)',
    '2026-08-14',
    '08:30 AM',
    '₹ 3,500',
    'Direct On-the-Spot (0% Platform Fee)',
    'Pandit Hand-Carried Custom Kit',
    'Scheduled',
    1,
    'Indiranagar, Bengaluru'
  );

  insertBooking.run(
    'BK-8902',
    'dev-1',
    'Sri Venkatesh Rao',
    'pur-103',
    'Srinivasa Sampath Kumaran Acharya',
    'vadagalai',
    'Srimad Ramayana & Sundarakanda Pravachanam',
    '2026-08-16',
    '06:00 PM',
    '₹ 5,000',
    'Direct On-the-Spot (0% Platform Fee)',
    'Pre-Delivery via Courier (Delivered)',
    'Confirmed',
    0,
    'T. Nagar, Chennai'
  );

  // Seed Feedbacks
  const insertFeedback = db.prepare(`
    INSERT INTO feedbacks (id, booking_id, devotee_name, purohit_id, purohit_name, sampradaya, ratings_json, sampradaya_paddhati_accuracy, review_text, ai_sentiment, ai_confidence, status, date_submitted)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertFeedback.run(
    'FB-501',
    'BK-8850',
    'Sri Ananth Swamy',
    'pur-101',
    'Vidwan Raghavendra Acharya',
    'uttaradhi',
    JSON.stringify({ punctuality: 5, cleanliness: 5, mantraAccuracy: 5, vidhiExecution: 5, devoteeExperience: 5 }),
    '100% Strict Uttaradhi Mutt Paddhati Followed',
    'Acharyaru performed the Satyanarayana pooja with absolute devotion and impeccable Nyaya Sudha/Madhva paddhati. Flawless Vedic Swara!',
    'Extremely Positive',
    '99%',
    'Processed by AI System',
    '2026-08-10'
  );

  console.log('Database successfully seeded with initial production data!');
}

export default db;
