import { INITIAL_DEVOTEES, INITIAL_PUROHITS, INITIAL_BOOKINGS, INITIAL_FEEDBACKS, INITIAL_USERS, SAMPRADAYA_MATRIX } from './mockData.js';

const STORAGE_KEYS = {
  DEVOTEES: 'rp_devotees_v1',
  PUROHITS: 'rp_purohits_v1',
  BOOKINGS: 'rp_bookings_v1',
  FEEDBACKS: 'rp_feedbacks_v1',
  AUTH: 'rp_auth_v1',
  USERS: 'rp_users_v1',
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
  static getUsers() {
    return loadData(STORAGE_KEYS.USERS, INITIAL_USERS);
  }

  static saveUsers(users) {
    saveData(STORAGE_KEYS.USERS, users);
  }

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
      user: null,
      role: 'guest'
    });
  }

  static saveAuth(auth) {
    saveData(STORAGE_KEYS.AUTH, auth);
  }

  static login(identifier, password) {
    const term = (identifier || '').trim().toLowerCase();
    const users = this.getUsers();

    const matchedUser = users.find(u =>
      (u.username && u.username.toLowerCase() === term) ||
      (u.email && u.email.toLowerCase() === term)
    );

    if (matchedUser && matchedUser.password === password) {
      const authState = {
        isLoggedIn: true,
        role: matchedUser.role || 'devotee',
        user: {
          id: matchedUser.id,
          username: matchedUser.username,
          email: matchedUser.email,
          name: matchedUser.name,
          role: matchedUser.role || 'devotee',
          gotram: matchedUser.gotram || '',
          sampradaya: matchedUser.sampradaya || '',
          avatar: matchedUser.avatar || (matchedUser.role === 'admin' ? '👑' : matchedUser.role === 'purohit' ? '🪔' : '🕉️')
        }
      };
      this.saveAuth(authState);
      return { success: true, auth: authState };
    }

    return { success: false, error: 'Invalid Username/Email ID or password.' };
  }

  static registerUser({ name, username, email, password, role = 'devotee', gotram = '', sampradaya = '' }) {
    const cleanUsername = (username || '').trim().toLowerCase();
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanUsername || !cleanEmail || !password || !name) {
      return { success: false, error: 'Please fill in all required fields.' };
    }

    const users = this.getUsers();
    const existing = users.find(u =>
      (u.username && u.username.toLowerCase() === cleanUsername) ||
      (u.email && u.email.toLowerCase() === cleanEmail)
    );

    if (existing) {
      return { success: false, error: 'An account with that Username or Email ID already exists.' };
    }

    const avatar = role === 'admin' ? '👑' : role === 'purohit' ? '🪔' : '🕉️';
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      username: cleanUsername,
      email: cleanEmail,
      password,
      role,
      gotram,
      sampradaya,
      avatar
    };

    const updatedUsers = [...users, newUser];
    this.saveUsers(updatedUsers);

    // Auto log in after registration
    const authState = {
      isLoggedIn: true,
      role: newUser.role,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        gotram: newUser.gotram,
        sampradaya: newUser.sampradaya,
        avatar: newUser.avatar
      }
    };
    this.saveAuth(authState);

    return { success: true, auth: authState };
  }

  static resetPassword(identifier, newPassword) {
    const term = (identifier || '').trim().toLowerCase();
    if (!term || !newPassword) {
      return { success: false, error: 'Please provide both user identifier and a new password.' };
    }

    const users = this.getUsers();
    const index = users.findIndex(u =>
      (u.username && u.username.toLowerCase() === term) ||
      (u.email && u.email.toLowerCase() === term)
    );

    if (index === -1) {
      return { success: false, error: 'No account found matching that Username or Email ID.' };
    }

    users[index].password = newPassword;
    this.saveUsers(users);

    return { success: true, message: 'Password updated successfully! You can now log in with your new password.' };
  }

  static logout() {
    const authState = { isLoggedIn: false, user: null, role: 'guest' };
    this.saveAuth(authState);
    return authState;
  }
}

