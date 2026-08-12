import { INITIAL_DEVOTEES, INITIAL_PUROHITS, INITIAL_BOOKINGS, INITIAL_FEEDBACKS, SAMPRADAYA_MATRIX } from './mockData.js';

const STORAGE_KEYS = {
  DEVOTEES: 'rp_devotees_v1',
  PUROHITS: 'rp_purohits_v1',
  BOOKINGS: 'rp_bookings_v1',
  FEEDBACKS: 'rp_feedbacks_v1',
  AUTH: 'rp_auth_v1',
  SETTINGS: 'rp_settings_v1'
};

// Helper for local storage read with fallback
function loadData(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (e) {
    console.error(`Error loading ${key}:`, e);
    return fallback;
  }
}

// Helper for local storage save
function saveData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key}:`, e);
  }
}

export class DataStore {
  static getDevotees() {
    return loadData(STORAGE_KEYS.DEVOTEES, INITIAL_DEVOTEES);
  }

  static saveDevotees(devotees) {
    saveData(STORAGE_KEYS.DEVOTEES, devotees);
  }

  static getPurohits() {
    return loadData(STORAGE_KEYS.PUROHITS, INITIAL_PUROHITS);
  }

  static savePurohits(purohits) {
    saveData(STORAGE_KEYS.PUROHITS, purohits);
  }

  static getBookings() {
    return loadData(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
  }

  static saveBookings(bookings) {
    saveData(STORAGE_KEYS.BOOKINGS, bookings);
  }

  static getFeedbacks() {
    return loadData(STORAGE_KEYS.FEEDBACKS, INITIAL_FEEDBACKS);
  }

  static saveFeedbacks(feedbacks) {
    saveData(STORAGE_KEYS.FEEDBACKS, feedbacks);
  }

  static getAuth() {
    return loadData(STORAGE_KEYS.AUTH, {
      isLoggedIn: false,
      user: null, // { username: 'admin', role: 'admin', name: 'System Administrator' }
      role: 'guest'
    });
  }

  static saveAuth(auth) {
    saveData(STORAGE_KEYS.AUTH, auth);
  }

  static login(username, password) {
    if (username.trim().toLowerCase() === 'admin' && password === 'admin') {
      const authState = {
        isLoggedIn: true,
        role: 'admin',
        user: {
          username: 'admin',
          name: 'Chief Administrator',
          email: 'admin@real-purohit.org',
          role: 'admin',
          avatar: '👑'
        }
      };
      this.saveAuth(authState);
      return { success: true, auth: authState };
    }
    return { success: false, error: 'Invalid username or password. Use credentials: admin / admin' };
  }

  static logout() {
    const authState = { isLoggedIn: false, user: null, role: 'guest' };
    this.saveAuth(authState);
    return authState;
  }
}
