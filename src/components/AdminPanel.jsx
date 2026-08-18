import React, { useState, useCallback } from 'react';
import {
  LayoutDashboard, Users, CalendarCheck, Star, Settings,
  LogOut, Plus, Edit2, Trash2, Check, X, Search,
  ShieldCheck, BookOpen, Wallet, Bell,
  CheckCircle2, AlertTriangle, Filter, Eye, RefreshCw, UserPlus,
  Phone, MapPin, Clock, Award, Database, Lock, Unlock, Terminal, Table, Key, Video
} from 'lucide-react';
import { DataStore } from '../services/store.js';
import { SAMPRADAYA_MATRIX, INITIAL_DEVOTEES, INITIAL_PUROHITS, INITIAL_BOOKINGS, INITIAL_FEEDBACKS } from '../services/systemData.js';

/* ──────────────────────────── helpers ─────────────────────────── */
const generateId = prefix => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

export function isVishnuSahasranamaBooking(b) {
  if (!b) return false;
  const name = (b.ritualName || '').toLowerCase();
  return name.includes('vishnu') || name.includes('sahasranama') || name.includes('parayana') || name.includes('parayanam');
}

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

  const generalBookings = safeBookings.filter(b => !isVishnuSahasranamaBooking(b));
  const parayanaBookings = safeBookings.filter(b => isVishnuSahasranamaBooking(b));

  const activeGeneralCount = generalBookings.filter(b => {
    const s = (b?.status || '').toLowerCase().trim();
    return s !== 'completed' && s !== 'cancelled';
  }).length;

  const activeParayanaCount = parayanaBookings.filter(b => {
    const s = (b?.status || '').toLowerCase().trim();
    return s !== 'completed' && s !== 'cancelled';
  }).length;

  const avgRating = safeFeedbacks.length
    ? (safeFeedbacks.reduce((acc, f) => {
        const vals = typeof f.ratings === 'object' ? Object.values(f.ratings) : [5];
        return acc + vals.reduce((a, b) => a + b, 0) / vals.length;
      }, 0) / safeFeedbacks.length).toFixed(2)
    : '4.92';

  const kpis = [
    { label: 'Verified Acharyas',         value: safePurohits.length,   icon: Users,         color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    { label: 'Devotee Accounts',         value: safeDevotees.length,   icon: BookOpen,      color: '#a78bfa', bg: 'rgba(139,92,246,0.1)' },
    { label: 'Devotee Bookings',         value: activeGeneralCount,   icon: CalendarCheck, color: '#34d399', bg: 'rgba(16,185,129,0.1)' },
    { label: 'Vishnu Sahasranama',       value: activeParayanaCount,  icon: BookOpen,      color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
    { label: 'Vedic Sampradayas',        value: '7 Lineages',          icon: Award,         color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
    { label: 'Platform Fee',             value: '0% Pure Bridge',      icon: Wallet,        color: '#38bdf8', bg: 'rgba(56,189,248,0.08)' },
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
    experienceYears: '', languages: '', specialties: '', trustScore: 95, status: 'Verified Acharya'
  });

  const filtered = purohits.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.mutt.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filterSampradaya === 'all' || p.sampradaya === filterSampradaya;
    return matchSearch && matchFilter;
  });

  const openNew = () => {
    setForm({ name: '', sampradaya: 'uttaradhi', mutt: '', vedaShakha: '', sutram: '', experienceYears: '', languages: '', specialties: '', trustScore: 95, status: 'Verified Acharya' });
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
                  <span style={{ color: '#34d399', fontFamily: 'monospace', fontSize: 11, fontWeight: 700 }}>{p.trustScore}% Verified Trust</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{p.experienceYears} yrs scholarly experience</span>
                  <span style={{ color: '#fbbf24', fontSize: 11 }}>{p.status}</span>
                </div>
                <div className="progress-track" style={{ marginTop: 4 }}>
                  <div className="progress-bar" style={{ width: `${p.trustScore}%`, background: p.trustScore >= 98 ? 'linear-gradient(90deg,#10b981,#34d399)' : 'linear-gradient(90deg,#f59e0b,#ea580c)' }} />
                </div>
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
  const isParayanaBooking = isVishnuSahasranamaBooking(booking);
  const [devoteeName, setDevoteeName] = useState(booking.devoteeName || '');
  const [devoteePhone, setDevoteePhone] = useState(booking.devoteePhone || '');
  const [dakshinaAmount, setDakshinaAmount] = useState(booking.dakshinaAmount || '');
  const [sampradaya, setSampradaya] = useState(booking.sampradaya || 'secular');
  const [date, setDate] = useState(booking.date || '');
  const [muhurtaTime, setMuhurtaTime] = useState(booking.muhurtaTime || '');
  const [purohitId, setPurohitId] = useState(booking.purohitId || 'unassigned');
  const [samagriMode, setSamagriMode] = useState(booking.samagriMode || '');
  const [location, setLocation] = useState(booking.location || '');
  const [meetLink, setMeetLink] = useState(booking.meetLink || '');
  const [status, setStatus] = useState(booking.status || 'Pending Admin Review');
  const [isApara, setIsApara] = useState(Boolean(booking.isAparaKaryam));
  const [adminNotes, setAdminNotes] = useState(booking.adminNotes || '');
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
      meetLink,
      status,
      isAparaKaryam: isApara,
      adminNotes
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
          {isParayanaBooking ? (
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
          ) : (
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
          )}

          {/* Sampradaya Lineage & Assigned Acharya */}
          {isParayanaBooking ? (
            <div>
              <label style={{ fontSize: 11, color: '#fbbf24', fontWeight: 700, display: 'block', marginBottom: 4 }}>Assigned Parayana Acharya</label>
              <select className="select" value={purohitId} onChange={e => setPurohitId(e.target.value)}>
                <option value="unassigned">⏳ Unassigned (Pending Admin Assignment)</option>
                {purohits.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          ) : (
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
          )}

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

          {/* Details / Sankalpa Mode */}
          {isParayanaBooking ? (
            <div>
              <label style={{ fontSize: 11, color: '#fbbf24', fontWeight: 700, display: 'block', marginBottom: 4 }}>Devotee Sankalpa & Intention Details</label>
              <input
                type="text"
                className="input"
                value={samagriMode}
                onChange={e => setSamagriMode(e.target.value)}
                placeholder="Gotram, Nakshatra, and Sankalpa Intention"
              />
            </div>
          ) : (
            <div>
              <label style={{ fontSize: 11, color: '#fbbf24', fontWeight: 700, display: 'block', marginBottom: 4 }}>Pooja Samagri Logistics</label>
              <select className="select" value={samagriMode} onChange={e => setSamagriMode(e.target.value)}>
                <option value="Pandit Hand-Carried Custom Kit (100% Pure Dravya)">Pandit Hand-Carried Kit</option>
                <option value="Householder Self-Arranged Dravya (Vedic Checklist Emailed)">Householder Self-Arranged</option>
                <option value="Pending Admin Call (Pandit Kit vs Self-Arranged)">Pending Admin Call</option>
              </select>
            </div>
          )}

          {/* Location & Google Meet URL */}
          {isParayanaBooking ? (
            <div>
              <label style={{ fontSize: 11, color: '#38bdf8', fontWeight: 700, display: 'block', marginBottom: 4 }}>Google Meet Video Link (Online Call)</label>
              <input type="text" className="input" value={meetLink} onChange={e => setMeetLink(e.target.value)} placeholder="e.g. https://meet.google.com/xyz-pdqr-abc" />
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, color: '#fbbf24', fontWeight: 700, display: 'block', marginBottom: 4 }}>Physical Venue / Address / Directions</label>
                <input type="text" className="input" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Malleshwaram, Bengaluru" required />
              </div>
              <div>
                <label style={{ fontSize: 11, color: '#38bdf8', fontWeight: 700, display: 'block', marginBottom: 4 }}>Google Meet Video Link (Online Call)</label>
                <input type="text" className="input" value={meetLink} onChange={e => setMeetLink(e.target.value)} placeholder="e.g. https://meet.google.com/xyz-pdqr-abc" />
              </div>
            </div>
          )}

          {/* Admin Internal Notes */}
          <div>
            <label style={{ fontSize: 11, color: '#fbbf24', fontWeight: 700, display: 'block', marginBottom: 4 }}>📝 Admin Internal Notes</label>
            <textarea
              className="input"
              style={{ fontSize: 12, minHeight: 60, resize: 'vertical', width: '100%' }}
              value={adminNotes}
              onChange={e => setAdminNotes(e.target.value)}
              placeholder="Enter internal admin notes for this request (e.g. devotee preferences, follow-up calls, special requests)..."
            />
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
function BookingsTab({
  bookings = [],
  purohits = [],
  onUpdateStatus,
  onUpdateBooking,
  onDelete,
  onClearAllMeetLinks,
  title = "📥 Devotee Ritual Booking Requests",
  subtitle = "All ritual requests land at Admin Desk. Admin controls Google Meet link dispatch and time-based link clearing.",
  badgeLabel = "Bookings",
  isParayana = false
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);
  const [meetInputs, setMeetInputs] = useState({});
  const [dailyParayanaMeetLink, setDailyParayanaMeetLink] = useState('https://meet.google.com/real-purohit-parayana');
  const [broadcasting, setBroadcasting] = useState(false);
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [noteInputs, setNoteInputs] = useState({});
  const [noteStatus, setNoteStatus] = useState({});

  const activeBookingsCount = bookings.filter(b => {
    const s = (b?.status || '').toLowerCase().trim();
    return s !== 'completed' && s !== 'cancelled';
  }).length;

  const filtered = bookings.filter(b => {
    const matchSearch = (b.devoteeName || '').toLowerCase().includes(search.toLowerCase()) ||
      (b.purohitName || '').toLowerCase().includes(search.toLowerCase()) ||
      (b.ritualName || '').toLowerCase().includes(search.toLowerCase()) ||
      (b.samagriMode || '').toLowerCase().includes(search.toLowerCase()) ||
      (b.id || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusList = isParayana
    ? ['all', 'Confirmed', 'Completed', 'Cancelled']
    : ['all', 'Pending Admin Review', 'Scheduled', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];

  const handleSendMeetLink = (booking) => {
    const bId = booking.id;
    const currentStatus = booking.status;
    const meetUrl = (meetInputs[bId] !== undefined ? meetInputs[bId] : booking.meetLink) || 'https://meet.google.com/real-purohit-seva';
    
    // 1. Instantly save Meet Link to SQLite Database / Devotee In-App Vault
    onUpdateStatus(bId, currentStatus, meetUrl);

    // 2. Instantly launch WhatsApp with pre-filled sacred invitation in the same click
    const devPhoneDigits = (booking.devoteePhone || '').replace(/\D/g, '');
    if (devPhoneDigits.length >= 7) {
      const waPhone = devPhoneDigits.length === 10 ? `91${devPhoneDigits}` : devPhoneDigits;
      const waText = `Hari Om ${booking.devoteeName || 'Devotee'} Ji,\n\nNamaskaram from Real-Purohit.\n\nYour 1-on-1 Google Meet session link for *${booking.ritualName}* scheduled on *${booking.date}* (${booking.muhurtaTime}) is:\n👉 ${meetUrl}\n\nPlease join 5 minutes prior to the session. Vedic Ashirvadam! 🙏`;
      window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(waText)}`, '_blank');
    }
  };

  const handleClearMeetLink = (bId, currentStatus) => {
    onUpdateStatus(bId, currentStatus, '');
    setMeetInputs(prev => ({ ...prev, [bId]: '' }));
  };

  const handleBroadcastDailyParayanaLink = async () => {
    const cleanUrl = dailyParayanaMeetLink.trim();
    if (!cleanUrl) {
      alert("Please enter today's Google Meet link.");
      return;
    }
    setBroadcasting(true);
    setBroadcastMsg('');
    try {
      const activeParayanaList = bookings.filter(b => {
        const isP = isParayana || isVishnuSahasranamaBooking(b);
        const s = (b?.status || '').toLowerCase().trim();
        return isP && s !== 'completed' && s !== 'cancelled';
      });

      for (const b of activeParayanaList) {
        await onUpdateStatus(b.id, b.status === 'Pending Admin Review' ? 'Scheduled' : b.status, cleanUrl);
      }

      setBroadcasting(false);
      setBroadcastMsg(`Successfully updated & published today's Google Meet link to ${activeParayanaList.length} active Parayana devotees in 1 click!`);
      setTimeout(() => setBroadcastMsg(''), 7000);
    } catch (err) {
      console.error(err);
      alert('Broadcast failed: ' + err.message);
      setBroadcasting(false);
    }
  };

  const handleSaveAdminNote = async (b) => {
    const noteVal = noteInputs[b.id] !== undefined ? noteInputs[b.id] : (b.adminNotes || '');
    try {
      await onUpdateBooking(b.id, { ...b, adminNotes: noteVal });
      setNoteStatus(prev => ({ ...prev, [b.id]: '✓ Saved!' }));
      setTimeout(() => {
        setNoteStatus(prev => ({ ...prev, [b.id]: '' }));
      }, 3000);
    } catch (err) {
      alert('Failed to save note: ' + err.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header Banner */}
      <div style={{
        padding: '16px 20px', borderRadius: 16,
        background: isParayana ? 'rgba(167,139,250,0.08)' : 'rgba(245,158,11,0.08)',
        border: `1px solid ${isParayana ? 'rgba(167,139,250,0.25)' : 'rgba(245,158,11,0.25)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12
      }}>
        <div>
          <h3 style={{ fontSize: 16, fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#f8fafc' }}>
            {title}
          </h3>
          <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
            {subtitle}
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
          <span style={{ fontSize: 12, padding: '4px 12px', borderRadius: 20, background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)', fontWeight: 800 }}>
            🟢 {activeBookingsCount} Active {badgeLabel}
          </span>
          {!isParayana && (
            <span style={{ fontSize: 12, padding: '4px 12px', borderRadius: 20, background: '#f59e0b', color: '#1a0a00', fontWeight: 800 }}>
              {bookings.filter(b => b.status === 'Pending Admin Review').length} Pending Requests
            </span>
          )}
        </div>
      </div>

      {/* Single Daily Google Meet Link Broadcast Card for Parayana */}
      {isParayana && (
        <div className="card-premium" style={{
          padding: '18px 22px', borderRadius: 16,
          background: 'linear-gradient(135deg, rgba(167,139,250,0.12), rgba(139,92,246,0.06))',
          border: '1px solid rgba(167,139,250,0.3)',
          display: 'flex', flexDirection: 'column', gap: 12
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(167,139,250,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c4b5fd' }}>
              <Video size={18} />
            </div>
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: '#f8fafc', fontFamily: 'Outfit,sans-serif' }}>
                📅 Today's Master Google Meet Link (Shared Daily Session)
              </h4>
              <p style={{ fontSize: 11, color: '#94a3b8' }}>
                Single daily link delivered instantly to all today's active Parayana Seva devotees in 1 click.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="text"
              className="input"
              style={{ flex: 1, minWidth: 260, height: 38, fontSize: 12, borderColor: 'rgba(167,139,250,0.4)' }}
              placeholder="Enter Today's Google Meet Link (e.g. https://meet.google.com/xyz-pdqr-abc)"
              value={dailyParayanaMeetLink}
              onChange={e => setDailyParayanaMeetLink(e.target.value)}
            />
            <button
              className="btn"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', color: 'white', fontWeight: 800, fontSize: 12, padding: '0 18px', height: 38, borderRadius: 10, display: 'inline-flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 15px rgba(139,92,246,0.4)', border: 'none', cursor: 'pointer' }}
              onClick={handleBroadcastDailyParayanaLink}
              disabled={broadcasting}
            >
              🚀 {broadcasting ? 'Publishing Link...' : "Deliver Today's Meet Link to All Active Parayana Devotees"}
            </button>
          </div>

          {broadcastMsg && (
            <div style={{ fontSize: 12, color: '#34d399', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(16,185,129,0.1)', padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(16,185,129,0.25)' }}>
              <CheckCircle2 size={14} /> {broadcastMsg}
            </div>
          )}
        </div>
      )}

      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input className="input" style={{ paddingLeft: 38 }}
            placeholder={isParayana ? "Search Parayana requests by devotee, sankalpa, or ID…" : "Search by devotee, ritual, or ID…"}
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="select" style={{ width: 'auto', minWidth: 180 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          {statusList.map(s => <option key={s} value={s}>{s === 'all' ? 'All Request Statuses' : s}</option>)}
        </select>
      </div>

      <p style={{ fontSize: 12, color: '#64748b' }}>
        Showing {filtered.length} of {bookings.length} {isParayana ? 'parayana' : 'devotee booking'} requests (<strong style={{ color: '#34d399' }}>{activeBookingsCount} active</strong>)
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(b => {
          const isItemParayana = isParayana || isVishnuSahasranamaBooking(b);
          const sm = !isItemParayana ? SAMPRADAYA_MATRIX[b.sampradaya] : null;
          const isPending = b.status === 'Pending Admin Review';
          const hasMeetUrl = Boolean(b.meetLink && b.meetLink.trim().length > 0);

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
                  {isItemParayana ? (
                    <h4 style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', fontFamily: 'Outfit,sans-serif', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      👤 {b.devoteeName} {b.devoteePhone && <span style={{ color: '#38bdf8', fontSize: 13, fontWeight: 700 }}> (📞 {b.devoteePhone})</span>}
                    </h4>
                  ) : (
                    <h4 style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc', fontFamily: 'Outfit,sans-serif', marginBottom: 6 }}>{b.ritualName}</h4>
                  )}

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px', fontSize: 12, color: '#94a3b8' }}>
                    {!isItemParayana && (
                      <span>👤 Devotee: <strong style={{ color: '#e2e8f0' }}>{b.devoteeName}</strong> {b.devoteePhone && <span style={{ color: '#38bdf8', fontWeight: 700 }}> (📞 {b.devoteePhone})</span>}</span>
                    )}
                    <span>🪔 Status: <strong style={{ color: isPending ? '#fbbf24' : '#34d399' }}>{b.purohitName || 'Pending Admin Assignment'}</strong></span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={11} /> {b.date} · {b.muhurtaTime}</span>
                  </div>
                  
                  {isItemParayana ? (
                    <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>
                      🌸 Devotee Sankalpa Details: <strong style={{ color: '#e2e8f0' }}>{b.samagriMode || 'General Family Wellbeing'}</strong>
                    </p>
                  ) : (
                    <>
                      <p style={{ fontSize: 12, color: '#64748b', marginTop: 6 }}>Logistics: {b.samagriMode}</p>
                      <p style={{ fontSize: 12, color: '#fcd34d', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                        📍 Physical Venue: <strong style={{ color: '#f8fafc' }}>{b.location || 'Bengaluru'}</strong>
                      </p>
                    </>
                  )}
                  
                  {/* Google Meet Link Display / Individual Dispatch Controls */}
                  {isItemParayana ? (
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                      <span style={{ fontSize: 11, color: b.meetLink ? '#34d399' : '#64748b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Video size={12} /> Today's Meet Link: {b.meetLink ? (
                          <a href={b.meetLink} target="_blank" rel="noreferrer" style={{ color: '#fbbf24', textDecoration: 'underline', fontFamily: 'monospace' }}>{b.meetLink}</a>
                        ) : (
                          <span style={{ color: '#64748b', fontStyle: 'italic', fontWeight: 400 }}>Awaiting today's master link broadcast above</span>
                        )}
                      </span>
                      {b.meetLink && b.devoteePhone && (
                        <button
                          className="btn btn-sm btn-ghost"
                          style={{ color: '#38bdf8', fontSize: 10, padding: '3px 8px', borderColor: 'rgba(56,189,248,0.3)' }}
                          onClick={() => {
                            const devPhoneDigits = (b.devoteePhone || '').replace(/\D/g, '');
                            const waPhone = devPhoneDigits.length === 10 ? `91${devPhoneDigits}` : devPhoneDigits;
                            const waText = `Hari Om ${b.devoteeName || 'Devotee'} Ji,\n\nNamaskaram from Real-Purohit.\n\nYour Google Meet session link for today's *${b.ritualName}* is:\n👉 ${b.meetLink}\n\nPlease join 5 minutes prior to the session. Vedic Ashirvadam! 🙏`;
                            window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(waText)}`, '_blank');
                          }}
                        >
                          📲 Resend WhatsApp
                        </button>
                      )}
                    </div>
                  ) : (
                    <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 11, color: '#38bdf8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Video size={12} /> Google Meet Link:
                      </span>
                      <input
                        type="text"
                        className="input"
                        style={{ fontSize: 11, padding: '4px 10px', height: 30, flex: 1, minWidth: 220 }}
                        value={meetInputs[b.id] !== undefined ? meetInputs[b.id] : (b.meetLink || '')}
                        placeholder="Enter Google Meet link (e.g. https://meet.google.com/xyz-pdqr-abc)"
                        onChange={e => setMeetInputs({ ...meetInputs, [b.id]: e.target.value })}
                      />
                      <button
                        className="btn btn-sm"
                        style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', fontWeight: 800, fontSize: 11, padding: '5px 14px', borderRadius: 8, display: 'inline-flex', alignItems: 'center', gap: 5, boxShadow: '0 2px 8px rgba(16,185,129,0.3)' }}
                        onClick={() => handleSendMeetLink(b)}
                        title="Saves link to In-App Devotee Vault AND sends via WhatsApp in 1 click"
                      >
                        🚀 Send to Vault & WhatsApp (1-Click)
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
                  )}

                  {/* Admin Internal Notes Bar */}
                  <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 11, color: '#fbbf24', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}>
                        <FileText size={12} /> Admin Internal Notes:
                      </span>
                      {noteStatus[b.id] && (
                        <span style={{ fontSize: 10, color: '#34d399', fontWeight: 700 }}>{noteStatus[b.id]}</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <input
                        type="text"
                        className="input"
                        style={{ fontSize: 11, padding: '4px 10px', height: 30, flex: 1, background: 'rgba(15,23,42,0.6)', borderColor: 'rgba(255,255,255,0.1)' }}
                        value={noteInputs[b.id] !== undefined ? noteInputs[b.id] : (b.adminNotes || '')}
                        placeholder="Type internal notes here (e.g. Prefers Kannada, called on 18th, special sankalpa)..."
                        onChange={e => setNoteInputs({ ...noteInputs, [b.id]: e.target.value })}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSaveAdminNote(b);
                          }
                        }}
                      />
                      <button
                        className="btn btn-sm"
                        style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', color: '#fbbf24', fontSize: 10, padding: '4px 12px', height: 30, borderRadius: 8, whiteSpace: 'nowrap', fontWeight: 700 }}
                        onClick={() => handleSaveAdminNote(b)}
                        title="Save note to database"
                      >
                        💾 Save Note
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
                  {!isItemParayana && (
                    <>
                      <div style={{ fontSize: 18, fontWeight: 800, color: '#34d399', fontFamily: 'monospace' }}>{b.dakshinaAmount}</div>
                      <span style={{ fontSize: 10, color: '#64748b' }}>{b.dakshinaStatus}</span>
                    </>
                  )}

                  {/* Admin Action Status Selector */}
                  {isItemParayana ? (
                    <select className="select" style={{ width: 'auto', padding: '6px 12px', fontSize: 11, background: 'rgba(16,185,129,0.15)', borderColor: '#10b981', color: '#34d399', fontWeight: 700 }}
                      value={b.status || 'Confirmed'}
                      onChange={e => onUpdateStatus(b.id, e.target.value)}>
                      {['Confirmed', 'Completed', 'Cancelled'].map(s =>
                        <option key={s} value={s}>{s}</option>)}
                    </select>
                  ) : (
                    <select className="select" style={{ width: 'auto', padding: '6px 12px', fontSize: 11, background: isPending ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)', borderColor: isPending ? '#f59e0b' : '#10b981', color: isPending ? '#fbbf24' : '#34d399', fontWeight: 700 }}
                      value={b.status}
                      onChange={e => onUpdateStatus(b.id, e.target.value)}>
                      {['Pending Admin Review', 'Scheduled', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'].map(s =>
                        <option key={s} value={s}>{s}</option>)}
                    </select>
                  )}

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
  // Password change state
  const [currPwd, setCurrPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [pwdMsg, setPwdMsg] = useState({ text: '', type: '' });
  const [savingPwd, setSavingPwd] = useState(false);

  // Platform contact state
  const savedConfig = JSON.parse(localStorage.getItem('real_purohit_platform_config') || '{}');
  const [phone, setPhone] = useState(savedConfig.phone || '+91 9876543210');
  const [email, setEmail] = useState(savedConfig.email || 'admin@real-purohit.org');
  const [sosPhone, setSosPhone] = useState(savedConfig.sosPhone || '+91 99999 88888');
  const [contactSaved, setContactSaved] = useState(false);

  // Maintenance state
  const [maintMsg, setMaintMsg] = useState('');
  const [vacuuming, setVacuuming] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdMsg({ text: '', type: '' });
    if (newPwd !== confirmPwd) {
      setPwdMsg({ text: 'New password and confirm password do not match!', type: 'error' });
      return;
    }
    if (newPwd.length < 6) {
      setPwdMsg({ text: 'New password must be at least 6 characters long!', type: 'error' });
      return;
    }

    setSavingPwd(true);
    try {
      await DataStore.changeAdminPassword(currPwd, newPwd);
      setPwdMsg({ text: '✅ Admin password updated successfully in SQLite database!', type: 'success' });
      setCurrPwd('');
      setNewPwd('');
      setConfirmPwd('');
    } catch (err) {
      setPwdMsg({ text: '❌ ' + err.message, type: 'error' });
    } finally {
      setSavingPwd(false);
    }
  };

  const handleSaveContactConfig = (e) => {
    e.preventDefault();
    const config = { phone, email, sosPhone };
    localStorage.setItem('real_purohit_platform_config', JSON.stringify(config));
    setContactSaved(true);
    setTimeout(() => setContactSaved(false), 4000);
  };

  const handleVacuumDb = async () => {
    setVacuuming(true);
    setMaintMsg('');
    try {
      const res = await DataStore.vacuumDb();
      setMaintMsg('✅ ' + (res.message || 'SQLite database storage vacuumed & optimized!'));
    } catch (err) {
      setMaintMsg('❌ ' + err.message);
    } finally {
      setVacuuming(false);
    }
  };

  return (
    <div style={{ maxWidth: 840, display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* 1. Change Admin Password Card */}
      <div className="card" style={{ padding: 28 }}>
        <h3 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 17, fontWeight: 800, color: '#f8fafc', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Lock size={20} style={{ color: '#fbbf24' }} /> Change Admin Login Password
        </h3>
        <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 20 }}>
          Update the administrative password used to sign in and unlock full database controls.
        </p>

        <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 500 }}>
          <div>
            <label style={{ fontSize: 11, color: '#fbbf24', fontWeight: 700, display: 'block', marginBottom: 4 }}>Current Admin Password</label>
            <input
              type="password"
              className="input"
              value={currPwd}
              onChange={e => setCurrPwd(e.target.value)}
              placeholder="Enter current password (e.g. admin123)"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, color: '#fbbf24', fontWeight: 700, display: 'block', marginBottom: 4 }}>New Password</label>
              <input
                type="password"
                className="input"
                value={newPwd}
                onChange={e => setNewPwd(e.target.value)}
                placeholder="New password (min 6 chars)"
                required
              />
            </div>
            <div>
              <label style={{ fontSize: 11, color: '#fbbf24', fontWeight: 700, display: 'block', marginBottom: 4 }}>Confirm New Password</label>
              <input
                type="password"
                className="input"
                value={confirmPwd}
                onChange={e => setConfirmPwd(e.target.value)}
                placeholder="Re-type new password"
                required
              />
            </div>
          </div>

          {pwdMsg.text && (
            <div style={{
              fontSize: 12, padding: '10px 14px', borderRadius: 10,
              background: pwdMsg.type === 'error' ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)',
              border: `1px solid ${pwdMsg.type === 'error' ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`,
              color: pwdMsg.type === 'error' ? '#f87171' : '#34d399'
            }}>
              {pwdMsg.text}
            </div>
          )}

          <div>
            <button type="submit" className="btn btn-primary btn-sm" disabled={savingPwd}>
              {savingPwd ? 'Updating Password...' : '🔑 Update Admin Password'}
            </button>
          </div>
        </form>
      </div>

      {/* 2. Platform Contact & Support Phone Config */}
      <div className="card" style={{ padding: 28 }}>
        <h3 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 17, fontWeight: 800, color: '#f8fafc', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Phone size={20} style={{ color: '#38bdf8' }} /> Platform Support & Helpline Configuration
        </h3>
        <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 20 }}>
          Configure public support phone numbers and email displayed to householders and purohits.
        </p>

        <form onSubmit={handleSaveContactConfig} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: 4 }}>Support Phone Number</label>
              <input
                type="text"
                className="input"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                required
              />
            </div>
            <div>
              <label style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: 4 }}>Support Email Address</label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@real-purohit.org"
                required
              />
            </div>
            <div>
              <label style={{ fontSize: 11, color: '#f87171', fontWeight: 700, display: 'block', marginBottom: 4 }}>Emergency SOS Helpline</label>
              <input
                type="text"
                className="input"
                value={sosPhone}
                onChange={e => setSosPhone(e.target.value)}
                placeholder="+91 99999 88888"
                required
              />
            </div>
          </div>

          {contactSaved && (
            <div style={{ fontSize: 12, color: '#34d399', background: 'rgba(16,185,129,0.12)', padding: '8px 12px', borderRadius: 10, border: '1px solid rgba(16,185,129,0.25)' }}>
              ✅ Platform Support contact configuration saved!
            </div>
          )}

          <div>
            <button type="submit" className="btn btn-primary btn-sm">
              💾 Save Support Contact Details
            </button>
          </div>
        </form>
      </div>

      {/* 3. Database Maintenance & Storage Controls */}
      <div className="card" style={{ padding: 28 }}>
        <h3 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 17, fontWeight: 800, color: '#f8fafc', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
          <RefreshCw size={20} style={{ color: '#a78bfa' }} /> Database Storage & Maintenance
        </h3>
        <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 20 }}>
          Perform storage defragmentation and WAL database optimization.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <button className="btn btn-ghost btn-sm" onClick={handleVacuumDb} disabled={vacuuming} style={{ color: '#a78bfa', borderColor: 'rgba(167,139,250,0.3)' }}>
            <RefreshCw size={14} /> {vacuuming ? 'Optimizing Database...' : '🧹 Run SQLite Storage VACUUM'}
          </button>
        </div>

        {maintMsg && (
          <div style={{ fontSize: 12, marginTop: 14, padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {maintMsg}
          </div>
        )}
      </div>

      {/* 4. Security System Summary */}
      <div className="card" style={{ padding: 28 }}>
        <h3 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 17, fontWeight: 800, color: '#f8fafc', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
          <ShieldCheck size={20} style={{ color: '#34d399' }} /> System Security & Database Integrity
        </h3>
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
  const [form, setForm] = useState({ id: '', name: '', badgeClass: 'badge-secular', description: '', icon: '🛕', image: '' });
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const handleEdit = (samp) => {
    setEditing(samp);
    setForm({
      id: samp.id,
      name: samp.name,
      badgeClass: samp.badgeClass || 'badge-secular',
      description: samp.description || '',
      icon: samp.icon || '🛕',
      image: samp.image || SAMPRADAYA_MATRIX[samp.id]?.image || ''
    });
  };

  const handleImageFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await DataStore.saveSampradaya(form);
    setEditing(null);
    setForm({ id: '', name: '', badgeClass: 'badge-secular', description: '', icon: '🛕', image: '' });
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
        <button className="btn btn-primary btn-sm" onClick={() => { setEditing('new'); setForm({ id: '', name: '', badgeClass: 'badge-secular', description: '', icon: '🛕', image: '' }); }}>
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
              <label style={{ fontSize: 11, color: '#94a3b8' }}>Badge CSS Class</label>
              <input className="input" value={form.badgeClass} onChange={e => setForm({...form, badgeClass: e.target.value})} placeholder="badge-secular" />
            </div>
          </div>

          {/* Logo Image Upload & Preview */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, alignItems: 'center' }}>
            <div>
              <label style={{ fontSize: 11, color: '#fbbf24', fontWeight: 700, display: 'block', marginBottom: 4 }}>
                Upload Tradition Logo Image (PNG / SVG / JPG)
              </label>
              <input
                type="file"
                accept="image/*"
                className="input"
                style={{ fontSize: 11, padding: '6px' }}
                onChange={handleImageFileUpload}
              />
            </div>

            <div>
              <label style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginBottom: 4 }}>
                Or Image Data URL / Web Link
              </label>
              <input
                className="input"
                value={form.image || ''}
                onChange={e => setForm({ ...form, image: e.target.value })}
                placeholder="https://... or data:image/png;base64,..."
              />
            </div>
          </div>

          {form.image && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <img src={form.image} alt="Logo Preview" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'contain' }} />
              <span style={{ fontSize: 11, color: '#34d399', fontWeight: 700 }}>Logo Image Preview Active</span>
            </div>
          )}

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
        {sampradayas.map(s => {
          const logoImage = s.image || SAMPRADAYA_MATRIX[s.id]?.image;
          return (
            <div key={s.id} className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  {logoImage ? (
                    <img src={logoImage} alt={s.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'contain', background: 'rgba(255,255,255,0.04)', padding: 2 }} />
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
          );
        })}
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
  const [dbUnlocked, setDbUnlocked] = useState(false);
  const [showDbSecurityGate, setShowDbSecurityGate] = useState(false);

  const handleSelectTab = (tabId) => {
    if (tabId === 'dbAccess' && !dbUnlocked) {
      setShowDbSecurityGate(true);
      return;
    }
    setActiveTab(tabId);
  };

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

  const handleUpdateBookingStatus = useCallback(async (id, status, meetLink, location) => {
    await DataStore.updateBookingStatus(id, status, meetLink, location);
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

/* ──────────────────────────── Database Security Gate ────────────── */
function DatabaseSecurityGate({ onUnlocked, onCancel }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setVerifying(true);
    try {
      await DataStore.verifyAdminPassword(password);
      onUnlocked();
    } catch (err) {
      setError(err.message || 'Incorrect password');
      setVerifying(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="card-premium animate-fade-up" style={{ maxWidth: 440, width: '100%', padding: 32, borderRadius: 20 }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ width: 54, height: 54, borderRadius: 16, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            <Lock size={26} style={{ color: '#f87171' }} />
          </div>
          <h3 style={{ fontSize: 18, fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#f8fafc' }}>
            🔒 Security Password Verification
          </h3>
          <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 6, lineHeight: 1.5 }}>
            You are opening <strong>Full Database Access</strong>. Re-enter Admin password to unlock SQLite table management permissions.
          </p>
        </div>

        <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 11, color: '#fbbf24', fontWeight: 700, display: 'block', marginBottom: 6 }}>
              Admin Password
            </label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter admin password (e.g. admin123)"
              autoFocus
              required
            />
          </div>

          {error && (
            <div style={{ fontSize: 12, color: '#f87171', background: 'rgba(239,68,68,0.1)', padding: '8px 12px', borderRadius: 10, border: '1px solid rgba(239,68,68,0.25)', textAlign: 'center' }}>
              ❌ {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
            <button type="button" className="btn btn-ghost" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={verifying}>
              {verifying ? 'Verifying...' : '🔓 Unlock DB Access'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ──────────────────────────── Database Manager Tab ─────────────── */
function DatabaseManagerTab() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('users');
  const [tableData, setTableData] = useState({ columns: [], rows: [] });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSqlStudio, setShowSqlStudio] = useState(false);

  // SQL Studio state
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM users LIMIT 50;');
  const [sqlResult, setSqlResult] = useState(null);
  const [sqlError, setSqlError] = useState('');
  const [executingSql, setExecutingSql] = useState(false);

  // Modals state
  const [editingRow, setEditingRow] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteConfirmRow, setDeleteConfirmRow] = useState(null);

  // Load available SQLite tables
  const loadTables = useCallback(async () => {
    try {
      const res = await DataStore.getDbTables();
      if (Array.isArray(res)) setTables(res);
    } catch (err) {
      console.error(err);
    }
  }, []);

  // Load selected table data
  const loadTableData = useCallback(async (tName) => {
    if (!tName) return;
    setLoading(true);
    try {
      const res = await DataStore.getTableRows(tName);
      setTableData(res);
    } catch (err) {
      alert('Error fetching table rows: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadTables();
  }, [loadTables]);

  React.useEffect(() => {
    if (selectedTable) {
      loadTableData(selectedTable);
    }
  }, [selectedTable, loadTableData]);

  const handleExecuteSql = async () => {
    if (!sqlQuery.trim()) return;
    setExecutingSql(true);
    setSqlError('');
    setSqlResult(null);
    try {
      const res = await DataStore.executeSql(sqlQuery);
      setSqlResult(res);
      // Refresh current table if mutation performed
      if (res.type === 'MUTATION') {
        loadTableData(selectedTable);
      }
    } catch (err) {
      setSqlError(err.message || 'SQL Execution Error');
    } finally {
      setExecutingSql(false);
    }
  };

  const handleDeleteRow = async (row) => {
    const pkCol = tableData.columns.find(c => c.pk)?.name || 'id';
    const pkVal = row[pkCol];
    try {
      await DataStore.deleteDbRow(selectedTable, pkVal, pkCol);
      loadTableData(selectedTable);
      setDeleteConfirmRow(null);
    } catch (err) {
      alert('Failed to delete row: ' + err.message);
    }
  };

  const filteredRows = (tableData.rows || []).filter(r => {
    if (!search.trim()) return true;
    return Object.values(r).some(val => String(val || '').toLowerCase().includes(search.toLowerCase()));
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', minWidth: 0 }}>
      {/* Top Controls Banner */}
      <div style={{ padding: '18px 22px', borderRadius: 16, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h3 style={{ fontSize: 17, fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Database size={20} style={{ color: '#fbbf24' }} /> SQLite Database Manager & SQL Studio
          </h3>
          <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 3 }}>
            Full CRUD administrative access: view, search, edit, insert, and delete records across all SQLite tables.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            className={`btn btn-sm ${showSqlStudio ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setShowSqlStudio(!showSqlStudio)}
            style={{ fontSize: 12, padding: '6px 14px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Terminal size={14} /> {showSqlStudio ? 'Close SQL Console' : '⚡ Open Raw SQL Studio'}
          </button>
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => { loadTables(); loadTableData(selectedTable); }}
            style={{ fontSize: 12, padding: '6px 12px', borderRadius: 10 }}
          >
            <RefreshCw size={13} /> Refresh
          </button>
        </div>
      </div>

      {/* SQL Studio Console Component */}
      {showSqlStudio && (
        <div className="card" style={{ padding: 24, border: '1px solid rgba(56,189,248,0.3)', background: 'rgba(15,23,42,0.95)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h4 style={{ fontSize: 14, fontWeight: 800, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Terminal size={16} /> Raw SQL Query Studio Console
            </h4>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <button className="btn btn-ghost btn-sm" style={{ fontSize: 10, padding: '2px 8px' }} onClick={() => setSqlQuery(`SELECT * FROM ${selectedTable} LIMIT 50;`)}>
                SELECT {selectedTable}
              </button>
              <button className="btn btn-ghost btn-sm" style={{ fontSize: 10, padding: '2px 8px' }} onClick={() => setSqlQuery(`SELECT * FROM users;`)}>
                SELECT users
              </button>
              <button className="btn btn-ghost btn-sm" style={{ fontSize: 10, padding: '2px 8px' }} onClick={() => setSqlQuery(`SELECT * FROM bookings;`)}>
                SELECT bookings
              </button>
              <button className="btn btn-ghost btn-sm" style={{ fontSize: 10, padding: '2px 8px' }} onClick={() => setSqlQuery(`PRAGMA table_info('${selectedTable}');`)}>
                Table Info
              </button>
            </div>
          </div>

          <textarea
            className="input"
            rows={4}
            style={{ fontFamily: 'monospace', fontSize: 12, lineHeight: 1.5, color: '#38bdf8', background: '#090d16', padding: 12 }}
            value={sqlQuery}
            onChange={e => setSqlQuery(e.target.value)}
            placeholder="Type SQL command (e.g. SELECT * FROM users or UPDATE bookings SET status = 'Scheduled' WHERE id = 'BK-1001')"
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
            <button className="btn btn-primary btn-sm" onClick={handleExecuteSql} disabled={executingSql}>
              {executingSql ? 'Executing Query...' : '▶ Execute SQL Statement'}
            </button>
          </div>

          {sqlError && (
            <div style={{ marginTop: 14, padding: 12, borderRadius: 10, background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)', color: '#f87171', fontSize: 12 }}>
              ❌ {sqlError}
            </div>
          )}

          {sqlResult && (
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              {sqlResult.type === 'MUTATION' ? (
                <div style={{ padding: 12, borderRadius: 10, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399', fontSize: 12 }}>
                  ✅ {sqlResult.message}
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: 11, color: '#94a3b8', marginBottom: 8 }}>Returned {sqlResult.count} row(s):</p>
                  <div style={{ overflowX: 'auto', maxHeight: 300, overflowY: 'auto' }}>
                    <table style={{ width: '100%', fontSize: 11, borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.05)', color: '#fbbf24', textAlign: 'left' }}>
                          {sqlResult.columns.map(col => <th key={col} style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{col}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {sqlResult.rows.map((r, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                            {sqlResult.columns.map(col => (
                              <td key={col} style={{ padding: '8px 12px', color: '#e2e8f0', fontFamily: 'monospace' }}>{String(r[col] ?? '')}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Horizontal Table Selector Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
        <span style={{ fontSize: 11, color: '#fbbf24', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          SQLite Tables ({tables.length}):
        </span>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'nowrap' }}>
          {tables.map(t => (
            <button
              key={t.name}
              onClick={() => setSelectedTable(t.name)}
              className={`btn btn-sm ${selectedTable === t.name ? 'btn-primary' : 'btn-ghost'}`}
              style={{
                fontSize: 11, padding: '4px 14px', borderRadius: 20, flexShrink: 0,
                background: selectedTable === t.name ? 'linear-gradient(135deg, #f59e0b, #ea580c)' : 'rgba(255,255,255,0.03)',
                borderColor: selectedTable === t.name ? '#f59e0b' : 'rgba(255,255,255,0.08)'
              }}
            >
              📋 {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table Inspector Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>Active Table:</span>
            <span style={{ color: '#fbbf24', fontFamily: 'monospace' }}>{selectedTable}</span>
            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 12, background: 'rgba(56,189,248,0.15)', color: '#38bdf8' }}>
              {filteredRows.length} Rows
            </span>
          </div>

          {/* Search Table Rows */}
          <div style={{ position: 'relative', width: 260 }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              className="input"
              style={{ paddingLeft: 34, fontSize: 11, height: 34 }}
              placeholder={`Search records in '${selectedTable}'…`}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
          <Plus size={14} /> Add New Row in {selectedTable}
        </button>
      </div>

      {/* Data Table Grid */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16 }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>Loading database records from SQLite...</div>
        ) : filteredRows.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#64748b', fontSize: 13 }}>No matching records in table <strong>{selectedTable}</strong></div>
        ) : (
          <div style={{ overflowX: 'auto', maxHeight: 520, overflowY: 'auto' }}>
            <table style={{ width: '100%', fontSize: 11, borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#090d16', borderBottom: '1px solid rgba(255,255,255,0.1)', position: 'sticky', top: 0, zIndex: 10 }}>
                  {tableData.columns.map(c => (
                    <th key={c.name} style={{ padding: '12px 14px', color: c.pk ? '#fbbf24' : '#e2e8f0', fontWeight: 800, whiteSpace: 'nowrap' }}>
                      {c.pk ? '🔑 ' : ''}{c.name} <span style={{ fontSize: 9, color: '#64748b', fontWeight: 400 }}>({c.type})</span>
                    </th>
                  ))}
                  <th style={{ padding: '12px 14px', textAlign: 'right', color: '#94a3b8', whiteSpace: 'nowrap', position: 'sticky', right: 0, background: '#090d16' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                    {tableData.columns.map(c => {
                      const val = row[c.name];
                      const str = val !== null && val !== undefined ? String(val) : '';
                      const isImage = str.startsWith('data:image/') || str.match(/^https?:\/\/.*\.(png|jpg|jpeg|svg|webp)/i);
                      const isUrl = str.startsWith('http://') || str.startsWith('https://');

                      return (
                        <td key={c.name} style={{ padding: '10px 14px', color: '#cbd5e1', fontFamily: c.name.includes('id') || c.name.includes('key') ? 'monospace' : 'inherit', fontSize: 11, verticalAlign: 'middle' }}>
                          {val === null || val === undefined ? (
                            <span style={{ color: '#475569', fontStyle: 'italic' }}>NULL</span>
                          ) : isImage ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <img src={str} alt="" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'contain', background: 'rgba(255,255,255,0.05)', padding: 2, border: '1px solid rgba(255,255,255,0.1)' }} />
                              <span style={{ fontSize: 10, color: '#38bdf8', fontFamily: 'monospace', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                Image Data
                              </span>
                            </div>
                          ) : isUrl ? (
                            <a href={str} target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8', textDecoration: 'underline', maxWidth: 180, display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {str}
                            </a>
                          ) : (
                            <span title={str.length > 30 ? str : undefined} style={{ maxWidth: 220, display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {str}
                            </span>
                          )}
                        </td>
                      );
                    })}
                    <td style={{ padding: '10px 14px', textAlign: 'right', whiteSpace: 'nowrap', position: 'sticky', right: 0, background: idx % 2 === 0 ? '#0f172a' : '#0c1322' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ padding: '4px 10px', fontSize: 11, color: '#fbbf24', borderColor: 'rgba(245,158,11,0.25)' }}
                          onClick={() => setEditingRow(row)}
                        >
                          <Edit2 size={12} /> Edit
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ padding: '4px 8px', fontSize: 11, color: '#f87171', borderColor: 'rgba(220,38,38,0.25)' }}
                          onClick={() => setDeleteConfirmRow(row)}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Row Modal */}
      {showAddModal && (
        <AddRowModal
          tableName={selectedTable}
          columns={tableData.columns}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => { setShowAddModal(false); loadTableData(selectedTable); }}
        />
      )}

      {/* Edit Row Modal */}
      {editingRow && (
        <EditRowModal
          tableName={selectedTable}
          columns={tableData.columns}
          row={editingRow}
          onClose={() => setEditingRow(null)}
          onSuccess={() => { setEditingRow(null); loadTableData(selectedTable); }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmRow && (
        <ConfirmDialog
          message={`Are you sure you want to delete this row from table '${selectedTable}'?`}
          onConfirm={() => handleDeleteRow(deleteConfirmRow)}
          onCancel={() => setDeleteConfirmRow(null)}
        />
      )}
    </div>
  );
}

/* ── Add Row Modal ── */
function AddRowModal({ tableName, columns, onClose, onSuccess }) {
  const [form, setForm] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await DataStore.createDbRow(tableName, form);
      onSuccess();
    } catch (err) {
      alert('Failed to insert row: ' + err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="card-premium" style={{ maxWidth: 580, width: '100%', padding: 28, borderRadius: 20 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <h3 style={{ fontSize: 16, fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#f8fafc' }}>
            ➕ Insert New Row into '{tableName}'
          </h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 480, overflowY: 'auto' }}>
          {columns.map(c => (
            <div key={c.name}>
              <label style={{ fontSize: 11, color: c.pk ? '#fbbf24' : '#94a3b8', fontWeight: 700, display: 'block', marginBottom: 4 }}>
                {c.name} {c.pk ? '(Primary Key)' : ''}
              </label>
              <input
                className="input"
                style={{ fontSize: 12 }}
                value={form[c.name] ?? ''}
                onChange={e => setForm({ ...form, [c.name]: e.target.value })}
                placeholder={`Value for ${c.name}`}
              />
            </div>
          ))}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 14 }}>
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={submitting}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Inserting...' : 'Insert Record into Database'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Edit Row Modal ── */
function EditRowModal({ tableName, columns, row, onClose, onSuccess }) {
  const pkCol = columns.find(c => c.pk)?.name || 'id';
  const pkVal = row[pkCol];
  const [form, setForm] = useState({ ...row });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await DataStore.updateDbRow(tableName, pkCol, pkVal, form);
      onSuccess();
    } catch (err) {
      alert('Failed to update row: ' + err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="card-premium" style={{ maxWidth: 580, width: '100%', padding: 28, borderRadius: 20 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <h3 style={{ fontSize: 16, fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#f8fafc' }}>
            ✏️ Edit Row in '{tableName}' ({pkCol}: {String(pkVal)})
          </h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 480, overflowY: 'auto' }}>
          {columns.map(c => (
            <div key={c.name}>
              <label style={{ fontSize: 11, color: c.pk ? '#fbbf24' : '#94a3b8', fontWeight: 700, display: 'block', marginBottom: 4 }}>
                {c.name} {c.pk ? '(Primary Key)' : ''}
              </label>
              <input
                className="input"
                style={{ fontSize: 12 }}
                value={form[c.name] ?? ''}
                disabled={c.pk}
                onChange={e => setForm({ ...form, [c.name]: e.target.value })}
              />
            </div>
          ))}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 14 }}>
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={submitting}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving Changes...' : 'Save Database Row'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

  const generalBookings = (bookings || []).filter(b => !isVishnuSahasranamaBooking(b));
  const parayanaBookings = (bookings || []).filter(b => isVishnuSahasranamaBooking(b));

  const activeGeneralCount = generalBookings.filter(b => {
    const s = (b?.status || '').toLowerCase().trim();
    return s !== 'completed' && s !== 'cancelled';
  }).length;

  const activeParayanaCount = parayanaBookings.filter(b => {
    const s = (b?.status || '').toLowerCase().trim();
    return s !== 'completed' && s !== 'cancelled';
  }).length;

  const SIDEBAR_ITEMS = [
    { id: 'overview',     label: 'Overview',                   icon: LayoutDashboard },
    { id: 'bookings',     label: 'Devotee Booking Requests',    icon: CalendarCheck, badge: activeGeneralCount },
    { id: 'parayana',     label: 'Vishnusahasranama Parayana',  icon: BookOpen,      badge: activeParayanaCount },
    { id: 'sampradayas',  label: 'Sampradaya Traditions',       icon: Award },
    { id: 'purohits',     label: 'Acharya Directory',        icon: Users },
    { id: 'devotees',     label: 'Devotee Records',          icon: BookOpen },
    { id: 'dbAccess',     label: 'Full DB Access',           icon: Database },
    { id: 'settings',     label: 'Settings',                 icon: Settings },
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
              <button key={item.id} onClick={() => handleSelectTab(item.id)} style={{
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
                <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>
                {item.badge !== undefined && (
                  <span style={{
                    fontSize: 10,
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 12,
                    background: isActive ? '#f59e0b' : 'rgba(16,185,129,0.15)',
                    color: isActive ? '#1a0a00' : '#34d399',
                    border: isActive ? '1px solid #f59e0b' : '1px solid rgba(16,185,129,0.3)'
                  }}>
                    {item.badge}
                  </span>
                )}
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
            <Eye size={14} /> View Devotee Platform
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
      <div style={{ flex: 1, marginLeft: 240, display: 'flex', flexDirection: 'column', minHeight: '100vh', minWidth: 0 }}>
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
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto', minWidth: 0, maxWidth: '100%' }}>
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
              bookings={generalBookings}
              purohits={purohits}
              onUpdateStatus={handleUpdateBookingStatus}
              onUpdateBooking={handleUpdateBookingDetails}
              onDelete={handleDeleteBooking}
              onClearAllMeetLinks={handleClearAllMeetLinks}
              title="📥 Devotee Ritual Booking Requests"
              subtitle="All Vedic pooja, homam, and shraaddha ritual booking requests land at Admin Desk. Admin controls Acharya assignment, Dakshina honorariums, and Google Meet video links."
              badgeLabel="Devotee Bookings"
              isParayana={false}
            />
          )}
          {activeTab === 'parayana' && (
            <BookingsTab
              bookings={parayanaBookings}
              purohits={purohits}
              onUpdateStatus={handleUpdateBookingStatus}
              onUpdateBooking={handleUpdateBookingDetails}
              onDelete={handleDeleteBooking}
              onClearAllMeetLinks={handleClearAllMeetLinks}
              title="🌸 Vishnusahasranama Parayana Requests"
              subtitle="1-on-1 Free Vishnu Sahasranama Parayana & Stotra requests. Manage assigned Parayana Acharyas, live Google Meet session links, and 1-Click WhatsApp dispatches."
              badgeLabel="Parayana Sessions"
              isParayana={true}
            />
          )}
          {activeTab === 'devotees' && (
            <DevoteesTab devotees={devotees} onDelete={handleDeleteDevotee} />
          )}
          {activeTab === 'reviews' && (
            <ReviewsTab feedbacks={feedbacks} onDelete={handleDeleteReview} />
          )}
          {activeTab === 'dbAccess' && dbUnlocked && (
            <DatabaseManagerTab />
          )}
          {activeTab === 'settings' && (
            <SettingsTab onResetData={handleResetData} />
          )}
        </main>
      </div>

      {/* Security Password Gate Modal */}
      {showDbSecurityGate && (
        <DatabaseSecurityGate
          onUnlocked={() => {
            setDbUnlocked(true);
            setShowDbSecurityGate(false);
            setActiveTab('dbAccess');
          }}
          onCancel={() => setShowDbSecurityGate(false)}
        />
      )}
    </div>
  );
}
