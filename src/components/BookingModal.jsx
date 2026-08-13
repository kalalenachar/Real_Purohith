import React, { useState } from 'react';
import { Calendar, Clock, MapPin, ShieldCheck, Flame, X, Check, Heart, Sparkles, UserCheck, ArrowRight, ArrowLeft, Phone, User, Link as LinkIcon, FileText } from 'lucide-react';
import { DataStore } from '../services/store.js';
import { SAMPRADAYA_MATRIX, RASHI_LIST, NAKSHATRA_LIST } from '../services/systemData.js';

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
    { title: 'Satyanarayana Swamy Pooja & Vrata', isApara: false, isFree: false, dakshinaRange: '₹3,000 – ₹5,000' },
    { title: 'Mahasudarshana & Dhanvantari Homam', isApara: false, isFree: false, dakshinaRange: '₹5,000 – ₹8,500' },
    { title: 'Navagraha Shanti & Ayushya Homam', isApara: false, isFree: false, dakshinaRange: '₹5,000 – ₹8,000' },
    { title: 'Griha Pravesham & Vastu Shanti', isApara: false, isFree: false, dakshinaRange: '₹6,000 – ₹10,000' },
    { title: 'Namakarana (Baby Naming)', isApara: false, isFree: false, dakshinaRange: '₹3,000 – ₹5,000' },

    // Upanyasam & Pravachanams
    { title: 'Srimad Bhagavatha Sapthaham', isApara: false, isFree: false, dakshinaRange: '₹12,000 – ₹20,000' },
    { title: 'Srimad Ramayana Pravachanam', isApara: false, isFree: false, dakshinaRange: '₹5,000 – ₹9,000' },
    { title: 'Mahabharatam & Bhagavad Gita', isApara: false, isFree: false, dakshinaRange: '₹4,000 – ₹7,000' },
    { title: 'Purana & Stotra Pravachanams', isApara: false, isFree: false, dakshinaRange: '₹3,500 – ₹6,000' },
    { title: 'Online HD Virtual Pravachanam', isApara: false, isFree: false, dakshinaRange: '₹4,000 – ₹7,000' },

    // Apara Karyams
    { title: 'Varshika Shraaddha (Pitru Karyam)', isApara: true, isFree: false, dakshinaRange: '₹4,500 – ₹7,500' },
    { title: 'Garuda Purana Pravachanam Discourse', isApara: true, isFree: false, dakshinaRange: '₹3,500 – ₹6,000' },
    { title: '10–13 Day Apara Kriya (Final Rites Protocol)', isApara: true, isFree: false, dakshinaRange: '₹10,000 – ₹18,000' },
    { title: 'Remote E-Pinda Daan', isApara: true, isFree: false, dakshinaRange: '₹5,000 – ₹9,000' },

    // Noble Free Sevas (100% Free)
    { title: 'Free 1-on-1 Vishnu Sahasranama Parayanam', isApara: false, isFree: true, dakshinaRange: '₹0 (100% Free Seva)' },
    { title: 'Free 1-on-1 Jyotisha Vedic Astrology', isApara: false, isFree: true, dakshinaRange: '₹0 (100% Free Seva)' },
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
    return { title: targetTitle, isApara, isFree, dakshinaRange: isFree ? '₹0 (100% Free Seva)' : '₹3,500 – ₹6,000' };
  };

  const initialMatch = findMatch(initialRitual);

  // Step state
  const [step, setStep] = useState(1); // 1: Ritual & Location Details | 2: Contact Info & Final Submission

  // Step 1 states
  const [ritualName] = useState(initialMatch.title);
  const [sampradaya, setSampradaya] = useState(auth?.user?.sampradaya || 'secular');
  const [rashi, setRashi] = useState(auth?.user?.rashi || '');
  const [nakshatra, setNakshatra] = useState(auth?.user?.nakshatra || '');
  const [date, setDate] = useState(new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]);
  const [muhurtaTime, setMuhurtaTime] = useState('Pending Discussion with Admin');
  const [dakshinaAmount] = useState(initialMatch.dakshinaRange);
  const [samagriMode, setSamagriMode] = useState('Pending Admin Call (Pandit Kit vs Self-Arranged)');
  const [venueAddress, setVenueAddress] = useState('Flat 402, Sri Vatsa Enclave, Jayanagar, Bengaluru');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [landmarkNotes, setLandmarkNotes] = useState('');
  const [isApara] = useState(initialMatch.isApara);

  // Step 2 states
  const [guestName, setGuestName] = useState(auth?.user?.name || '');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNum, setPhoneNum] = useState(auth?.user?.phone || '');
  const [phoneError, setPhoneError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleProceedToStep2 = (e) => {
    e.preventDefault();
    if (!venueAddress.trim()) {
      alert('Please fill in your venue residence/hall address.');
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

      // Build structured location string
      let fullLocation = venueAddress.trim();
      if (googleMapsUrl.trim()) {
        fullLocation += ` | Maps: ${googleMapsUrl.trim()}`;
      }
      if (landmarkNotes.trim()) {
        fullLocation += ` | Note: ${landmarkNotes.trim()}`;
      }

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
        dakshinaAmount: `${dakshinaAmount} (Estimated Range)`,
        dakshinaStatus: 'Direct On-the-Spot (0% Platform Fee)',
        samagriMode,
        status: 'Pending Admin Review',
        isAparaKaryam: isApara ? 1 : 0,
        location: fullLocation
      };

      await DataStore.createBooking(bookingPayload);
      setSubmitting(false);
      onBookingSuccess(`Sacred ritual request for "${ritualName}" submitted to Admin for ${date}. Admin desk will call you at ${devoteePhone} to finalize Muhurtam and Dakshina!`);
      onClose();
    } catch (err) {
      console.error('Booking submission error:', err);
      setSubmitting(false);
      alert('Failed to save booking request to database: ' + err.message);
    }
  };

  const sm = SAMPRADAYA_MATRIX[sampradaya] || SAMPRADAYA_MATRIX['secular'];

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
            {/* Prominent Selected Ritual Card (No Dropdown needed) */}
            <div style={{
              padding: '16px 20px', borderRadius: 16,
              background: 'linear-gradient(135deg, rgba(245,158,11,0.14), rgba(234,88,12,0.06))',
              border: '1px solid rgba(245,158,11,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16
            }}>
              <div>
                <span style={{ fontSize: 10, color: '#f59e0b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Selected Seva Ritual
                </span>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#f8fafc', fontFamily: 'Outfit,sans-serif', marginTop: 3 }}>
                  {ritualName}
                </h3>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <span style={{ fontSize: 10, color: '#94a3b8', display: 'block' }}>Estimated Dakshina Range</span>
                <span style={{ fontSize: 15, fontWeight: 800, color: '#34d399', fontFamily: 'monospace' }}>
                  {dakshinaAmount}
                </span>
              </div>
            </div>

            {/* Direct Admin Notice */}
            <div style={{ padding: '12px 16px', borderRadius: 14, background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.25)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <UserCheck size={18} style={{ color: '#38bdf8', flexShrink: 0 }} />
              <p style={{ fontSize: 12, color: '#bae6fd', lineHeight: 1.5 }}>
                <strong>Admin Consultation Protocol:</strong> After submitting your request, the Admin desk will contact you to discuss your exact preferences, confirm Muhurtam timing, and finalize the exact Dakshina honorarium.
              </p>
            </div>

            {/* Select Sampradaya Tradition (Default: Secular) */}
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
                  <span className={`badge badge-${sampradaya}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    {sm.image ? <img src={sm.image} alt="" style={{ width: 14, height: 14, borderRadius: '50%', objectFit: 'contain' }} /> : sm.icon}
                    {sm.name}
                  </span> — {sm.description}
                </div>
              )}
            </div>

            {/* Sankalpam Janma Rashi & Janma Nakshatra */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, color: '#fbbf24', fontWeight: 700, display: 'block', marginBottom: 6 }}>
                  Janma Rashi (Moon Sign for Sankalpam)
                </label>
                <select
                  className="select"
                  value={rashi}
                  onChange={e => setRashi(e.target.value)}
                >
                  <option value="">-- Select Rashi --</option>
                  {RASHI_LIST.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: 12, color: '#fbbf24', fontWeight: 700, display: 'block', marginBottom: 6 }}>
                  Janma Nakshatra (Birth Star for Sankalpam)
                </label>
                <select
                  className="select"
                  value={nakshatra}
                  onChange={e => setNakshatra(e.target.value)}
                >
                  <option value="">-- Select Nakshatra --</option>
                  {NAKSHATRA_LIST.map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date & Muhurta Time */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, color: '#fbbf24', fontWeight: 700, display: 'block', marginBottom: 6 }}>
                  Preferred Date *
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
                  <option value="Pending Discussion with Admin">Pending Discussion with Admin</option>
                  <option value="05:30 AM – 07:30 AM (Brahma Muhurtam)">05:30 AM – 07:30 AM (Brahma Muhurtam)</option>
                  <option value="06:30 AM – 09:00 AM (Pratah Kala)">06:30 AM – 09:00 AM (Pratah Kala)</option>
                  <option value="11:45 AM – 12:30 PM (Abhijit Muhurtam)">11:45 AM – 12:30 PM (Abhijit Muhurtam)</option>
                  <option value="05:30 PM – 07:30 PM (Sayam Kala)">05:30 PM – 07:30 PM (Sayam Kala)</option>
                </select>
              </div>
            </div>

            {/* Pooja Samagri Logistics Mode */}
            <div>
              <label style={{ fontSize: 12, color: '#fbbf24', fontWeight: 700, display: 'block', marginBottom: 6 }}>
                Pooja Samagri Logistics Mode
              </label>
              <select className="select" value={samagriMode} onChange={e => setSamagriMode(e.target.value)}>
                <option value="Pending Admin Call (Pandit Kit vs Self-Arranged)">Pending Admin Call (Pandit Kit vs Self-Arranged)</option>
                <option value="Pandit Hand-Carried Custom Kit (100% Pure Dravya)">Pandit Hand-Carried Kit</option>
                <option value="Householder Self-Arranged Dravya (Vedic Checklist Emailed)">Householder Self-Arranged</option>
              </select>
            </div>

            {/* Structured Venue Location Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '16px', borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ fontSize: 12, color: '#fbbf24', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                <MapPin size={15} /> Venue Location & Directions
              </div>

              {/* Residence / Hall Address */}
              <div>
                <label style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginBottom: 4 }}>
                  Venue / Residence / Hall Address *
                </label>
                <input
                  type="text"
                  className="input"
                  value={venueAddress}
                  onChange={e => setVenueAddress(e.target.value)}
                  placeholder="e.g. Flat 402, Sri Vatsa Enclave, Jayanagar, Bengaluru"
                  required
                />
              </div>

              {/* Google Maps Location Link (Optional) */}
              <div>
                <label style={{ fontSize: 11, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                  <LinkIcon size={12} /> Google Maps Link / Location Pin URL (Optional)
                </label>
                <input
                  type="url"
                  className="input"
                  value={googleMapsUrl}
                  onChange={e => setGoogleMapsUrl(e.target.value)}
                  placeholder="e.g. https://maps.google.com/?q=12.9250,77.5938"
                />
              </div>

              {/* Landmarks / Special Notes */}
              <div>
                <label style={{ fontSize: 11, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                  <FileText size={12} /> Landmarks or Special Instructions for Pandit (Optional)
                </label>
                <input
                  type="text"
                  className="input"
                  value={landmarkNotes}
                  onChange={e => setLandmarkNotes(e.target.value)}
                  placeholder="e.g. Near Big Banyan Tree, 4th Floor, Elevator available"
                />
              </div>
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
                <span>💰 Dakshina Range: <strong style={{ color: '#34d399' }}>{dakshinaAmount}</strong></span>
              </p>
              <p style={{ fontSize: 11, color: '#64748b', marginTop: 6 }}>
                📍 Venue: {venueAddress} {googleMapsUrl && ' (Google Maps Pin Attached)'}
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
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <label style={{ fontSize: 12, color: '#fbbf24', fontWeight: 700 }}>
                    Guest Contact Information *
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
                    Admin desk will reach you on WhatsApp / Phone to discuss your preferences and confirm Muhurtam.
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
