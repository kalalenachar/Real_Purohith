import React, { useState } from 'react';
import { Calendar, Clock, MapPin, ShieldCheck, Flame, X, Check, Heart, Sparkles, UserCheck, ArrowRight, ArrowLeft, Phone, User } from 'lucide-react';
import { DataStore } from '../services/store.js';
import { SAMPRADAYA_MATRIX } from '../services/systemData.js';

const COUNTRY_CODES = [
  { code: '+91',  label: '🇮🇳 India (+91)',         flag: '🇮🇳', regex: /^[6-9]\d{9}$/,   errorMsg: 'India mobile number must be 10 digits starting with 6, 7, 8, or 9.' },
  { code: '+1',   label: '🇺🇸/🇨🇦 USA/Canada (+1)', flag: '🇺🇸', regex: /^\d{10}$/,      errorMsg: 'USA/Canada mobile number must be exactly 10 digits.' },
  { code: '+44',  label: '🇬🇧 UK (+44)',           flag: '🇬🇧', regex: /^\d{10,11}$/,   errorMsg: 'UK mobile number must be 10 or 11 digits.' },
  { code: '+971', label: '🇦🇪 UAE (+971)',         flag: '🇦🇪', regex: /^\d{9}$/,       errorMsg: 'UAE mobile number must be 9 digits.' },
  { code: '+65',  label: '🇸🇬 Singapore (+65)',    flag: '🇸🇬', regex: /^[89]\d{7}$/,   errorMsg: 'Singapore mobile number must be 8 digits starting with 8 or 9.' },
  { code: '+61',  label: '🇦🇺 Australia (+61)',    flag: '🇦🇺', regex: /^\d{9}$/,       errorMsg: 'Australia mobile number must be 9 digits.' },
  { code: 'other',label: '🌐 Other International',flag: '🌐', regex: /^\d{7,15}$/,    errorMsg: 'International mobile number must be between 7 and 15 digits.' }
];

export default function BookingModal({ initialRitual, auth, onClose, onBookingSuccess, onOpenLogin }) {
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

  const allOptions = RITUAL_OPTIONS.some(r => r.title === initialMatch.title)
    ? RITUAL_OPTIONS
    : [initialMatch, ...RITUAL_OPTIONS];

  // Step state
  const [step, setStep] = useState(1); // 1: Ritual & Location Details | 2: Contact Info & Final Submission

  // Step 1 states
  const [ritualName, setRitualName] = useState(initialMatch.title);
  const [sampradaya, setSampradaya] = useState(auth?.user?.sampradaya || 'uttaradhi');
  const [date, setDate] = useState(new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]);
  const [muhurtaTime, setMuhurtaTime] = useState('06:30 AM – 09:00 AM (Pratah Kala)');
  const [dakshinaAmount, setDakshinaAmount] = useState(initialMatch.dakshina);
  const [samagriMode, setSamagriMode] = useState('Pandit Hand-Carried Custom Kit (100% Pure Dravya)');
  const [location, setLocation] = useState('Flat 402, Sri Vatsa Enclave, Jayanagar, Bengaluru');
  const [isApara, setIsApara] = useState(initialMatch.isApara);

  // Step 2 states
  const [guestName, setGuestName] = useState(auth?.user?.name || '');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNum, setPhoneNum] = useState(auth?.user?.phone || '');
  const [phoneError, setPhoneError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSelectRitual = (rName) => {
    setRitualName(rName);
    const rMatch = allOptions.find(r => r.title === rName);
    if (rMatch) {
      setIsApara(rMatch.isApara);
      setDakshinaAmount(rMatch.dakshina);
    }
  };

  const handleProceedToStep2 = (e) => {
    e.preventDefault();
    if (!ritualName || !date || !location.trim()) {
      alert('Please fill in ritual type, date, and venue location address.');
      return;
    }
    setStep(2);
  };

  const validatePhone = (cCode, pNum) => {
    const digitsOnly = pNum.replace(/\D/g, '');
    const config = COUNTRY_CODES.find(c => c.code === cCode) || COUNTRY_CODES[0];
    if (!digitsOnly) {
      return 'Mobile number is required.';
    }
    if (!config.regex.test(digitsOnly)) {
      return config.errorMsg;
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPhoneError('');

    const err = validatePhone(countryCode, phoneNum);
    if (err) {
      setPhoneError(err);
      return;
    }

    if (!auth?.isLoggedIn && !guestName.trim()) {
      setPhoneError('Please enter your full name.');
      return;
    }

    setSubmitting(true);

    try {
      const devoteeName = auth?.user?.name || guestName.trim() || 'Guest User';
      const devoteeId = auth?.user?.id || `dev-guest-${Date.now()}`;
      const devoteePhone = countryCode === 'other' ? phoneNum.trim() : `${countryCode} ${phoneNum.trim()}`;

      const bookingPayload = {
        devoteeId,
        devoteeName,
        devoteePhone,
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
      onBookingSuccess(`Sacred ritual booking request for "${ritualName}" submitted to Admin for ${date}. Admin desk will reach you at ${devoteePhone}!`);
      onClose();
    } catch (err) {
      console.error('Booking submission error:', err);
      setSubmitting(false);
      alert('Failed to save booking request to database: ' + err.message);
    }
  };

  const sm = SAMPRADAYA_MATRIX[sampradaya] || SAMPRADAYA_MATRIX['uttaradhi'];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="card-premium"
        style={{
          maxWidth: 640, width: '100%', borderRadius: 24, padding: 32,
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
                {step === 1 ? 'Request Sacred Vedic Ritual' : 'Step 2: Contact Details & Confirmation'}
              </h2>
              <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                Step {step} of 2 · Direct Admin Desk Request · 0% Platform Fee
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#94a3b8', borderRadius: 10, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>

        {/* Step Indicator Bar */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 4, borderRadius: 4, background: step >= 1 ? '#f59e0b' : 'rgba(255,255,255,0.1)' }} />
          <div style={{ flex: 1, height: 4, borderRadius: 4, background: step >= 2 ? '#f59e0b' : 'rgba(255,255,255,0.1)' }} />
        </div>

        {/* ── STEP 1: RITUAL & LOGISTICS DETAILS ── */}
        {step === 1 && (
          <form onSubmit={handleProceedToStep2} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Direct Admin Notice */}
            <div style={{ padding: '12px 16px', borderRadius: 14, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <UserCheck size={18} style={{ color: '#fbbf24', flexShrink: 0 }} />
              <p style={{ fontSize: 12, color: '#fcd34d', lineHeight: 1.5 }}>
                <strong>Direct Admin Request Protocol:</strong> Select ritual, date, and venue location. In the next step, specify contact details to submit directly to the Admin desk.
              </p>
            </div>

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
                placeholder="Full address for Pandit arrival or Virtual Pravachanam"
                required
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
              <button type="button" className="btn btn-ghost" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-lg" style={{ gap: 8 }}>
                Proceed to Contact Details <ArrowRight size={16} />
              </button>
            </div>
          </form>
        )}

        {/* ── STEP 2: CONTACT DETAILS & FINAL SUBMISSION ── */}
        {step === 2 && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Booking Summary Box */}
            <div style={{ padding: '14px 18px', borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: 11, color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>
                Selected Seva Summary
              </div>
              <h4 style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', fontFamily: 'Outfit,sans-serif' }}>{ritualName}</h4>
              <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: 14 }}>
                <span>📅 Date: <strong style={{ color: '#e2e8f0' }}>{date}</strong></span>
                <span>⏰ Time: <strong style={{ color: '#fbbf24' }}>{muhurtaTime}</strong></span>
                <span>💰 Dakshina: <strong style={{ color: '#34d399' }}>{dakshinaAmount}</strong></span>
              </p>
            </div>

            {/* Validation Error Banner */}
            {phoneError && (
              <div style={{ padding: '10px 14px', borderRadius: 12, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: 12, fontWeight: 700 }}>
                ⚠️ {phoneError}
              </div>
            )}

            {/* Logged in vs Guest User Contact Fields */}
            {auth?.isLoggedIn ? (
              <div style={{ padding: '14px 18px', borderRadius: 14, background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#34d399', fontWeight: 700, marginBottom: 8 }}>
                  <UserCheck size={16} /> Authenticated User Profile
                </div>
                <p style={{ fontSize: 12, color: '#e2e8f0', marginBottom: 12 }}>
                  Booking as <strong>{auth.user.name || auth.user.username}</strong> ({auth.user.gotram || 'Gotram Not Specified'})
                </p>
                <div>
                  <label style={{ fontSize: 12, color: '#fbbf24', fontWeight: 700, display: 'block', marginBottom: 6 }}>
                    Contact Mobile Number (WhatsApp / Phone) *
                  </label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <select
                      className="select"
                      style={{ width: 140 }}
                      value={countryCode}
                      onChange={e => { setCountryCode(e.target.value); setPhoneError(''); }}
                    >
                      {COUNTRY_CODES.map(c => (
                        <option key={c.code} value={c.code}>{c.label}</option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      className="input"
                      style={{ flex: 1 }}
                      placeholder="Enter mobile number"
                      value={phoneNum}
                      onChange={e => { setPhoneNum(e.target.value); setPhoneError(''); }}
                      required
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <label style={{ fontSize: 12, color: '#fbbf24', fontWeight: 700 }}>
                    Guest Contact & Contact Information *
                  </label>
                  {onOpenLogin && (
                    <button
                      type="button"
                      onClick={() => { onClose(); onOpenLogin(); }}
                      style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: 11, cursor: 'pointer', fontWeight: 700, textDecoration: 'underline' }}
                    >
                      Already have an account? Sign In
                    </button>
                  )}
                </div>

                {/* Full Name */}
                <div>
                  <label style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Full Name *</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Enter your Full Name (e.g. Ramesh Sharma)"
                    value={guestName}
                    onChange={e => setGuestName(e.target.value)}
                    required
                  />
                </div>

                {/* Country Code & Mobile Number */}
                <div>
                  <label style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginBottom: 4 }}>
                    Country Code & Mobile Number (WhatsApp / Phone) *
                  </label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <select
                      className="select"
                      style={{ width: 150 }}
                      value={countryCode}
                      onChange={e => { setCountryCode(e.target.value); setPhoneError(''); }}
                    >
                      {COUNTRY_CODES.map(c => (
                        <option key={c.code} value={c.code}>{c.label}</option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      className="input"
                      style={{ flex: 1 }}
                      placeholder="Enter mobile number"
                      value={phoneNum}
                      onChange={e => { setPhoneNum(e.target.value); setPhoneError(''); }}
                      required
                    />
                  </div>
                  <p style={{ fontSize: 10, color: '#64748b', marginTop: 4 }}>
                    Admin desk will reach you on WhatsApp / Phone to assign Acharya and confirm Muhurtam.
                  </p>
                </div>
              </div>
            )}

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
            <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', marginTop: 4 }}>
              <button type="button" className="btn btn-ghost" onClick={() => setStep(1)} disabled={submitting} style={{ gap: 6 }}>
                <ArrowLeft size={16} /> Back
              </button>
              <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
                {submitting ? 'Submitting to Admin Desk...' : 'Confirm & Submit Booking to Admin'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
