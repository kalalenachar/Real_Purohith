import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, ShieldCheck, Flame, X, Check, Heart, Sparkles } from 'lucide-react';
import { DataStore } from '../services/store.js';
import { SAMPRADAYA_MATRIX, INITIAL_PUROHITS } from '../services/systemData.js';

export default function BookingModal({ purohit: initialPurohit, auth, onClose, onBookingSuccess }) {
  const [purohits, setPurohits] = useState([initialPurohit || INITIAL_PUROHITS[0]]);
  const [selectedPurohit, setSelectedPurohit] = useState(initialPurohit || INITIAL_PUROHITS[0]);
  const [ritualName, setRitualName] = useState('Satyanarayana Swamy Pooja & Vrata');
  const [date, setDate] = useState(new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]);
  const [muhurtaTime, setMuhurtaTime] = useState('06:30 AM – 09:00 AM (Pratah Kala)');
  const [dakshinaAmount, setDakshinaAmount] = useState('₹4,500');
  const [samagriMode, setSamagriMode] = useState('Pandit Hand-Carried Custom Kit (100% Pure Dravya)');
  const [location, setLocation] = useState('Flat 402, Sri Vatsa Enclave, Jayanagar, Bengaluru');
  const [isApara, setIsApara] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    DataStore.getPurohits().then(data => {
      if (Array.isArray(data) && data.length > 0) {
        setPurohits(data);
        if (!initialPurohit) setSelectedPurohit(data[0]);
      }
    });
  }, [initialPurohit]);

  const RITUAL_OPTIONS = [
    { title: 'Satyanarayana Swamy Pooja & Vrata', isApara: false, dakshina: '₹3,500' },
    { title: 'Mahasudarshana & Dhanvantari Homam', isApara: false, dakshina: '₹6,500' },
    { title: 'Navagraha Shanti & Ayushya Homam', isApara: false, dakshina: '₹5,500' },
    { title: 'Griha Pravesham & Vastu Shanti', isApara: false, dakshina: '₹8,500' },
    { title: 'Varshika Shraaddha (Pitru Karyam)', isApara: true, dakshina: '₹5,000' },
    { title: 'Garuda Purana Pravachanam Discourse', isApara: true, dakshina: '₹4,000' },
    { title: '10–13 Day Apara Kriya (Final Rites Protocol)', isApara: true, dakshina: '₹12,000' },
  ];

  const handleSelectRitual = (rName) => {
    setRitualName(rName);
    const rMatch = RITUAL_OPTIONS.find(r => r.title === rName);
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
        purohitId: selectedPurohit.id,
        purohitName: selectedPurohit.name,
        sampradaya: selectedPurohit.sampradaya || 'uttaradhi',
        ritualName,
        date,
        muhurtaTime,
        dakshinaAmount,
        dakshinaStatus: 'Direct On-the-Spot (0% Platform Fee)',
        samagriMode,
        status: 'Scheduled',
        isAparaKaryam: isApara ? 1 : 0,
        location
      };

      await DataStore.createBooking(bookingPayload);
      setSubmitting(false);
      onBookingSuccess(`Sacred ritual "${ritualName}" scheduled successfully for ${date} with ${selectedPurohit.name}. Recorded in database!`);
      onClose();
    } catch (err) {
      console.error('Booking submission error:', err);
      setSubmitting(false);
      alert('Failed to save booking to SQLite database: ' + err.message);
    }
  };

  const sm = SAMPRADAYA_MATRIX[selectedPurohit?.sampradaya || 'uttaradhi'];

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
                Schedule Sacred Vedic Ritual
              </h2>
              <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                Direct Honorarium · 0% Platform Fee · SQLite Database Persistence
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#94a3b8', borderRadius: 10, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Select Acharya */}
          <div>
            <label style={{ fontSize: 12, color: '#fbbf24', fontWeight: 700, display: 'block', marginBottom: 6 }}>
              Selected Veda Pandit / Acharya
            </label>
            <select
              className="select"
              value={selectedPurohit?.id}
              onChange={e => {
                const p = purohits.find(x => x.id === e.target.value);
                if (p) setSelectedPurohit(p);
              }}
            >
              {purohits.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.sampradaya?.toUpperCase()}) — {p.vedaShakha || 'Rigveda'}
                </option>
              ))}
            </select>
            {selectedPurohit && (
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#94a3b8' }}>
                {sm && <span className={`badge badge-${selectedPurohit.sampradaya}`}>{sm.icon} {sm.name}</span>}
                <span>·</span>
                <span style={{ color: '#34d399', fontWeight: 700 }}>🛡️ {selectedPurohit.trustScore || 98}% Trust Score</span>
              </div>
            )}
          </div>

          {/* Select Ritual */}
          <div>
            <label style={{ fontSize: 12, color: '#fbbf24', fontWeight: 700, display: 'block', marginBottom: 6 }}>
              Sacred Ritual / Karyam Type
            </label>
            <select
              className="select"
              value={ritualName}
              onChange={e => handleSelectRitual(e.target.value)}
            >
              {RITUAL_OPTIONS.map((r, i) => (
                <option key={i} value={r.title}>
                  {r.title} {r.isApara ? ' (Apara Karyam)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Date & Muhurta Time */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: '#fbbf24', fontWeight: 700, display: 'block', marginBottom: 6 }}>
                Sacred Muhurta Date
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
              Ritual Venue / Residence Address
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
              0% Platform Fee · 100% Direct Honorarium to Acharya
            </span>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>
              Direct SQLite Record
            </span>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
              {submitting ? 'Saving to Database...' : 'Confirm & Schedule Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
