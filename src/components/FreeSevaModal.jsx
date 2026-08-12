import React, { useState } from 'react';
import { X, CheckCircle2, Calendar, Clock, Video, Phone, Sparkles, User, Mail, MapPin, Heart, BookOpen, ShieldCheck } from 'lucide-react';
import { DataStore } from '../services/store.js';

export default function FreeSevaModal({ sevaType, auth, onClose, onSuccess }) {
  const isAstrology = sevaType === 'astrology';
  const isLoggedIn = auth?.isLoggedIn;
  const user = auth?.user;

  // Form State
  const [name, setName] = useState(user?.name || user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState('07:00 AM – 08:00 AM');

  // Parayanam specific
  const [gotram, setGotram] = useState(user?.gotram || 'Kashyapa');
  const [nakshatram, setNakshatram] = useState('');
  const [sankalpaIntention, setSankalpaIntention] = useState('Family Health, Peace & Spiritual Well-being');

  // Astrology specific
  const [dob, setDob] = useState('1992-05-15');
  const [tob, setTob] = useState('06:30 AM');
  const [pob, setPob] = useState('Bengaluru, Karnataka');
  const [focusArea, setFocusArea] = useState('General Kundali & Dasha Analysis');

  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const devoteeId = user?.id || 'devotee-guest';
      const devoteeName = user?.name || user?.username || name || 'Devotee';

      const sevaTitle = isAstrology
        ? 'Free 1-on-1 Jyotisha Vedic Astrology Consultation'
        : 'Free 1-on-1 Vishnu Sahasranama Parayanam';

      const bookingPayload = {
        devoteeId,
        devoteeName,
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
        location: 'In-App Live Stream (Google Meet Link Sent to Devotee Vault)'
      };

      await DataStore.createBooking(bookingPayload);
      setSubmitting(false);
      setCompleted(true);
      if (onSuccess) {
        onSuccess(`Registered for ${sevaTitle}! The video session link is delivered directly inside your App Vault.`);
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
              ? 'Your Free 1-on-1 Jyotisha Consultation is registered. The Google Meet link will be delivered directly inside your Devotee Vault in the app.'
              : 'Your Free 1-on-1 Vishnu Sahasranama Parayanam is registered. The Google Meet link will be delivered directly inside your Devotee Vault in the app.'}
          </p>

          <div style={{
            padding: '16px 20px', borderRadius: 16, background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)', textAlign: 'left', marginBottom: 24,
            display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12, color: '#94a3b8'
          }}>
            <div><strong style={{ color: '#f8fafc' }}>Devotee:</strong> {user?.name || user?.username || name}</div>
            <div><strong style={{ color: '#f8fafc' }}>Scheduled Date:</strong> {date} ({timeSlot})</div>
            <div><strong style={{ color: '#34d399' }}>Fee:</strong> 100% Truly Free (0% Platform Fee)</div>
            <div><strong style={{ color: '#fbbf24' }}>Delivery:</strong> In-App Direct Link (Devotee Vault)</div>
          </div>

          <button className="btn btn-primary btn-lg" onClick={onClose} style={{ width: '100%', justifyContent: 'center' }}>
            Got it
          </button>
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
                100% Truly Free Seva · Direct In-App Link Delivery
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
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>{user?.email || 'Logged in Devotee'}</div>
                </div>
              </div>
              <span className="badge badge-uttaradhi" style={{ fontSize: 10 }}>
                Verified Devotee Account
              </span>
            </div>
          ) : (
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
                <label style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  className="input"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                />
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, color: '#6ee7b7', fontWeight: 700, display: 'block', marginBottom: 6 }}>
                    Gotram
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={gotram}
                    onChange={e => setGotram(e.target.value)}
                    placeholder="e.g. Kashyapa"
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: '#6ee7b7', fontWeight: 700, display: 'block', marginBottom: 6 }}>
                    Janma Nakshatram / Rashi
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={nakshatram}
                    onChange={e => setNakshatram(e.target.value)}
                    placeholder="e.g. Rohini / Vrishabha"
                  />
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

          {/* Direct In-App Link Delivery Notice */}
          <div style={{
            padding: '12px 16px', borderRadius: 14,
            background: isAstrology ? 'rgba(14,165,233,0.08)' : 'rgba(16,185,129,0.08)',
            border: `1px solid ${isAstrology ? 'rgba(14,165,233,0.25)' : 'rgba(16,185,129,0.25)'}`,
            display: 'flex', alignItems: 'center', gap: 10
          }}>
            <span style={{ fontSize: 18 }}>📱</span>
            <span style={{ fontSize: 11, color: isAstrology ? '#38bdf8' : '#34d399', fontWeight: 700, lineHeight: 1.4 }}>
              100% Free Seva · Your Google Meet session link will be sent directly to your Devotee Vault inside the app.
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
