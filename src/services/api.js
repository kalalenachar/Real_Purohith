const API_BASE = '/api';

function getHeaders() {
  const token = localStorage.getItem('rp_auth_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const API = {
  // Authentication APIs
  async login(identifier, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    if (data.token) {
      localStorage.setItem('rp_auth_token', data.token);
    }
    return data;
  },

  async register(userData) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    if (data.token) {
      localStorage.setItem('rp_auth_token', data.token);
    }
    return data;
  },

  async getCurrentUser() {
    const token = localStorage.getItem('rp_auth_token');
    if (!token) return null;

    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getHeaders()
      });
      if (!res.ok) {
        localStorage.removeItem('rp_auth_token');
        return null;
      }
      const data = await res.json();
      return data.user;
    } catch (e) {
      return null;
    }
  },

  logout() {
    localStorage.removeItem('rp_auth_token');
  },

  async updateProfile(profileData) {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(profileData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update user profile');
    }
    return res.json();
  },

  // Acharya APIs
  async getPurohits() {
    const res = await fetch(`${API_BASE}/purohits`);
    if (!res.ok) throw new Error('Failed to fetch Acharyas');
    return res.json();
  },

  async createPurohit(purohit) {
    const res = await fetch(`${API_BASE}/purohits`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(purohit)
    });
    if (!res.ok) throw new Error('Failed to create Acharya');
    return res.json();
  },

  async updatePurohit(id, purohit) {
    const res = await fetch(`${API_BASE}/purohits/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(purohit)
    });
    if (!res.ok) throw new Error('Failed to update Acharya');
    return res.json();
  },

  async deletePurohit(id) {
    const res = await fetch(`${API_BASE}/purohits/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete Acharya');
    return res.json();
  },

  // Devotee APIs
  async getDevotees() {
    const res = await fetch(`${API_BASE}/devotees`);
    if (!res.ok) throw new Error('Failed to fetch Devotees');
    return res.json();
  },

  async addAncestor(devoteeId, ancestor) {
    const res = await fetch(`${API_BASE}/devotees/${devoteeId}/ancestors`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(ancestor)
    });
    if (!res.ok) throw new Error('Failed to add ancestor');
    return res.json();
  },

  async deleteAncestor(devoteeId, ancestorId) {
    const res = await fetch(`${API_BASE}/devotees/${devoteeId}/ancestors/${ancestorId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete ancestor');
    return res.json();
  },

  // Booking APIs
  async getBookings() {
    const res = await fetch(`${API_BASE}/bookings`);
    if (!res.ok) throw new Error('Failed to fetch Bookings');
    return res.json();
  },

  async createBooking(booking) {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(booking)
    });
    if (!res.ok) throw new Error('Failed to create booking');
    return res.json();
  },

  async updateBooking(id, bookingData) {
    const res = await fetch(`${API_BASE}/bookings/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(bookingData)
    });
    if (!res.ok) throw new Error('Failed to update booking details');
    return res.json();
  },

  async updateBookingStatus(id, status, location) {
    const res = await fetch(`${API_BASE}/bookings/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status, location })
    });
    if (!res.ok) throw new Error('Failed to update booking status');
    return res.json();
  },

  async clearAllMeetLinks() {
    const res = await fetch(`${API_BASE}/bookings/clear-links`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to clear meet links');
    return res.json();
  },

  async deleteBooking(id) {
    const res = await fetch(`${API_BASE}/bookings/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete booking');
    return res.json();
  },

  // Feedback APIs
  async getFeedbacks() {
    const res = await fetch(`${API_BASE}/feedbacks`);
    if (!res.ok) throw new Error('Failed to fetch feedbacks');
    return res.json();
  },

  async submitFeedback(feedback) {
    const res = await fetch(`${API_BASE}/feedbacks`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(feedback)
    });
    if (!res.ok) throw new Error('Failed to submit feedback');
    return res.json();
  },

  // SOS APIs
  async dispatchSOS(location) {
    const res = await fetch(`${API_BASE}/sos/dispatch`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ location })
    });
    if (!res.ok) throw new Error('Failed to dispatch SOS alert');
    return res.json();
  },

  // Sampradaya Traditions APIs (SQLite Database)
  async getSampradayas() {
    const res = await fetch(`${API_BASE}/sampradayas`);
    if (!res.ok) throw new Error('Failed to fetch sampradayas');
    return res.json();
  },

  async createSampradaya(sampradayaData) {
    const res = await fetch(`${API_BASE}/sampradayas`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(sampradayaData)
    });
    if (!res.ok) throw new Error('Failed to create sampradaya');
    return res.json();
  },

  async updateSampradaya(id, updateData) {
    const res = await fetch(`${API_BASE}/sampradayas/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updateData)
    });
    if (!res.ok) throw new Error('Failed to update sampradaya');
    return res.json();
  },

  async deleteSampradaya(id) {
    const res = await fetch(`${API_BASE}/sampradayas/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete sampradaya');
    return res.json();
  },

  // ── Database Admin Studio APIs ──
  async verifyAdminPassword(password) {
    const res = await fetch(`${API_BASE}/admin/db/verify-password`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Incorrect Admin password');
    }
    return res.json();
  },

  async getDbTables() {
    const res = await fetch(`${API_BASE}/admin/db/tables`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch DB tables');
    return res.json();
  },

  async getTableRows(tableName) {
    const res = await fetch(`${API_BASE}/admin/db/tables/${tableName}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`Failed to fetch rows for table ${tableName}`);
    return res.json();
  },

  async createDbRow(tableName, rowData) {
    const res = await fetch(`${API_BASE}/admin/db/tables/${tableName}/row`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(rowData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to insert row');
    }
    return res.json();
  },

  async updateDbRow(tableName, primaryKey, primaryValue, data) {
    const res = await fetch(`${API_BASE}/admin/db/tables/${tableName}/row`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ primaryKey, primaryValue, data })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update row');
    }
    return res.json();
  },

  async deleteDbRow(tableName, id, pk = 'id') {
    const res = await fetch(`${API_BASE}/admin/db/tables/${tableName}/row/${id}?pk=${pk}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to delete row');
    }
    return res.json();
  },

  async executeSql(sql) {
    const res = await fetch(`${API_BASE}/admin/db/execute`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ sql })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'SQL execution failed');
    }
    return res.json();
  }
};
