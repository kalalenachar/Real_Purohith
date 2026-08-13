import { API } from './api.js';
import { SAMPRADAYA_MATRIX, INITIAL_DEVOTEES, INITIAL_PUROHITS, INITIAL_BOOKINGS, INITIAL_FEEDBACKS } from './systemData.js';

export class DataStore {
  // Authentication with real Express + SQLite backend
  static async login(identifier, password) {
    try {
      const result = await API.login(identifier, password);
      const authState = {
        isLoggedIn: true,
        role: result.user.role || 'devotee',
        token: result.token,
        user: result.user
      };
      return { success: true, auth: authState };
    } catch (e) {
      return { success: false, error: e.message || 'Authentication error' };
    }
  }

  static async registerUser(userData) {
    try {
      const result = await API.register(userData);
      const authState = {
        isLoggedIn: true,
        role: result.user.role || 'devotee',
        token: result.token,
        user: result.user
      };
      return { success: true, auth: authState };
    } catch (e) {
      return { success: false, error: e.message || 'Registration error' };
    }
  }

  static async checkAuth() {
    try {
      const user = await API.getCurrentUser();
      if (user) {
        return {
          isLoggedIn: true,
          role: user.role,
          user
        };
      }
    } catch (e) {}
    return { isLoggedIn: false, user: null, role: 'guest' };
  }

  static logout() {
    API.logout();
    return { isLoggedIn: false, user: null, role: 'guest' };
  }

  static async updateProfile(profileData) {
    try {
      const res = await API.updateProfile(profileData);
      return { success: true, user: res.user };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  // Purohits from SQLite DB
  static async getPurohits() {
    try {
      return await API.getPurohits();
    } catch (e) {
      return INITIAL_PUROHITS;
    }
  }

  static async savePurohit(purohit) {
    if (purohit.id) {
      return await API.updatePurohit(purohit.id, purohit);
    } else {
      return await API.createPurohit(purohit);
    }
  }

  static async deletePurohit(id) {
    return await API.deletePurohit(id);
  }

  // Devotees from SQLite DB
  static async getDevotees() {
    try {
      return await API.getDevotees();
    } catch (e) {
      return INITIAL_DEVOTEES;
    }
  }

  static async addAncestor(devoteeId, ancestor) {
    try {
      return await API.addAncestor(devoteeId, ancestor);
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  // Bookings from SQLite DB
  static async getBookings() {
    try {
      return await API.getBookings();
    } catch (e) {
      return INITIAL_BOOKINGS;
    }
  }

  static async createBooking(booking) {
    return await API.createBooking(booking);
  }

  static async updateBooking(id, bookingData) {
    return await API.updateBooking(id, bookingData);
  }

  static async updateBookingStatus(id, status, location) {
    return await API.updateBookingStatus(id, status, location);
  }

  static async clearAllMeetLinks() {
    return await API.clearAllMeetLinks();
  }

  static async deleteBooking(id) {
    return await API.deleteBooking(id);
  }

  // Feedbacks from SQLite DB
  static async getFeedbacks() {
    try {
      return await API.getFeedbacks();
    } catch (e) {
      return INITIAL_FEEDBACKS;
    }
  }

  static async submitFeedback(feedback) {
    return await API.submitFeedback(feedback);
  }

  // Sampradaya Traditions from SQLite DB (Admin Control)
  static async getSampradayas() {
    try {
      const list = await API.getSampradayas();
      if (Array.isArray(list) && list.length > 0) {
        return list;
      }
    } catch (e) {}
    return Object.values(SAMPRADAYA_MATRIX);
  }

  static async saveSampradaya(sampradaya) {
    if (sampradaya.id) {
      return await API.updateSampradaya(sampradaya.id, sampradaya);
    } else {
      return await API.createSampradaya(sampradaya);
    }
  }

  static async deleteSampradaya(id) {
    return await API.deleteSampradaya(id);
  }
}
