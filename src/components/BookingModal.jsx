import React, { useState } from 'react';
import { Calendar, Clock, MapPin, ShieldCheck, Flame, X, Check, Heart, Sparkles, UserCheck } from 'lucide-react';
import { DataStore } from '../services/store.js';
import { SAMPRADAYA_MATRIX } from '../services/systemData.js';

export default function BookingModal({ initialRitual, auth, onClose, onBookingSuccess }) {
  const RITUAL_OPTIONS = [
    // Standard Poojas & Homams
    { title: 'Satyanarayana Swamy Pooja & Vrata', isApara: false, isFree: false, dakshina: '₹3,500' },
    { title: 'Mahasudarshana & Dhanvantari Homam', isApara: false, isFree: false, dakshina: '₹6,500' },
    { title: 'Navagraha Shanti & Ayushya Homam', isApara: false, isFree: false, dakshina: '₹5,500' },
    { title: 'Griha Pravesham & Vastu Shanti', isApara: false, isFree: false, dakshina: '₹8,500' },
    { title: 'Namakarana (Baby Naming)', isApara: false, isFree: false, dakshina: '₹3,000' },

    // Upanyasam & Pravachanams
    { title: 'Srimad Bhagavatha Sapthaham', isApara: false, isFree: false, dakshina: '₹15,000' },
    { title: 'Srimad Ramayana Pravachanam', isApara: false, isFree: false, dakshina: '₹7,500' },
    { title: 'Mahabharatam & Bhagavad Gita', isApara: false, isFree: false, dakshina: '₹5,000' },
    { title: 'Purana & Stotra Pravachanams', isApara: false, isFree: false, dakshina: '₹4,000' },
    { title: 'Online HD Virtual Pravachanam', isApara: false, isFree: false, dakshina: '₹5,000' },

    // Apara Karyams
    { title: 'Varshika Shraaddha (Pitru Karyam)', isApara: true, isFree: false, dakshina: '₹5,000' },
    { title: 'Garuda Purana Pravachanam Discourse', isApara: true, isFree: false, dakshina: '₹4,000' },
    { title: '10–13 Day Apara Kriya (Final Rites Protocol)', isApara: true, isFree: false, dakshina: '₹12,000' },
    { title: 'Remote E-Pinda Daan', isApara: true, isFree: false, dakshina: '₹6,000' },

    // Noble Free Sevas (100% Free)
    { title: 'Free 1-on-1 Vishnu Sahasranama Parayanam', isApara: false, isFree: true, dakshina: '₹0 (100% Free Seva)' },
    { title: 'Free 1-on-1 Jyotisha Vedic Astrology', isApara: false, isFree: true, dakshina: '₹0 (100% Free Seva)' },
  ];

  const findMatch = (targetTitle) => {
    if (!targetTitle) return RITUAL_OPTIONS[0];
    const match = RITUAL_OPTIONS.find(r =>
      r.title.toLowerCase() === targetTitle.toLowerCase() ||
      r.title.toLowerCase().includes(targetTitle.toLowerCase()) ||
      targetTitle.toLowerCase().includes(r.title.toLowerCase())
    );
    if (match) return match;
    const isFree = targetTitle.toLowerCase().includes('free');
    const isApara = targetTitle.toLowerCase().includes('apara') || targetTitle.toLowerCase().includes('pinda') || targetTitle.toLowerCase().includes('shraaddha');
    return { title: targetTitle, isApara, isFree, dakshina: isFree ? '₹0 (100% Free Seva)' : '₹4,500' };
  };

  const initialMatch = findMatch(initialRitual);

  // If initialMatch title is not in RITUAL_OPTIONS, add it to options list
  const allOptions = RITUAL_OPTIONS.some(r => r.title === initialMatch.title)
    ? RITUAL_OPTIONS
    : [initialMatch, ...RITUAL_OPTIONS];

  const [ritualName, setRitualName] = useState(initialMatch.title);
  const [sampradaya, setSampradaya] = useState(auth?.user?.sampradaya || 'uttaradhi');
  const [date, setDate] = useState(new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]);
  const [muhurtaTime, setMuhurtaTime] = useState('06:30 AM – 09:00 AM (Pratah Kala)');
  const [dakshinaAmount, setDakshinaAmount] = useState(initialMatch.dakshina);
  const [samagriMode, setSamagriMode] = useState('Pandit Hand-Carried Custom Kit (100% Pure Dravya)');
  const [location, setLocation] = useState('Flat 402, Sri Vatsa Enclave, Jayanagar, Bengaluru');
  const [isApara, setIsApara] = useState(initialMatch.isApara);
  const [submitting, setSubmitting] = useState(false);

  const handleSelectRitual = (rName) => {
    setRitualName(rName);
    const rMatch = allOptions.find(r => r.title === rName);
    if (rMatch) {
      setIsApara(rMatch.isApara);
      setDakshinaAmount(rMatch.dakshina);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const devoteeName = auth?.user?.name || auth?.user?.username || 'Sri Venkatesh Rao';
      const devoteeId = auth?.user?.id || 'devotee-guest';

      const bookingPayload = {
        devoteeId,
        devoteeName,
        purohitId: 'unassigned',
        purohitName: 'Pending Admin Assignment',
        sampradaya,
        ritualName,
        date,
        muhurtaTime,
        dakshinaAmount,
        dakshinaStatus: 'Direct On-the-Spot (0% Platform Fee)',
        samagriMode,
        status: 'Pending Admin Review',
        isAparaKaryam: isApara ? 1 : 0,
        location
      };

      await DataStore.createBooking(bookingPayload);
      setSubmitting(false);
      onBookingSuccess(`Sacred ritual booking request for "${ritualName}" submitted to Admin for ${date}. Admin will assign & confirm your request!`);
      onClose();
    } catch (err) {
      console.error('Booking submission error:', err);
      setSubmitting(false);
      alert('Failed to save booking request to SQLite database: ' + err.message);
    }
  };

  const sm = SAMPRADAYA_MATRIX[sampradaya] || SAMPRADAYA_MATRIX['uttaradhi'];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="card-premium"
        style={{
          maxWidth: 620, width: '100%', borderRadius: 24, padding: 32,
          position: 'relative', overflow: 'hidden', animation: 'fadeInUp 0.25s ease',
          background: '#0c1220', border: '1px solid rgba(245,158,11,0.4)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 40px rgba(245,158,11,0.15)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg,#f59e0b,#ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, boxShadow: '0 4px 15px rgba(245,158,11,0.3)' }}>🪔</div>
            <div>
              <h2 style={{ fontSize: 20, fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#f8fafc' }}>
                Request Sacred Vedic Ritual Booking
              </h2>
              <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                Submitted directly to Admin · Type-Based Booking · 0% Platform Fee
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#94a3b8', borderRadius: 10, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>

        {/* Direct Admin Notice */}
        <div style={{ padding: '12px 16px', borderRadius: 14, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
          <UserCheck size={18} style={{ color: '#fbbf24', flexShrink: 0 }} />
          <p style={{ fontSize: 12, color: '#fcd34d', lineHeight: 1.5 }}>
            <strong>Direct Admin Request Protocol:</strong> You select the ritual type and date. Your request is submitted directly to the Admin desk, who assigns an authentic Acharya matching your tradition.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Select Ritual Category / Type */}
          <div>
            <label style={{ fontSize: 12, color: '#fbbf24', fontWeight: 700, display: 'block', marginBottom: 6 }}>
              Sacred Ritual / Pooja / Service Type *
            </label>
            <select
              className="select"
              value={ritualName}
              onChange={e => handleSelectRitual(e.target.value)}
            >
              {allOptions.map((r, i) => (
                <option key={i} value={r.title}>
                  {r.title} {r.isFree ? ' (100% Free Seva)' : r.isApara ? ' (Apara Karyam)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Select Sampradaya Tradition */}
          <div>
            <label style={{ fontSize: 12, color: '#fbbf24', fontWeight: 700, display: 'block', marginBottom: 6 }}>
              Family Tradition / Sampradaya Lineage
            </label>
            <select
              className="select"
              value={sampradaya}
              onChange={e => setSampradaya(e.target.value)}
            >
              {Object.entries(SAMPRADAYA_MATRIX).map(([key, item]) => (
                <option key={key} value={key}>
                  {item.icon} {item.name}
                </option>
              ))}
            </select>
            {sm && (
              <div style={{ marginTop: 6, fontSize: 11, color: '#94a3b8' }}>
                <span className={`badge badge-${sampradaya}`}>{sm.icon} {sm.name}</span> — {sm.description}
              </div>
            )}
          </div>

          {/* Date & Muhurta Time */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: '#fbbf24', fontWeight: 700, display: 'block', marginBottom: 6 }}>
                Sacred Muhurta Date *
              </label>
              <input
                type="date"
                className="input"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#fbbf24', fontWeight: 700, display: 'block', marginBottom: 6 }}>
                Time Slot / Muhurtam
              </label>
              <select className="select" value={muhurtaTime} onChange={e => setMuhurtaTime(e.target.value)}>
                <option value="05:30 AM – 07:30 AM (Brahma Muhurtam)">05:30 AM – 07:30 AM (Brahma Muhurtam)</option>
                <option value="06:30 AM – 09:00 AM (Pratah Kala)">06:30 AM – 09:00 AM (Pratah Kala)</option>
                <option value="11:45 AM – 12:30 PM (Abhijit Muhurtam)">11:45 AM – 12:30 PM (Abhijit Muhurtam)</option>
                <option value="05:30 PM – 07:30 PM (Sayam Kala)">05:30 PM – 07:30 PM (Sayam Kala)</option>
              </select>
            </div>
          </div>

          {/* Samagri Logistics Mode & Estimated Dakshina */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: '#fbbf24', fontWeight: 700, display: 'block', marginBottom: 6 }}>
                Pooja Samagri Logistics
              </label>
              <select className="select" value={samagriMode} onChange={e => setSamagriMode(e.target.value)}>
                <option value="Pandit Hand-Carried Custom Kit (100% Pure Dravya)">Pandit Hand-Carried Kit</option>
                <option value="Householder Self-Arranged Dravya (Vedic Checklist Emailed)">Householder Self-Arranged</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#fbbf24', fontWeight: 700, display: 'block', marginBottom: 6 }}>
                Direct Scholar Dakshina
              </label>
              <input
                type="text"
                className="input"
                value={dakshinaAmount}
                onChange={e => setDakshinaAmount(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Address / Location */}
          <div>
            <label style={{ fontSize: 12, color: '#fbbf24', fontWeight: 700, display: 'block', marginBottom: 6 }}>
              Ritual Venue / Residence Address *
            </label>
            <input
              type="text"
              className="input"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="Full address for Pandit arrival"
              required
            />
          </div>

          {/* Platform Policy Footer */}
          <div style={{ padding: '12px 16px', borderRadius: 12, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, color: '#34d399', fontWeight: 700 }}>
              0% Platform Fee · Submitted Directly to Admin Console
            </span>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>
              SQLite Persistent Record
            </span>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
              {submitting ? 'Submitting to Admin...' : 'Submit Request to Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

