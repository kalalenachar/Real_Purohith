import React, { useState, useCallback } from 'react';
import {
  LayoutDashboard, Users, CalendarCheck, Star, Settings,
  LogOut, Plus, Edit2, Trash2, Check, X, Search,
  ShieldCheck, BookOpen, Wallet, Bell,
  CheckCircle2, AlertTriangle, Filter, Eye, RefreshCw, UserPlus,
  Phone, MapPin, Clock, Award
} from 'lucide-react';
import { DataStore } from '../services/store.js';
import { SAMPRADAYA_MATRIX, INITIAL_DEVOTEES, INITIAL_PUROHITS, INITIAL_BOOKINGS, INITIAL_FEEDBACKS } from '../services/systemData.js';

/* ──────────────────────────── helpers ─────────────────────────── */
const generateId = prefix => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div style={{
        background: '#111827', border: '1px solid rgba(220,38,38,0.4)', borderRadius: 20,
        padding: '28px 32px', maxWidth: 380, width: '100%',
        animation: 'fadeInUp 0.3s ease', boxShadow: '0 0 40px rgba(220,38,38,0.2)'
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(220,38,38,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={20} style={{ color: '#f87171' }} />
          </div>
          <h3 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 16, fontWeight: 700, color: '#f8fafc' }}>Confirm Action</h3>
        </div>
        <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6, marginBottom: 24 }}>{message}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost btn-sm" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger btn-sm" onClick={onConfirm}>Confirm Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────── Overview Tab ─────────────────────── */
function OverviewTab({ purohits = [], devotees = [], bookings = [], feedbacks = [] }) {
  const safePurohits = Array.isArray(purohits) ? purohits : [];
  const safeDevotees = Array.isArray(devotees) ? devotees : [];
  const safeBookings = Array.isArray(bookings) ? bookings : [];
  const safeFeedbacks = Array.isArray(feedbacks) ? feedbacks : [];

  const avgRating = safeFeedbacks.length
    ? (safeFeedbacks.reduce((acc, f) => {
        const vals = typeof f.ratings === 'object' ? Object.values(f.ratings) : [5];
        return acc + vals.reduce((a, b) => a + b, 0) / vals.length;
      }, 0) / safeFeedbacks.length).toFixed(2)
    : '4.92';

  const kpis = [
    { label: 'Total Purohits',    value: safePurohits.length,   icon: Users,         color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    { label: 'Total Devotees',    value: safeDevotees.length,   icon: BookOpen,      color: '#a78bfa', bg: 'rgba(139,92,246,0.1)' },
    { label: 'Active Bookings',   value: safeBookings.length,   icon: CalendarCheck, color: '#34d399', bg: 'rgba(16,185,129,0.1)' },
    { label: 'Reviews Received',  value: safeFeedbacks.length,  icon: Star,          color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
    { label: 'Avg Rating',        value: avgRating + ' ⭐', icon: Award,         color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
    { label: 'Platform Fee',      value: '0% Pure Bridge',  icon: Wallet,        color: '#34d399', bg: 'rgba(16,185,129,0.08)' },
  ];

  const recentBookings = safeBookings.slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
        {kpis.map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={i} className="kpi-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <span className="kpi-label">{k.label}</span>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: k.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} style={{ color: k.color }} />
                </div>
              </div>
              <div className="kpi-value" style={{ fontSize: typeof k.value === 'string' ? 16 : 28 }}>{k.value}</div>
            </div>
          );
        })}
      </div>

      {/* Sampradaya Matrix Summary */}
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 16, fontWeight: 700, color: '#f8fafc', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
          <ShieldCheck size={18} style={{ color: '#f59e0b' }} /> Multi-Sampradaya Taxonomy Coverage
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
          {Object.entries(SAMPRADAYA_MATRIX).map(([key, val]) => {
            const count = purohits.filter(p => p.sampradaya === key).length;
            return (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }}>
                {val.image ? (
                  <img src={val.image} alt={val.name} style={{ width: 26, height: 26, borderRadius: '50%', objectFit: 'contain' }} />
                ) : (
                  <span style={{ fontSize: 20 }}>{val.icon}</span>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{val.name}</div>
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{count} Acharya{count !== 1 ? 's' : ''}</div>
                </div>
                <span className={`badge badge-${key}`}>{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="card" style={{ padding: 24 }}>
        <div className="section-header" style={{ marginBottom: 16 }}>
          <div className="section-title" style={{ fontSize: 16 }}><CalendarCheck size={18} style={{ color: '#f59e0b' }} /> Recent Bookings</div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                {['ID', 'Devotee', 'Purohit', 'Ritual', 'Date', 'Dakshina', 'Status'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentBookings.map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '12px 12px', fontSize: 11, fontFamily: 'monospace', color: '#f59e0b' }}>{b.id}</td>
                  <td style={{ padding: '12px 12px', fontSize: 12, color: '#e2e8f0', whiteSpace: 'nowrap' }}>
                    {b.devoteeName} {b.devoteePhone && <span style={{ fontSize: 10, color: '#38bdf8', fontFamily: 'monospace' }}>({b.devoteePhone})</span>}
                  </td>
                  <td style={{ padding: '12px 12px', fontSize: 12, color: '#94a3b8', whiteSpace: 'nowrap' }}>{b.purohitName}</td>
                  <td style={{ padding: '12px 12px', fontSize: 12, color: '#94a3b8', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.ritualName}</td>
                  <td style={{ padding: '12px 12px', fontSize: 11, fontFamily: 'monospace', color: '#64748b', whiteSpace: 'nowrap' }}>{b.date}</td>
                  <td style={{ padding: '12px 12px', fontSize: 12, fontWeight: 700, color: '#34d399', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{b.dakshinaAmount}</td>
                  <td style={{ padding: '12px 12px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                      background: b.status === 'Scheduled' ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)',
                      color: b.status === 'Scheduled' ? '#fbbf24' : '#34d399',
                      border: `1px solid ${b.status === 'Scheduled' ? 'rgba(245,158,11,0.3)' : 'rgba(16,185,129,0.3)'}`
                    }}>{b.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────── Purohit Management Tab ────────────── */
function PurohitsTab({ purohits, onSave, onDelete }) {
  const [search, setSearch] = useState('');
  const [filterSampradaya, setFilterSampradaya] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [form, setForm] = useState({
    name: '', sampradaya: 'uttaradhi', mutt: '', vedaShakha: '', sutram: '',
    experienceYears: '', rating: 5.0, reviewsCount: 0,
    languages: '', specialties: '', trustScore: 95, status: 'Verified Acharya'
  });

  const filtered = purohits.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.mutt.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filterSampradaya === 'all' || p.sampradaya === filterSampradaya;
    return matchSearch && matchFilter;
  });

  const openNew = () => {
    setForm({ name: '', sampradaya: 'uttaradhi', mutt: '', vedaShakha: '', sutram: '', experienceYears: '', rating: 5.0, reviewsCount: 0, languages: '', specialties: '', trustScore: 95, status: 'Verified Acharya' });
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (p) => {
    setForm({
      ...p,
      languages: Array.isArray(p.languages) ? p.languages.join(', ') : p.languages,
      specialties: Array.isArray(p.specialties) ? p.specialties.join(', ') : p.specialties,
    });
    setEditingId(p.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.mutt.trim()) return;
    const purohit = {
      ...form,
      id: editingId || generateId('pur'),
      experienceYears: parseInt(form.experienceYears) || 0,
      rating: parseFloat(form.rating) || 5.0,
      reviewsCount: parseInt(form.reviewsCount) || 0,
      trustScore: parseInt(form.trustScore) || 95,
      languages: typeof form.languages === 'string' ? form.languages.split(',').map(s => s.trim()).filter(Boolean) : form.languages,
      specialties: typeof form.specialties === 'string' ? form.specialties.split(',').map(s => s.trim()).filter(Boolean) : form.specialties,
    };
    onSave(purohit, !!editingId);
    setShowForm(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input className="input" style={{ paddingLeft: 38 }} placeholder="Search Acharyas by name or mutt…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="select" style={{ width: 'auto', minWidth: 180 }} value={filterSampradaya} onChange={e => setFilterSampradaya(e.target.value)}>
          <option value="all">All Sampradayas</option>
          {Object.entries(SAMPRADAYA_MATRIX).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
        </select>
        <button className="btn btn-primary btn-sm" onClick={openNew} style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <UserPlus size={14} /> Add Acharya
        </button>
      </div>

      <p style={{ fontSize: 12, color: '#64748b' }}>Showing {filtered.length} of {purohits.length} Acharyas</p>

      {/* Purohit Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {filtered.map(p => {
          const sm = SAMPRADAYA_MATRIX[p.sampradaya];
          return (
            <div key={p.id} className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg,rgba(245,158,11,0.2),rgba(234,88,12,0.12))', border: '1px solid rgba(245,158,11,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                    {sm?.icon || '🧘'}
                  </div>
                  <div>
                    <h4 style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc', fontFamily: 'Outfit,sans-serif' }}>{p.name}</h4>
                    <span className={`badge badge-${p.sampradaya}`} style={{ marginTop: 4, fontSize: 10 }}>{p.mutt}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => openEdit(p)} style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', color: '#fbbf24', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Edit2 size={13} />
                  </button>
                  <button onClick={() => setConfirmDelete(p.id)} style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.25)', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: '#94a3b8' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{p.vedaShakha} · {p.sutram}</span>
                  <span style={{ color: '#fbbf24', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3 }}>⭐ {p.rating}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{p.experienceYears} yrs exp · {p.reviewsCount} reviews</span>
                  <span style={{ color: '#34d399', fontFamily: 'monospace', fontSize: 11, fontWeight: 700 }}>{p.trustScore}% Trust</span>
                </div>
                <div className="progress-track" style={{ marginTop: 4 }}>
                  <div className="progress-bar" style={{ width: `${p.trustScore}%`, background: p.trustScore >= 98 ? 'linear-gradient(90deg,#10b981,#34d399)' : 'linear-gradient(90deg,#f59e0b,#ea580c)' }} />
                </div>
                <p style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>{p.status}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div style={{ padding: '24px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: 18, fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#f8fafc' }}>
                {editingId ? '✏️ Edit Acharya' : '➕ Add New Acharya'}
              </h3>
              <button onClick={() => setShowForm(false)} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 8, padding: 7, cursor: 'pointer', color: '#94a3b8', display: 'flex' }}><X size={16} /></button>
            </div>
            <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {[
                  { label: 'Full Name *', key: 'name', placeholder: 'Vidwan Raghavendra Acharya' },
                  { label: 'Mutt Affiliation *', key: 'mutt', placeholder: 'Uttaradhi Mutt' },
                  { label: 'Veda Shakha', key: 'vedaShakha', placeholder: 'Rigveda' },
                  { label: 'Sutram', key: 'sutram', placeholder: 'Ashvalayana Sutram' },
                  { label: 'Experience (Years)', key: 'experienceYears', placeholder: '15', type: 'number' },
                  { label: 'Trust Score (0–100)', key: 'trustScore', placeholder: '95', type: 'number' },
                  { label: 'Rating (0–5)', key: 'rating', placeholder: '4.9', type: 'number', step: '0.1' },
                  { label: 'Reviews Count', key: 'reviewsCount', placeholder: '0', type: 'number' },
                ].map(f => (
                  <div key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8' }}>{f.label}</label>
                    <input className="input" type={f.type || 'text'} step={f.step} placeholder={f.placeholder}
                      value={form[f.key]} onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8' }}>Sampradaya</label>
                  <select className="select" value={form.sampradaya} onChange={e => setForm(v => ({ ...v, sampradaya: e.target.value }))}>
                    {Object.entries(SAMPRADAYA_MATRIX).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8' }}>Verification Status</label>
                  <select className="select" value={form.status} onChange={e => setForm(v => ({ ...v, status: e.target.value }))}>
                    {['Verified Acharya', 'Verified Master Acharya', 'High-Level Orthodox Veda Rathna', 'Verified Modern Acharya', 'Pending Verification'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8' }}>Languages (comma-separated)</label>
                <input className="input" placeholder="Kannada, Sanskrit, Telugu, English" value={form.languages} onChange={e => setForm(v => ({ ...v, languages: e.target.value }))} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8' }}>Specialties (comma-separated)</label>
                <input className="input" placeholder="Satyanarayana Pooja, Shraaddha Karma, Homam" value={form.specialties} onChange={e => setForm(v => ({ ...v, specialties: e.target.value }))} />
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
                <button className="btn btn-primary btn-sm" onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Check size={14} /> {editingId ? 'Save Changes' : 'Add Acharya'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      {confirmDelete && (
        <ConfirmDialog
          message={`Are you sure you want to remove this Acharya? This action cannot be undone.`}
          onConfirm={() => { onDelete(confirmDelete); setConfirmDelete(null); }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}

/* ──────────────────────────── Edit Booking Modal ───────────────── */
function EditBookingModal({ booking, purohits = [], onClose, onSave }) {
  const [devoteeName, setDevoteeName] = useState(booking.devoteeName || '');
  const [devoteePhone, setDevoteePhone] = useState(booking.devoteePhone || '');
  const [dakshinaAmount, setDakshinaAmount] = useState(booking.dakshinaAmount || '');
  const [sampradaya, setSampradaya] = useState(booking.sampradaya || 'secular');
  const [date, setDate] = useState(booking.date || '');
  const [muhurtaTime, setMuhurtaTime] = useState(booking.muhurtaTime || '');
  const [purohitId, setPurohitId] = useState(booking.purohitId || 'unassigned');
  const [samagriMode, setSamagriMode] = useState(booking.samagriMode || '');
  const [location, setLocation] = useState(booking.location || '');
  const [status, setStatus] = useState(booking.status || 'Pending Admin Review');
  const [isApara, setIsApara] = useState(Boolean(booking.isAparaKaryam));
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const selectedPurohit = purohits.find(p => p.id === purohitId);
    const purohitName = selectedPurohit ? selectedPurohit.name : (purohitId === 'unassigned' ? 'Pending Admin Assignment' : booking.purohitName);

    const updatedData = {
      devoteeName,
      devoteePhone,
      dakshinaAmount,
      sampradaya,
      date,
      muhurtaTime,
      purohitId,
      purohitName,
      samagriMode,
      location,
      status,
      isAparaKaryam: isApara
    };

    try {
      await onSave(booking.id, updatedData);
      onClose();
    } catch (err) {
      alert('Failed to save booking edits: ' + err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="card-premium" style={{ maxWidth: 640, width: '100%', padding: 28, borderRadius: 20 }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div>
            <h3 style={{ fontSize: 18, fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#f8fafc' }}>
              ✏️ Edit Booking Requirement Details ({booking.id})
            </h3>
            <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
              Update Dakshina, Muhurtam, Sampradaya, Assigned Acharya & Location after discussion with party.
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#94a3b8', borderRadius: 8, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* User Name & Mobile Number */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, color: '#fbbf24', fontWeight: 700, display: 'block', marginBottom: 4 }}>Devotee Full Name</label>
              <input type="text" className="input" value={devoteeName} onChange={e => setDevoteeName(e.target.value)} required />
            </div>
            <div>
              <label style={{ fontSize: 11, color: '#fbbf24', fontWeight: 700, display: 'block', marginBottom: 4 }}>Contact Mobile Number</label>
              <input type="text" className="input" value={devoteePhone} onChange={e => setDevoteePhone(e.target.value)} placeholder="e.g. +91 9876543210" required />
            </div>
          </div>

          {/* Dakshina Amount & Booking Status */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, color: '#fbbf24', fontWeight: 700, display: 'block', marginBottom: 4 }}>Confirmed Dakshina Honorarium</label>
              <input type="text" className="input" value={dakshinaAmount} onChange={e => setDakshinaAmount(e.target.value)} placeholder="e.g. ₹4,000 (Confirmed)" required />
            </div>
            <div>
              <label style={{ fontSize: 11, color: '#fbbf24', fontWeight: 700, display: 'block', marginBottom: 4 }}>Booking Status</label>
              <select className="select" value={status} onChange={e => setStatus(e.target.value)}>
                <option value="Pending Admin Review">⚡ Pending Admin Review</option>
                <option value="Confirmed">✅ Confirmed</option>
                <option value="Scheduled">📅 Scheduled</option>
                <option value="In Progress">🔥 In Progress</option>
                <option value="Completed">🎉 Completed</option>
                <option value="Cancelled">❌ Cancelled</option>
              </select>
            </div>
          </div>

          {/* Sampradaya Lineage & Assigned Acharya */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, color: '#fbbf24', fontWeight: 700, display: 'block', marginBottom: 4 }}>Sampradaya Tradition</label>
              <select className="select" value={sampradaya} onChange={e => setSampradaya(e.target.value)}>
                {Object.entries(SAMPRADAYA_MATRIX).map(([key, item]) => (
                  <option key={key} value={key}>{item.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, color: '#fbbf24', fontWeight: 700, display: 'block', marginBottom: 4 }}>Assigned Purohit / Acharya</label>
              <select className="select" value={purohitId} onChange={e => setPurohitId(e.target.value)}>
                <option value="unassigned">⏳ Unassigned (Pending Admin Assignment)</option>
                {purohits.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.mutt || p.sampradaya})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Muhurta Time */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, color: '#fbbf24', fontWeight: 700, display: 'block', marginBottom: 4 }}>Sacred Date</label>
              <input type="date" className="input" value={date} onChange={e => setDate(e.target.value)} required />
            </div>
            <div>
              <label style={{ fontSize: 11, color: '#fbbf24', fontWeight: 700, display: 'block', marginBottom: 4 }}>Muhurta Time Slot</label>
              <select className="select" value={muhurtaTime} onChange={e => setMuhurtaTime(e.target.value)}>
                <option value="Pending Discussion with Admin">Pending Discussion with Admin</option>
                <option value="05:30 AM – 07:30 AM (Brahma Muhurtam)">05:30 AM – 07:30 AM (Brahma Muhurtam)</option>
                <option value="06:30 AM – 09:00 AM (Pratah Kala)">06:30 AM – 09:00 AM (Pratah Kala)</option>
                <option value="11:45 AM – 12:30 PM (Abhijit Muhurtam)">11:45 AM – 12:30 PM (Abhijit Muhurtam)</option>
                <option value="05:30 PM – 07:30 PM (Sayam Kala)">05:30 PM – 07:30 PM (Sayam Kala)</option>
              </select>
            </div>
          </div>

          {/* Samagri Mode */}
          <div>
            <label style={{ fontSize: 11, color: '#fbbf24', fontWeight: 700, display: 'block', marginBottom: 4 }}>Pooja Samagri Logistics</label>
            <select className="select" value={samagriMode} onChange={e => setSamagriMode(e.target.value)}>
              <option value="Pandit Hand-Carried Custom Kit (100% Pure Dravya)">Pandit Hand-Carried Kit</option>
              <option value="Householder Self-Arranged Dravya (Vedic Checklist Emailed)">Householder Self-Arranged</option>
              <option value="Pending Admin Call (Pandit Kit vs Self-Arranged)">Pending Admin Call</option>
            </select>
          </div>

          {/* Location / Google Meet URL */}
          <div>
            <label style={{ fontSize: 11, color: '#fbbf24', fontWeight: 700, display: 'block', marginBottom: 4 }}>Venue Address / Google Meet Link / Directions</label>
            <input type="text" className="input" value={location} onChange={e => setLocation(e.target.value)} placeholder="Venue address or https://meet.google.com/xyz" required />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={submitting}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving Changes...' : 'Save Booking Modifications'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ──────────────────────────── Bookings Tab ─────────────────────── */
function BookingsTab({ bookings, purohits = [], onUpdateStatus, onUpdateBooking, onDelete, onClearAllMeetLinks }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);
  const [meetInputs, setMeetInputs] = useState({});

  const filtered = bookings.filter(b => {
    const matchSearch = b.devoteeName.toLowerCase().includes(search.toLowerCase()) ||
      (b.purohitName || '').toLowerCase().includes(search.toLowerCase()) ||
      b.ritualName.toLowerCase().includes(search.toLowerCase()) ||
      b.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusList = ['all', 'Pending Admin Review', 'Scheduled', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];

  const handleSendMeetLink = (bId, currentStatus) => {
    const meetUrl = meetInputs[bId] || 'https://meet.google.com/real-purohit-seva';
    onUpdateStatus(bId, currentStatus, meetUrl);
  };

  const handleClearMeetLink = (bId, currentStatus) => {
    onUpdateStatus(bId, currentStatus, 'In-App Vault Delivery (Link Cleared)');
    setMeetInputs(prev => ({ ...prev, [bId]: '' }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header Banner */}
      <div style={{ padding: '16px 20px', borderRadius: 16, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h3 style={{ fontSize: 16, fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#f8fafc' }}>
            📥 Incoming User Booking Requests
          </h3>
          <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
            All ritual requests land at Admin Desk. Admin controls Google Meet link dispatch and time-based link clearing.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {onClearAllMeetLinks && (
            <button
              className="btn btn-sm btn-danger"
              onClick={onClearAllMeetLinks}
              style={{ fontSize: 11, padding: '6px 14px', borderRadius: 10 }}
            >
              🧹 Clear All Active Meet Links
            </button>
          )}
          <span style={{ fontSize: 12, padding: '4px 12px', borderRadius: 20, background: '#f59e0b', color: '#1a0a00', fontWeight: 800 }}>
            {bookings.filter(b => b.status === 'Pending Admin Review' || b.purohitId === 'unassigned').length} Pending Requests
          </span>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input className="input" style={{ paddingLeft: 38 }} placeholder="Search by devotee, ritual, or ID…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="select" style={{ width: 'auto', minWidth: 180 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          {statusList.map(s => <option key={s} value={s}>{s === 'all' ? 'All Request Statuses' : s}</option>)}
        </select>
      </div>

      <p style={{ fontSize: 12, color: '#64748b' }}>Showing {filtered.length} of {bookings.length} user booking requests</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(b => {
          const sm = SAMPRADAYA_MATRIX[b.sampradaya];
          const isPending = b.status === 'Pending Admin Review' || b.purohitId === 'unassigned';
          const hasMeetUrl = Boolean(b.location && (b.location.startsWith('http://') || b.location.startsWith('https://')));

          return (
            <div key={b.id} className="card" style={{ padding: '18px 22px', borderLeft: isPending ? '4px solid #f59e0b' : '4px solid #10b981' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                <div style={{ flex: 1, minWidth: 240 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#f59e0b', fontWeight: 700 }}>{b.id}</span>
                    {sm && (
                      <span className={`badge badge-${b.sampradaya}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        {sm.image ? <img src={sm.image} alt="" style={{ width: 14, height: 14, borderRadius: '50%', objectFit: 'contain' }} /> : sm.icon}
                        {sm.name.split(' ')[0]}
                      </span>
                    )}
                    {isPending && <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 20, background: '#f59e0b', color: '#1a0a00', fontWeight: 800 }}>⚡ PENDING ADMIN REVIEW</span>}
                    {b.isAparaKaryam ? <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 20, background: '#dc2626', color: 'white', fontWeight: 700 }}>APARA</span> : null}
                  </div>
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc', fontFamily: 'Outfit,sans-serif', marginBottom: 6 }}>{b.ritualName}</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px', fontSize: 12, color: '#94a3b8' }}>
                    <span>👤 User: <strong style={{ color: '#e2e8f0' }}>{b.devoteeName}</strong> {b.devoteePhone && <span style={{ color: '#38bdf8', fontWeight: 700 }}> (📞 {b.devoteePhone})</span>}</span>
                    <span>🪔 Status: <strong style={{ color: isPending ? '#fbbf24' : '#34d399' }}>{b.purohitName || 'Pending Admin Assignment'}</strong></span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={11} /> {b.date} · {b.muhurtaTime}</span>
                  </div>
                  <p style={{ fontSize: 12, color: '#64748b', marginTop: 6 }}>Logistics: {b.samagriMode}</p>
                  <p style={{ fontSize: 12, color: '#fcd34d', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    📍 Venue & Directions: {b.location}
                  </p>
                  
                  {/* Google Meet Link Dispatch & Clear Controls */}
                  <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11, color: '#38bdf8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Video size={12} /> Google Meet Link:
                    </span>
                    <input
                      type="text"
                      className="input"
                      style={{ fontSize: 11, padding: '4px 10px', height: 30, flex: 1, minWidth: 220 }}
                      value={meetInputs[b.id] !== undefined ? meetInputs[b.id] : (hasMeetUrl ? b.location : '')}
                      placeholder="Enter Google Meet link (e.g. https://meet.google.com/xyz-pdqr-abc)"
                      onChange={e => setMeetInputs({ ...meetInputs, [b.id]: e.target.value })}
                    />
                    <button
                      className="btn btn-sm"
                      style={{ background: '#10b981', color: 'white', fontSize: 11, padding: '4px 12px' }}
                      onClick={() => handleSendMeetLink(b.id, b.status)}
                    >
                      🚀 Dispatch Link
                    </button>
                    {hasMeetUrl && (
                      <button
                        className="btn btn-sm btn-ghost"
                        style={{ color: '#f87171', fontSize: 11, padding: '4px 10px', borderColor: 'rgba(220,38,38,0.3)' }}
                        onClick={() => handleClearMeetLink(b.id, b.status)}
                      >
                        ❌ Clear Link
                      </button>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#34d399', fontFamily: 'monospace' }}>{b.dakshinaAmount}</div>
                  <span style={{ fontSize: 10, color: '#64748b' }}>{b.dakshinaStatus}</span>

                  {/* Admin Action Status Selector */}
                  <select className="select" style={{ width: 'auto', padding: '6px 12px', fontSize: 11, background: isPending ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)', borderColor: isPending ? '#f59e0b' : '#10b981', color: isPending ? '#fbbf24' : '#34d399', fontWeight: 700 }}
                    value={b.status}
                    onChange={e => onUpdateStatus(b.id, e.target.value)}>
                    {['Pending Admin Review', 'Scheduled', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'].map(s =>
                      <option key={s} value={s}>{s}</option>)}
                  </select>

                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <button
                      onClick={() => setEditingBooking(b)}
                      style={{ padding: '5px 12px', borderRadius: 8, background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', color: '#fbbf24', cursor: 'pointer', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}
                    >
                      <Edit2 size={12} /> Edit Details
                    </button>
                    <button onClick={() => setConfirmDelete(b.id)}
                      style={{ padding: '5px 10px', borderRadius: 8, background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.25)', color: '#f87171', cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {editingBooking && (
        <EditBookingModal
          booking={editingBooking}
          purohits={purohits}
          onClose={() => setEditingBooking(null)}
          onSave={onUpdateBooking}
        />
      )}

      {confirmDelete && (
        <ConfirmDialog
          message="Are you sure you want to delete this booking request record?"
          onConfirm={() => { onDelete(confirmDelete); setConfirmDelete(null); }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}

/* ──────────────────────────── Devotees Tab ─────────────────────── */
function DevoteesTab({ devotees, onDelete }) {
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = devotees.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.gotram.toLowerCase().includes(search.toLowerCase()) ||
    d.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ position: 'relative', maxWidth: 400 }}>
        <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
        <input className="input" style={{ paddingLeft: 38 }} placeholder="Search devotees…"
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <p style={{ fontSize: 12, color: '#64748b' }}>Showing {filtered.length} of {devotees.length} devotees</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {filtered.map(d => {
          const sm = SAMPRADAYA_MATRIX[d.sampradaya];
          return (
            <div key={d.id} className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg,rgba(124,58,237,0.2),rgba(245,158,11,0.1))', border: '1px solid rgba(124,58,237,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🕉️</div>
                  <div>
                    <h4 style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc', fontFamily: 'Outfit,sans-serif' }}>{d.name}</h4>
                    {sm && (
                      <span className={`badge badge-${d.sampradaya}`} style={{ marginTop: 4, fontSize: 10, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        {sm.image ? <img src={sm.image} alt="" style={{ width: 12, height: 12, borderRadius: '50%', objectFit: 'contain' }} /> : sm.icon}
                        {sm.name.split(' ')[0]}
                      </span>
                    )}
                  </div>
                </div>
                <button onClick={() => setConfirmDelete(d.id)}
                  style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Trash2 size={13} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 12, color: '#94a3b8' }}>
                <div><span style={{ color: '#64748b' }}>Gotram:</span> {d.gotram}</div>
                <div><span style={{ color: '#64748b' }}>Shakha:</span> {d.vedaShakha} · {d.sutram}</div>
                <div><span style={{ color: '#64748b' }}>Kula Daivam:</span> {d.kulaDaivam}</div>
                {d.location && <div><span style={{ color: '#64748b' }}>Location:</span> {d.location}</div>}
                <div style={{ marginTop: 6, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ color: '#64748b' }}>Ancestors:</span>{' '}
                  <span style={{ color: '#fbbf24' }}>{d.ancestors?.length || 0} entries</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {confirmDelete && (
        <ConfirmDialog
          message="Are you sure you want to remove this devotee record? All associated ancestor data will be lost."
          onConfirm={() => { onDelete(confirmDelete); setConfirmDelete(null); }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}

/* ──────────────────────────── Reviews Tab ──────────────────────── */
function ReviewsTab({ feedbacks, onDelete }) {
  const [search, setSearch] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = feedbacks.filter(f => {
    const matchSearch = f.purohitName.toLowerCase().includes(search.toLowerCase()) ||
      f.devoteeName.toLowerCase().includes(search.toLowerCase()) ||
      (f.reviewText || '').toLowerCase().includes(search.toLowerCase());
    const matchSentiment = sentimentFilter === 'all' || (f.aiSentiment || '').includes(sentimentFilter);
    return matchSearch && matchSentiment;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input className="input" style={{ paddingLeft: 38 }} placeholder="Search reviews…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="select" style={{ width: 'auto', minWidth: 160 }} value={sentimentFilter} onChange={e => setSentimentFilter(e.target.value)}>
          <option value="all">All Sentiments</option>
          <option value="Extremely Positive">Extremely Positive</option>
          <option value="Positive">Positive</option>
          <option value="Alert">Alert / Action Required</option>
        </select>
      </div>

      <p style={{ fontSize: 12, color: '#64748b' }}>Showing {filtered.length} of {feedbacks.length} reviews</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map((fb, i) => {
          const sm = SAMPRADAYA_MATRIX[fb.sampradaya];
          const avg = typeof fb.ratings === 'object'
            ? (Object.values(fb.ratings).reduce((a, b) => a + b, 0) / Object.values(fb.ratings).length).toFixed(1)
            : '5.0';
          return (
            <div key={fb.id || i} className="card" style={{ padding: '18px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#f59e0b' }}>{fb.id}</span>
                    {sm && (
                      <span className={`badge badge-${fb.sampradaya}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        {sm.image ? <img src={sm.image} alt="" style={{ width: 14, height: 14, borderRadius: '50%', objectFit: 'contain' }} /> : sm.icon}
                        {sm.name.split(' ')[0]}
                      </span>
                    )}
                    <span style={{
                      fontSize: 10, padding: '2px 10px', borderRadius: 20, fontWeight: 700,
                      background: (fb.aiSentiment || '').includes('Alert') ? 'rgba(220,38,38,0.15)' : 'rgba(16,185,129,0.12)',
                      color: (fb.aiSentiment || '').includes('Alert') ? '#f87171' : '#34d399',
                      border: `1px solid ${(fb.aiSentiment || '').includes('Alert') ? 'rgba(220,38,38,0.3)' : 'rgba(16,185,129,0.25)'}`
                    }}>{fb.aiSentiment || 'Positive'}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#94a3b8', marginBottom: 8, flexWrap: 'wrap' }}>
                    <span>🧘 {fb.purohitName}</span>
                    <span>👤 {fb.devoteeName}</span>
                    <span>📅 {fb.dateSubmitted}</span>
                  </div>
                  <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 14, fontStyle: 'italic', color: '#e2e8f0', lineHeight: 1.6 }}>
                    "{fb.reviewText}"
                  </p>
                  {fb.sampradayaPaddhatiAccuracy && (
                    <p style={{ fontSize: 11, color: '#34d399', marginTop: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <CheckCircle2 size={12} /> {fb.sampradayaPaddhatiAccuracy}
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end', flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(245,158,11,0.1)', padding: '5px 12px', borderRadius: 20, border: '1px solid rgba(245,158,11,0.2)' }}>
                    <Star size={13} style={{ fill: '#fbbf24', color: '#fbbf24' }} />
                    <span style={{ fontSize: 15, fontWeight: 800, color: '#fbbf24', fontFamily: 'monospace' }}>{avg}</span>
                  </div>
                  <button onClick={() => setConfirmDelete(fb.id || i)}
                    style={{ padding: '4px 10px', borderRadius: 8, background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.25)', color: '#f87171', cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Trash2 size={12} /> Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {confirmDelete !== null && (
        <ConfirmDialog
          message="Are you sure you want to delete this review?"
          onConfirm={() => { onDelete(confirmDelete); setConfirmDelete(null); }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}

/* ──────────────────────────── Settings Tab ─────────────────────── */
function SettingsTab() {
  return (
    <div style={{ maxWidth: 680, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="card" style={{ padding: 28 }}>
        <h3 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 17, fontWeight: 800, color: '#f8fafc', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
          <ShieldCheck size={20} style={{ color: '#34d399' }} /> System Security & Database Integrity
        </h3>
        <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6, marginBottom: 20 }}>
          Real-Purohit operates with strict database persistence, hashed credential security, and 0% platform commission controls. Production database data is protected from unauthorized resets.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Database Engine</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc', marginTop: 4 }}>SQLite (WAL Mode Enabled)</div>
            <div style={{ fontSize: 11, color: '#34d399', marginTop: 4 }}>● Connected (`server/database.db`)</div>
          </div>

          <div style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Password Encryption</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc', marginTop: 4 }}>Bcrypt Hashing (10 rounds)</div>
            <div style={{ fontSize: 11, color: '#fbbf24', marginTop: 4 }}>● High Security Salt Active</div>
          </div>

          <div style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Session Protocol</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc', marginTop: 4 }}>JSON Web Token (JWT)</div>
            <div style={{ fontSize: 11, color: '#38bdf8', marginTop: 4 }}>● 24-Hour Token Lifetime</div>
          </div>

          <div style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Platform Honorarium Policy</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#34d399', marginTop: 4 }}>0% Platform Commission</div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>100% Direct Scholar Dakshina</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────── Sampradayas Tab ───────────────────── */
function SampradayasTab({ sampradayas = [], onRefresh }) {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ id: '', name: '', badgeClass: 'badge-secular', description: '', icon: '🛕' });
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const handleEdit = (samp) => {
    setEditing(samp);
    setForm({ id: samp.id, name: samp.name, badgeClass: samp.badgeClass || 'badge-secular', description: samp.description || '', icon: samp.icon || '🛕' });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await DataStore.saveSampradaya(form);
    setEditing(null);
    setForm({ id: '', name: '', badgeClass: 'badge-secular', description: '', icon: '🛕' });
    onRefresh();
  };

  const handleDelete = async (id) => {
    await DataStore.deleteSampradaya(id);
    setDeleteConfirmId(null);
    onRefresh();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: 20, fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#f8fafc' }}>Vedic Sampradaya Traditions</h2>
          <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Directly stored in SQLite Database under Admin Control</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => { setEditing('new'); setForm({ id: '', name: '', badgeClass: 'badge-secular', description: '', icon: '🛕' }); }}>
          <Plus size={14} /> Add Sampradaya Tradition
        </button>
      </div>

      {editing && (
        <form onSubmit={handleSave} className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h3 style={{ fontSize: 15, fontFamily: 'Outfit,sans-serif', fontWeight: 700, color: '#fbbf24' }}>
            {editing === 'new' ? 'Create New Sampradaya Tradition' : `Edit ${editing.name}`}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, color: '#94a3b8' }}>ID Identifier</label>
              <input className="input" value={form.id} disabled={editing !== 'new'} onChange={e => setForm({...form, id: e.target.value})} placeholder="e.g. kanchi-mutt" required />
            </div>
            <div>
              <label style={{ fontSize: 11, color: '#94a3b8' }}>Tradition Name</label>
              <input className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Kanchi Kamakoti Peetham" required />
            </div>
            <div>
              <label style={{ fontSize: 11, color: '#94a3b8' }}>Icon Emoji</label>
              <input className="input" value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} placeholder="🛕" />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 11, color: '#94a3b8' }}>Lineage Description</label>
            <input className="input" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Brief lineage description" />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 10 }}>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEditing(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-sm">Save Tradition to Database</button>
          </div>
        </form>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {sampradayas.map(s => (
          <div key={s.id} className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                {s.image ? (
                  <img src={s.image} alt={s.name} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'contain' }} />
                ) : (
                  <span style={{ fontSize: 24 }}>{s.icon}</span>
                )}
                <span className={`badge ${s.badgeClass || 'badge-secular'}`}>{s.id}</span>
              </div>
              <h4 style={{ fontSize: 15, fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#f8fafc' }}>{s.name}</h4>
              <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 6, lineHeight: 1.5 }}>{s.description}</p>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 16, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)', justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(s)}><Edit2 size={12} /> Edit</button>
              <button className="btn btn-danger btn-sm" onClick={() => setDeleteConfirmId(s.id)}><Trash2 size={12} /> Delete</button>
            </div>
          </div>
        ))}
      </div>

      {deleteConfirmId && (
        <ConfirmDialog
          message={`Are you sure you want to delete Sampradaya tradition "${deleteConfirmId}" from the SQLite database?`}
          onConfirm={() => handleDelete(deleteConfirmId)}
          onCancel={() => setDeleteConfirmId(null)}
        />
      )}
    </div>
  );
}

/* ──────────────────────────── MAIN ADMIN PANEL ─────────────────── */
export default function AdminPanel({ auth, onLogout, onSwitchToPublic }) {
  const [activeTab, setActiveTab] = useState('overview');

  const [purohits, setPurohits] = useState(INITIAL_PUROHITS);
  const [devotees, setDevotees] = useState(INITIAL_DEVOTEES);
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [feedbacks, setFeedbacks] = useState(INITIAL_FEEDBACKS);
  const [sampradayas, setSampradayas] = useState([]);

  const loadSampradayas = useCallback(() => {
    DataStore.getSampradayas().then(res => { if (Array.isArray(res)) setSampradayas(res); });
  }, []);

  // Fetch live from database API on mount
  React.useEffect(() => {
    DataStore.getPurohits().then(res => { if (Array.isArray(res)) setPurohits(res); });
    DataStore.getDevotees().then(res => { if (Array.isArray(res)) setDevotees(res); });
    DataStore.getBookings().then(res => { if (Array.isArray(res)) setBookings(res); });
    DataStore.getFeedbacks().then(res => { if (Array.isArray(res)) setFeedbacks(res); });
    loadSampradayas();
  }, [loadSampradayas]);

  // CRUD handlers updating state & backend
  const handleSavePurohit = useCallback(async (purohit, isEdit) => {
    await DataStore.savePurohit(purohit);
    const updated = await DataStore.getPurohits();
    if (Array.isArray(updated)) setPurohits(updated);
  }, []);

  const handleDeletePurohit = useCallback(async (id) => {
    await DataStore.deletePurohit(id);
    const updated = await DataStore.getPurohits();
    if (Array.isArray(updated)) setPurohits(updated);
  }, []);

  const handleUpdateBookingStatus = useCallback(async (id, status, location) => {
    await DataStore.updateBookingStatus(id, status, location);
    const updated = await DataStore.getBookings();
    if (Array.isArray(updated)) setBookings(updated);
  }, []);

  const handleUpdateBookingDetails = useCallback(async (id, bookingData) => {
    await DataStore.updateBooking(id, bookingData);
    const updated = await DataStore.getBookings();
    if (Array.isArray(updated)) setBookings(updated);
  }, []);

  const handleClearAllMeetLinks = useCallback(async () => {
    if (window.confirm('Clear all active Google Meet links across all user bookings in SQLite database?')) {
      await DataStore.clearAllMeetLinks();
      const updated = await DataStore.getBookings();
      if (Array.isArray(updated)) setBookings(updated);
    }
  }, []);

  const handleDeleteBooking = useCallback(async (id) => {
    await DataStore.deleteBooking(id);
    const updated = await DataStore.getBookings();
    if (Array.isArray(updated)) setBookings(updated);
  }, []);

  // Devotee ops
  const handleDeleteDevotee = useCallback((id) => {
    setDevotees(prev => prev.filter(d => d.id !== id));
  }, []);

  // Review ops
  const handleDeleteReview = useCallback((idOrIdx) => {
    setFeedbacks(prev => prev.filter((f, i) => f.id !== idOrIdx && i !== idOrIdx));
  }, []);

  // Reset to initial system seed data
  const handleResetData = useCallback(async () => {
    setPurohits(INITIAL_PUROHITS);
    setDevotees(INITIAL_DEVOTEES);
    setBookings(INITIAL_BOOKINGS);
    setFeedbacks(INITIAL_FEEDBACKS);
  }, []);

  const SIDEBAR_ITEMS = [
    { id: 'overview',     label: 'Overview',              icon: LayoutDashboard },
    { id: 'bookings',     label: 'User Booking Requests', icon: CalendarCheck },
    { id: 'sampradayas',  label: 'Sampradaya Traditions', icon: Award },
    { id: 'purohits',     label: 'Acharya Directory',     icon: Users },
    { id: 'devotees',     label: 'Devotee Records',       icon: BookOpen },
    { id: 'reviews',      label: 'Reviews & Feedback',    icon: Star },
    { id: 'settings',     label: 'Settings',              icon: Settings },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#050810' }}>
      {/* ── Sidebar ── */}
      <aside style={{
        width: 240, background: 'rgba(8,12,23,0.97)', borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 50
      }}>
        {/* Brand */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: 'linear-gradient(135deg,#f59e0b,#ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>🪔</div>
            <div>
              <div style={{ fontSize: 14, fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#f8fafc' }}>REAL-PUROHIT</div>
              <div style={{ fontSize: 10, color: '#64748b' }}>Admin Console</div>
            </div>
          </div>
          {/* Admin User Badge */}
          <div style={{ padding: '10px 12px', borderRadius: 12, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 22 }}>{auth?.user?.avatar || '👑'}</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#f8fafc' }}>{auth?.user?.name || 'Administrator'}</div>
                <div style={{ fontSize: 10, color: '#f59e0b', fontFamily: 'monospace', fontWeight: 700 }}>● ADMIN</div>
              </div>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {SIDEBAR_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button key={item.id} onClick={() => setActiveTab(item.id)} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
                fontFamily: 'Outfit,sans-serif', fontSize: 13, fontWeight: isActive ? 700 : 500,
                textAlign: 'left',
                background: isActive ? 'rgba(245,158,11,0.12)' : 'transparent',
                color: isActive ? '#fbbf24' : '#64748b',
                borderLeft: isActive ? '2px solid #f59e0b' : '2px solid transparent',
                transition: 'all 0.2s'
              }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#94a3b8'; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; } }}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <button onClick={onSwitchToPublic} style={{
            width: '100%', padding: '9px 12px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)',
            background: 'transparent', color: '#64748b', cursor: 'pointer', fontSize: 12, fontFamily: 'Outfit,sans-serif',
            display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s'
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#94a3b8'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}>
            <Eye size={14} /> View Public App
          </button>
          <button onClick={onLogout} style={{
            width: '100%', padding: '9px 12px', borderRadius: 10, border: '1px solid rgba(220,38,38,0.2)',
            background: 'rgba(220,38,38,0.06)', color: '#f87171', cursor: 'pointer', fontSize: 12, fontFamily: 'Outfit,sans-serif',
            display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s'
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.12)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.06)'; }}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div style={{ flex: 1, marginLeft: 240, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Top Header */}
        <header style={{
          height: 60, background: 'rgba(8,12,23,0.95)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '0 32px', position: 'sticky', top: 0, zIndex: 40
        }}>
          <div>
            <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 17, fontWeight: 800, color: '#f8fafc' }}>
              {SIDEBAR_ITEMS.find(s => s.id === activeTab)?.label || 'Admin Panel'}
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ padding: '4px 12px', borderRadius: 20, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', fontSize: 11, color: '#34d399', fontFamily: 'monospace', fontWeight: 700 }}>
              ● LIVE
            </div>
            <span style={{ fontSize: 12, color: '#64748b' }}>{new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          {activeTab === 'overview' && (
            <OverviewTab purohits={purohits} devotees={devotees} bookings={bookings} feedbacks={feedbacks} />
          )}
          {activeTab === 'sampradayas' && (
            <SampradayasTab sampradayas={sampradayas} onRefresh={loadSampradayas} />
          )}
          {activeTab === 'purohits' && (
            <PurohitsTab purohits={purohits} onSave={handleSavePurohit} onDelete={handleDeletePurohit} />
          )}
          {activeTab === 'bookings' && (
            <BookingsTab
              bookings={bookings}
              purohits={purohits}
              onUpdateStatus={handleUpdateBookingStatus}
              onUpdateBooking={handleUpdateBookingDetails}
              onDelete={handleDeleteBooking}
              onClearAllMeetLinks={handleClearAllMeetLinks}
            />
          )}
          {activeTab === 'devotees' && (
            <DevoteesTab devotees={devotees} onDelete={handleDeleteDevotee} />
          )}
          {activeTab === 'reviews' && (
            <ReviewsTab feedbacks={feedbacks} onDelete={handleDeleteReview} />
          )}
          {activeTab === 'settings' && (
            <SettingsTab onResetData={handleResetData} />
          )}
        </main>
      </div>
    </div>
  );
}
