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
  const [phone, setPhone] = useState(user?.phone || '');
  const [password, setPassword] = useState('');
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
          className="modal-box"
          style={{
            maxWidth: 520, padding: 32, textAlign: 'center', position: 'relative',
            border: '1px solid rgba(16,185,129,0.4)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 50px rgba(16,185,129,0.15)'
          }}
          onClick={e => e.stopPropagation()}
        >
          <div style={{
            width: 64, height: 64, borderRadius: 20, margin: '0 auto 16px',
            background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32
          }}>
            {isAstrology ? '🔭' : '🙏'}
          </div>

          <h3 style={{ fontSize: 20, fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#f8fafc', marginBottom: 6 }}>
            Free Seva Confirmed!
          </h3>

          <p style={{ fontSize: 13, color: '#6ee7b7', lineHeight: 1.5, marginBottom: 18 }}>
            {isAstrology
              ? 'Your Free 1-on-1 Jyotisha Consultation is registered. The Google Meet link will be sent to your WhatsApp number & delivered directly inside your Devotee Vault.'
              : 'Your Free 1-on-1 Vishnu Sahasranama Parayanam is registered. The Google Meet link will be sent to your WhatsApp number & delivered directly inside your Devotee Vault.'}
          </p>

          <div style={{
            padding: '14px 18px', borderRadius: 14, background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)', textAlign: 'left', marginBottom: 20,
            display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12, color: '#94a3b8'
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
        className="modal-box"
        style={{
          maxWidth: 580,
          border: `1px solid ${isAstrology ? 'rgba(14,165,233,0.45)' : 'rgba(16,185,129,0.45)'}`,
          boxShadow: `0 25px 70px rgba(0,0,0,0.85), 0 0 50px ${isAstrology ? 'rgba(14,165,233,0.18)' : 'rgba(16,185,129,0.18)'}`,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="modal-header-sticky">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 14,
              background: isAstrology ? 'linear-gradient(135deg, #0ea5e9, #0284c7)' : 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
              boxShadow: `0 4px 15px ${isAstrology ? 'rgba(14,165,233,0.3)' : 'rgba(16,185,129,0.3)'}`
            }}>
              {isAstrology ? '🔭' : '🙏'}
            </div>
            <div>
              <h2 style={{ fontSize: 18, fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#f8fafc' }}>
                {isAstrology ? 'Free 1-on-1 Jyotisha Astrology' : 'Free 1-on-1 Vishnu Sahasranama'}
              </h2>
              <p style={{ fontSize: 11, color: isAstrology ? '#38bdf8' : '#6ee7b7', marginTop: 1, fontWeight: 700 }}>
                100% Truly Free Seva · WhatsApp & Devotee Vault Delivery
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#94a3b8', borderRadius: 10, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div className="modal-body-scroll">

            {/* Registered Devotee Account Pill */}
            {isLoggedIn ? (
              <div style={{
                padding: '10px 14px', borderRadius: 14,
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(245,158,11,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 18 }}>{user?.avatar || '🕉️'}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#f8fafc' }}>{user?.name || user?.username}</div>
                    <div style={{ fontSize: 10, color: '#94a3b8' }}>
                      {user?.phone ? `📞 WhatsApp: ${user.phone}` : (user?.email || 'Logged in Devotee')}
                    </div>
                  </div>
                </div>
                <span className="badge badge-uttaradhi" style={{ fontSize: 9 }}>
                  Verified Devotee Account
                </span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: 5, textTransform: 'uppercase' }}>
                      Devotee Full Name *
                    </label>
                    <input
                      type="text"
                      name="devotee_full_name"
                      autoComplete="name"
                      className="input"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Sri Sundar Rao"
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: '#25D366', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5, textTransform: 'uppercase' }}>
                      <span>💬</span> WhatsApp Number * (Mandatory)
                    </label>
                    <input
                      type="tel"
                      name="devotee_whatsapp_phone"
                      autoComplete="tel"
                      className="input"
                      style={{ borderColor: 'rgba(37, 211, 102, 0.45)' }}
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      required
                    />
                  </div>
                </div>

                {/* Inline Compact WhatsApp Notice */}
                <div style={{ fontSize: 11, color: '#86efac', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>🟢</span>
                  <span>The 1-on-1 Google Meet link & session reminders will be sent to this WhatsApp number.</span>
                </div>

                {/* Optional Vault Password Creation for Guests */}
                <div style={{
                  padding: '10px 14px', borderRadius: 12,
                  background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)',
                  display: 'flex', flexDirection: 'column', gap: 5
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <label style={{ fontSize: 11, color: '#fbbf24', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <ShieldCheck size={13} /> Optional: Set Password to unlock In-App Sacred Vault
                    </label>
                    <span style={{ fontSize: 10, color: '#64748b' }}>Instant Login</span>
                  </div>
                  <input
                    type="password"
                    name="vault_new_password"
                    autoComplete="new-password"
                    className="input"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Create a password to access your In-App Vault (optional)"
                    style={{ fontSize: 11, padding: '7px 12px' }}
                  />
                </div>
              </div>
            )}

            {/* Service Specific Fields */}
            {isAstrology ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 11, color: '#38bdf8', fontWeight: 700, display: 'block', marginBottom: 5 }}>
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
                    <label style={{ fontSize: 11, color: '#38bdf8', fontWeight: 700, display: 'block', marginBottom: 5 }}>
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
                    <label style={{ fontSize: 11, color: '#38bdf8', fontWeight: 700, display: 'block', marginBottom: 5 }}>
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
                  <label style={{ fontSize: 11, color: '#38bdf8', fontWeight: 700, display: 'block', marginBottom: 5 }}>
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
                    <label style={{ fontSize: 11, color: '#6ee7b7', fontWeight: 700, display: 'block', marginBottom: 5 }}>
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
                    <label style={{ fontSize: 11, color: '#6ee7b7', fontWeight: 700, display: 'block', marginBottom: 5 }}>
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
                    <label style={{ fontSize: 11, color: '#6ee7b7', fontWeight: 700, display: 'block', marginBottom: 5 }}>
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
                  <label style={{ fontSize: 11, color: '#6ee7b7', fontWeight: 700, display: 'block', marginBottom: 5 }}>
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
                <label style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: 5 }}>
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
                <label style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: 5 }}>
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

          </div>

          {/* Sticky Footer Action Bar */}
          <div className="modal-footer-sticky">
            <span style={{ fontSize: 11, color: '#6ee7b7', fontWeight: 700 }}>
              0% Platform Fee · 100% Free Seva
            </span>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" className="btn btn-ghost" onClick={onClose} disabled={submitting}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-lg"
                disabled={submitting}
                style={{
                  background: isAstrology ? 'linear-gradient(135deg, #0ea5e9, #0284c7)' : 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white', fontWeight: 800, padding: '10px 22px', borderRadius: 12,
                  boxShadow: `0 4px 15px ${isAstrology ? 'rgba(14,165,233,0.35)' : 'rgba(16,185,129,0.35)'}`
                }}
              >
                {submitting ? 'Confirming...' : isAstrology ? 'Confirm Free Consultation' : 'Confirm Free Seva'}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
