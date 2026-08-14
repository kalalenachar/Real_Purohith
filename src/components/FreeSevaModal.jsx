import React, { useState } from 'react';
import { X, CheckCircle2, Calendar, Clock, Video, Phone, Sparkles, User, Mail, MapPin, Heart, BookOpen, ShieldCheck } from 'lucide-react';
import { DataStore } from '../services/store.js';
import { RASHI_LIST, NAKSHATRA_LIST, getNakshatrasForRashi, getRashisForNakshatra, handleRashiSelection, handleNakshatraSelection } from '../services/vedicAstrologyService.js';

export default function FreeSevaModal({ sevaType, auth, onClose, onSuccess, onLoginSuccess, onOpenVault }) {
  const isAstrology = sevaType === 'astrology';
  const isLoggedIn = auth?.isLoggedIn;
  const user = auth?.user;

  // Form State
  const [name, setName] = useState(user?.name || user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [date, setDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState('07:00 AM – 08:00 AM');

  // Parayanam specific
  const [gotram, setGotram] = useState(user?.gotram || '');
  const [rashi, setRashi] = useState(user?.rashi || '');
  const [nakshatram, setNakshatram] = useState(user?.nakshatra || '');
  const [sankalpaIntention, setSankalpaIntention] = useState('Family Health, Peace & Spiritual Well-being');

  const onSelectRashi = (newRashi) => {
    const updated = handleRashiSelection(newRashi, nakshatram);
    setRashi(updated.rashi);
    setNakshatram(updated.nakshatra);
  };

  const onSelectNakshatra = (newNakshatra) => {
    const updated = handleNakshatraSelection(newNakshatra, rashi);
    setRashi(updated.rashi);
    setNakshatram(updated.nakshatra);
  };

  // Astrology specific
  const [dob, setDob] = useState('1992-05-15');
  const [tob, setTob] = useState('06:30 AM');
  const [pob, setPob] = useState('Bengaluru, Karnataka');
  const [focusArea, setFocusArea] = useState('General Kundali & Dasha Analysis');

  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [registeredAccount, setRegisteredAccount] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let devoteeId = user?.id || 'devotee-guest';
      let devoteeName = user?.name || user?.username || name || 'Devotee';
      const cleanPhone = phone.trim();

      // If guest provided password, auto-register them to unlock In-App Vault
      if (!isLoggedIn && password.trim().length >= 4) {
        try {
          const regRes = await DataStore.registerUser({
            name: devoteeName,
            phone: cleanPhone,
            password: password.trim(),
            role: 'devotee',
            gotram: gotram || '',
            sampradaya: user?.sampradaya || 'uttaradhi',
            rashi: rashi || '',
            nakshatra: nakshatram || ''
          });
          if (regRes.success && regRes.auth) {
            devoteeId = regRes.auth.user.id;
            setRegisteredAccount(regRes.auth.user);
            if (onLoginSuccess) {
              onLoginSuccess(regRes.auth);
            }
          }
        } catch (regErr) {
          console.warn('Auto-registration note:', regErr);
          // If already registered or failed, proceed with guest booking
        }
      }

      const sevaTitle = isAstrology
        ? 'Free 1-on-1 Jyotisha Vedic Astrology Consultation'
        : 'Free 1-on-1 Vishnu Sahasranama Parayanam';

      const bookingPayload = {
        devoteeId,
        devoteeName,
        devoteePhone: cleanPhone,
        purohitId: 'unassigned',
        purohitName: isAstrology ? 'Verified Daivajna Astrologer' : 'Vedic Parayanam Acharya',
        sampradaya: user?.sampradaya || 'uttaradhi',
        ritualName: sevaTitle,
        date,
        muhurtaTime: timeSlot,
        dakshinaAmount: '₹0 (100% Free Seva)',
        dakshinaStatus: '100% Truly Free Seva',
        samagriMode: isAstrology
          ? `Birth: ${dob} ${tob} @ ${pob} | Focus: ${focusArea}`
          : `Gotram: ${gotram} | Nakshatra: ${nakshatram} | Sankalpa: ${sankalpaIntention}`,
        status: 'Scheduled (Link in App Vault)',
        isAparaKaryam: 0,
        location: 'In-App Live Stream & WhatsApp (Google Meet Link Sent to Devotee)'
      };

      await DataStore.createBooking(bookingPayload);
      setSubmitting(false);
      setCompleted(true);
      if (onSuccess) {
        onSuccess(`Registered for ${sevaTitle}! The Google Meet session link will be delivered directly via WhatsApp & inside your Devotee Vault.`);
      }
    } catch (err) {
      console.error('Free seva registration error:', err);
      setSubmitting(false);
      alert('Registration error: ' + err.message);
    }
  };

  if (completed) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="card-premium"
          style={{
            maxWidth: 520, width: '100%', borderRadius: 28, padding: 36,
            textAlign: 'center', position: 'relative', animation: 'fadeInUp 0.3s ease',
            background: '#0c1220', border: '1px solid rgba(16,185,129,0.4)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 50px rgba(16,185,129,0.15)'
          }}
          onClick={e => e.stopPropagation()}
        >
          <div style={{
            width: 72, height: 72, borderRadius: 24, margin: '0 auto 20px',
            background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36
          }}>
            {isAstrology ? '🔭' : '🙏'}
          </div>

          <h3 style={{ fontSize: 22, fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#f8fafc', marginBottom: 8 }}>
            Free Seva Confirmed!
          </h3>

          <p style={{ fontSize: 13, color: '#6ee7b7', lineHeight: 1.6, marginBottom: 20 }}>
            {isAstrology
              ? 'Your Free 1-on-1 Jyotisha Consultation is registered. The Google Meet link will be sent to your WhatsApp number & delivered directly inside your Devotee Vault.'
              : 'Your Free 1-on-1 Vishnu Sahasranama Parayanam is registered. The Google Meet link will be sent to your WhatsApp number & delivered directly inside your Devotee Vault.'}
          </p>

          <div style={{
            padding: '16px 20px', borderRadius: 16, background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)', textAlign: 'left', marginBottom: 24,
            display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12, color: '#94a3b8'
          }}>
            <div><strong style={{ color: '#f8fafc' }}>Devotee:</strong> {user?.name || user?.username || name}</div>
            <div><strong style={{ color: '#f8fafc' }}>Scheduled Date:</strong> {date} ({timeSlot})</div>
            <div><strong style={{ color: '#34d399' }}>Fee:</strong> 100% Truly Free (0% Platform Fee)</div>
            <div>
              <strong style={{ color: '#25D366' }}>💬 WhatsApp Delivery:</strong> {phone || user?.phone || 'Your Registered WhatsApp Number'} (Session Link will be sent here)
            </div>
            <div>
              <strong style={{ color: '#fbbf24' }}>🪔 In-App Delivery:</strong> Delivered to Devotee Vault {registeredAccount ? '(Account Active)' : ''}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            {onOpenVault && (isLoggedIn || registeredAccount) ? (
              <button className="btn btn-primary btn-lg" onClick={onOpenVault} style={{ flex: 1, justifyContent: 'center', background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                Open My Sacred Vault 🪔
              </button>
            ) : null}
            <button className="btn btn-ghost btn-lg" onClick={onClose} style={{ flex: 1, justifyContent: 'center' }}>
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="card-premium"
        style={{
          maxWidth: 580, width: '100%', borderRadius: 28, padding: 32,
          position: 'relative', overflow: 'hidden', animation: 'fadeInUp 0.3s ease',
          background: '#0c1220',
          border: `1px solid ${isAstrology ? 'rgba(14,165,233,0.4)' : 'rgba(16,185,129,0.4)'}`,
          boxShadow: `0 20px 60px rgba(0,0,0,0.8), 0 0 50px ${isAstrology ? 'rgba(14,165,233,0.15)' : 'rgba(16,185,129,0.15)'}`
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 16,
              background: isAstrology ? 'linear-gradient(135deg, #0ea5e9, #0284c7)' : 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
              boxShadow: `0 6px 20px ${isAstrology ? 'rgba(14,165,233,0.35)' : 'rgba(16,185,129,0.35)'}`
            }}>
              {isAstrology ? '🔭' : '🙏'}
            </div>
            <div>
              <h2 style={{ fontSize: 19, fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#f8fafc' }}>
                {isAstrology ? 'Free 1-on-1 Jyotisha Astrology' : 'Free 1-on-1 Vishnu Sahasranama'}
              </h2>
              <p style={{ fontSize: 11, color: isAstrology ? '#38bdf8' : '#6ee7b7', marginTop: 2, fontWeight: 700 }}>
                100% Truly Free Seva · WhatsApp & Devotee Vault Delivery
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#94a3b8', borderRadius: 10, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Registered Devotee Account Pill */}
          {isLoggedIn ? (
            <div style={{
              padding: '12px 16px', borderRadius: 16,
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(245,158,11,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 20 }}>{user?.avatar || '🕉️'}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#f8fafc' }}>{user?.name || user?.username}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>
                    {user?.phone ? `📞 WhatsApp: ${user.phone}` : (user?.email || 'Logged in Devotee')}
                  </div>
                </div>
              </div>
              <span className="badge badge-uttaradhi" style={{ fontSize: 10 }}>
                Verified Devotee Account
              </span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>
                    Devotee Full Name *
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Sri Sundar Rao"
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: '#25D366', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6, textTransform: 'uppercase' }}>
                    <span>💬</span> WhatsApp Number * (Mandatory)
                  </label>
                  <input
                    type="tel"
                    className="input"
                    style={{ borderColor: 'rgba(37, 211, 102, 0.45)' }}
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    required
                  />
                </div>
              </div>

              {/* Context Note explaining why WhatsApp is needed */}
              <div style={{
                padding: '8px 12px', borderRadius: 10,
                background: 'rgba(37, 211, 102, 0.08)', border: '1px solid rgba(37, 211, 102, 0.25)',
                fontSize: 11, color: '#86efac', display: 'flex', alignItems: 'center', gap: 8
              }}>
                <span style={{ fontSize: 14 }}>💬</span>
                <span>
                  <strong>WhatsApp Notification:</strong> The 1-on-1 Google Meet session link & Muhurtam reminder will be sent directly to this WhatsApp number before the seva.
                </span>
              </div>

              {/* Optional Vault Password Creation for Guests */}
              <div style={{
                padding: '12px 14px', borderRadius: 12,
                background: 'rgba(245, 158, 11, 0.06)', border: '1px solid rgba(245, 158, 11, 0.2)',
                display: 'flex', flexDirection: 'column', gap: 6
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <label style={{ fontSize: 11, color: '#fbbf24', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ShieldCheck size={14} /> Optional: Set Password to unlock In-App Sacred Vault
                  </label>
                  <span style={{ fontSize: 10, color: '#94a3b8' }}>Instant Login</span>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Create a password to access your In-App Vault (optional)"
                  style={{ fontSize: 11, padding: '6px 12px' }}
                />
                <span style={{ fontSize: 10, color: '#94a3b8' }}>
                  Setting a password automatically creates your devotee profile so you can join live Google Meet sessions directly inside the app.
                </span>
              </div>
            </div>
          )}

          {/* Service Specific Fields */}
          {isAstrology ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 11, color: '#38bdf8', fontWeight: 700, display: 'block', marginBottom: 6 }}>
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    className="input"
                    value={dob}
                    onChange={e => setDob(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: '#38bdf8', fontWeight: 700, display: 'block', marginBottom: 6 }}>
                    Time of Birth *
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={tob}
                    onChange={e => setTob(e.target.value)}
                    placeholder="e.g. 06:30 AM"
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: '#38bdf8', fontWeight: 700, display: 'block', marginBottom: 6 }}>
                    Place of Birth *
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={pob}
                    onChange={e => setPob(e.target.value)}
                    placeholder="City, State"
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11, color: '#38bdf8', fontWeight: 700, display: 'block', marginBottom: 6 }}>
                  Primary Consultation Focus
                </label>
                <select className="select" value={focusArea} onChange={e => setFocusArea(e.target.value)}>
                  <option value="General Kundali & Dasha Analysis">General Kundali & Dasha Analysis</option>
                  <option value="Career, Job & Business Guidance">Career, Job & Business Guidance</option>
                  <option value="Marriage, Compatibility & Family">Marriage, Compatibility & Family</option>
                  <option value="Health, Longevity & Graha Remedies">Health, Longevity & Graha Remedies</option>
                  <option value="Education & Academic Path">Education & Academic Path</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 11, color: '#6ee7b7', fontWeight: 700, display: 'block', marginBottom: 6 }}>
                    Gotram (Lineage)
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={gotram}
                    onChange={e => setGotram(e.target.value)}
                    placeholder="e.g. Naidhruva Kashyapa"
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: '#6ee7b7', fontWeight: 700, display: 'block', marginBottom: 6 }}>
                    Janma Rashi (Zodiac)
                  </label>
                  <select
                    className="select"
                    style={{ fontSize: 11 }}
                    value={rashi}
                    onChange={e => onSelectRashi(e.target.value)}
                  >
                    <option value="">-- Select Rashi --</option>
                    {getRashisForNakshatra(nakshatram).map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, color: '#6ee7b7', fontWeight: 700, display: 'block', marginBottom: 6 }}>
                    Janma Nakshatram (Star)
                  </label>
                  <select
                    className="select"
                    style={{ fontSize: 11 }}
                    value={nakshatram}
                    onChange={e => onSelectNakshatra(e.target.value)}
                  >
                    <option value="">-- Select Nakshatra --</option>
                    {getNakshatrasForRashi(rashi).map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11, color: '#6ee7b7', fontWeight: 700, display: 'block', marginBottom: 6 }}>
                  Personalized Sankalpa Prayer Intention
                </label>
                <input
                  type="text"
                  className="input"
                  value={sankalpaIntention}
                  onChange={e => setSankalpaIntention(e.target.value)}
                  placeholder="Specific prayer intent for the 1008-name recitation"
                />
              </div>
            </>
          )}

          {/* Date & Time Slot */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: 6 }}>
                Preferred Date
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
              <label style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: 6 }}>
                Preferred Time Slot
              </label>
              <select className="select" value={timeSlot} onChange={e => setTimeSlot(e.target.value)}>
                <option value="07:00 AM – 08:00 AM">07:00 AM – 08:00 AM</option>
                <option value="10:00 AM – 11:00 AM">10:00 AM – 11:00 AM</option>
                <option value="04:00 PM – 05:00 PM">04:00 PM – 05:00 PM</option>
                <option value="07:00 PM – 08:00 PM">07:00 PM – 08:00 PM</option>
              </select>
            </div>
          </div>

          {/* Direct WhatsApp & In-App Link Delivery Notice */}
          <div style={{
            padding: '12px 16px', borderRadius: 14,
            background: isAstrology ? 'rgba(14,165,233,0.08)' : 'rgba(16,185,129,0.08)',
            border: `1px solid ${isAstrology ? 'rgba(14,165,233,0.25)' : 'rgba(16,185,129,0.25)'}`,
            display: 'flex', alignItems: 'center', gap: 10
          }}>
            <span style={{ fontSize: 18 }}>💬</span>
            <span style={{ fontSize: 11, color: isAstrology ? '#38bdf8' : '#34d399', fontWeight: 700, lineHeight: 1.4 }}>
              100% Free Seva · Your 1-on-1 Google Meet session link will be sent to your WhatsApp number and delivered to your Devotee Vault.
            </span>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-lg"
              disabled={submitting}
              style={{
                background: isAstrology ? '#0ea5e9' : '#10b981',
                color: 'white', fontWeight: 800, padding: '12px 24px', borderRadius: 14
              }}
            >
              {submitting ? 'Confirming...' : isAstrology ? 'Confirm Free Consultation' : 'Confirm Free Seva'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
