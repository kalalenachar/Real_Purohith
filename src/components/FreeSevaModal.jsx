import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp, Sparkles, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { DataStore } from '../services/store.js';
import { getNakshatrasForRashi, getRashisForNakshatra, handleRashiSelection, handleNakshatraSelection } from '../services/vedicAstrologyService.js';

/* ─── Inline styles for the light card ──────────────────────────────────────── */
const S = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 1000,
    background: 'rgba(10,12,20,0.65)',
    backdropFilter: 'blur(8px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '16px',
  },
  card: {
    position: 'relative',
    width: '100%', maxWidth: 480,
    background: '#ffffff',
    borderRadius: 24,
    boxShadow: '0 32px 80px rgba(0,0,0,0.28), 0 8px 24px rgba(0,0,0,0.12)',
    overflow: 'hidden',
    fontFamily: "'Outfit', 'Inter', sans-serif",
  },
  /* Gradient top accent bar */
  accentBar: (isAstrology) => ({
    height: 5,
    background: isAstrology
      ? 'linear-gradient(90deg, #0ea5e9, #6366f1, #8b5cf6)'
      : 'linear-gradient(90deg, #10b981, #f59e0b, #ef4444)',
  }),
  header: {
    padding: '20px 24px 0',
    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
  },
  icon: (isAstrology) => ({
    width: 48, height: 48, borderRadius: 16, fontSize: 26,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: isAstrology
      ? 'linear-gradient(135deg, #e0f2fe, #bae6fd)'
      : 'linear-gradient(135deg, #d1fae5, #fef3c7)',
    flexShrink: 0,
  }),
  closeBtn: {
    width: 32, height: 32, borderRadius: 10, border: 'none',
    background: '#f1f5f9', color: '#64748b', display: 'flex',
    alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
    flexShrink: 0,
  },
  title: { fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0 },
  subtitle: { fontSize: 12, fontWeight: 600, marginTop: 3 },
  /* Breadcrumb */
  breadcrumb: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '16px 24px 0',
  },
  step: (active) => ({
    fontSize: 11, fontWeight: 700,
    color: active ? '#0f172a' : '#94a3b8',
    letterSpacing: '0.04em',
  }),
  stepDot: (active, done) => ({
    width: 7, height: 7, borderRadius: '50%',
    background: done ? '#10b981' : active ? '#0f172a' : '#cbd5e1',
    transition: 'background 0.3s',
  }),
  stepLine: { flex: 1, height: 1, background: '#e2e8f0' },
  /* Body */
  body: { padding: '18px 24px 24px', display: 'flex', flexDirection: 'column', gap: 14 },
  /* Form elements */
  label: (color = '#475569') => ({
    fontSize: 11, fontWeight: 700, color, display: 'block',
    marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em',
  }),
  input: {
    width: '100%', boxSizing: 'border-box',
    padding: '10px 14px', borderRadius: 12, fontSize: 14, fontWeight: 500,
    color: '#0f172a', background: '#f8fafc',
    border: '1.5px solid #e2e8f0', outline: 'none',
    transition: 'border-color 0.2s',
  },
  inputFocus: { borderColor: '#10b981' },
  select: {
    width: '100%', boxSizing: 'border-box',
    padding: '10px 14px', borderRadius: 12, fontSize: 13, fontWeight: 500,
    color: '#0f172a', background: '#f8fafc',
    border: '1.5px solid #e2e8f0', outline: 'none', cursor: 'pointer',
  },
  /* Additional details toggle */
  toggleBtn: (open) => ({
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '7px 14px', borderRadius: 10, fontSize: 12, fontWeight: 700,
    border: `1.5px solid ${open ? '#10b981' : '#e2e8f0'}`,
    background: open ? '#f0fdf4' : '#f8fafc',
    color: open ? '#059669' : '#64748b',
    cursor: 'pointer', transition: 'all 0.2s',
  }),
  expandPanel: (open) => ({
    overflow: 'hidden',
    maxHeight: open ? 420 : 0,
    opacity: open ? 1 : 0,
    transition: 'max-height 0.35s ease, opacity 0.25s ease',
    marginTop: open ? 10 : 0,
  }),
  panel: {
    padding: '14px 16px', borderRadius: 14,
    background: '#f8fafc', border: '1.5px solid #e2e8f0',
    display: 'flex', flexDirection: 'column', gap: 12,
  },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  grid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 },
  /* Time badge */
  timeBadge: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '11px 16px', borderRadius: 12,
    background: 'linear-gradient(135deg, #ecfdf5, #fffbeb)',
    border: '1.5px solid #a7f3d0',
    fontSize: 15, fontWeight: 800, color: '#065f46',
  },
  /* Date input wrapper */
  dateInput: {
    width: '100%', boxSizing: 'border-box',
    padding: '10px 14px', borderRadius: 12, fontSize: 14, fontWeight: 500,
    color: '#0f172a', background: '#f8fafc',
    border: '1.5px solid #e2e8f0', outline: 'none',
  },
  /* Footer */
  footer: {
    padding: '0 24px 24px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
  },
  btnBack: {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '11px 20px', borderRadius: 14, fontSize: 13, fontWeight: 700,
    border: '1.5px solid #e2e8f0', background: '#f8fafc', color: '#64748b',
    cursor: 'pointer', transition: 'all 0.2s',
  },
  btnNext: (isAstrology) => ({
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    padding: '12px 24px', borderRadius: 14, fontSize: 14, fontWeight: 800,
    border: 'none', color: '#fff', cursor: 'pointer',
    background: isAstrology
      ? 'linear-gradient(135deg, #0ea5e9, #6366f1)'
      : 'linear-gradient(135deg, #10b981, #059669)',
    boxShadow: isAstrology
      ? '0 4px 16px rgba(14,165,233,0.35)'
      : '0 4px 16px rgba(16,185,129,0.35)',
    transition: 'opacity 0.2s',
  }),
  /* WhatsApp notice */
  waNotice: {
    fontSize: 11, color: '#059669', fontWeight: 600,
    display: 'flex', alignItems: 'center', gap: 6,
    background: '#f0fdf4', padding: '7px 12px', borderRadius: 10,
    border: '1px solid #a7f3d0',
  },
  /* Logged-in pill */
  loggedInPill: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '10px 14px', borderRadius: 14,
    background: '#fefce8', border: '1.5px solid #fde68a',
  },
  badge: {
    fontSize: 9, fontWeight: 800, padding: '3px 8px', borderRadius: 6,
    background: '#fde68a', color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.05em',
  },
};

/* ─── Crossfade wrapper ──────────────────────────────────────────────────────── */
function Fader({ visible, children }) {
  const [rendered, setRendered] = useState(visible);
  useEffect(() => { if (visible) setRendered(true); }, [visible]);
  return (
    <div
      style={{
        transition: 'opacity 0.25s ease',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        display: rendered ? 'block' : 'none',
      }}
      onTransitionEnd={() => { if (!visible) setRendered(false); }}
    >
      {children}
    </div>
  );
}

export default function FreeSevaModal({ sevaType, auth, onClose, onSuccess, onOpenVault }) {
  const isAstrology = sevaType === 'astrology';
  const isLoggedIn = auth?.isLoggedIn;
  const user = auth?.user;

  const accentColor = isAstrology ? '#0ea5e9' : '#10b981';

  // Step state
  const [step, setStep] = useState(1);
  const [fadeKey, setFadeKey] = useState(0);
  const [stepVisible, setStepVisible] = useState(true);

  const goTo = (n) => {
    setStepVisible(false);
    setTimeout(() => {
      setStep(n);
      setFadeKey(k => k + 1);
      setStepVisible(true);
    }, 220);
  };

  // Core fields
  const [name, setName] = useState(user?.name || user?.username || '');
  const [phone, setPhone] = useState(user?.phone || '');

  // Scheduling
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [dateChoice, setDateChoice] = useState('tomorrow'); // 'today' | 'tomorrow' | 'custom'
  const [customDate, setCustomDate] = useState(tomorrowStr);
  const date = dateChoice === 'today' ? todayStr : dateChoice === 'tomorrow' ? tomorrowStr : customDate;

  const timeSlot = isAstrology ? '07:00 AM – 08:00 AM' : '6:00 PM – 6:30 PM';
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(timeSlot);
  const [showAdditional, setShowAdditional] = useState(false);
  const [gotram, setGotram] = useState(user?.gotram || '');
  const [rashi, setRashi] = useState(user?.rashi || '');
  const [nakshatram, setNakshatram] = useState(user?.nakshatra || '');
  const [sankalpaIntention, setSankalpaIntention] = useState('Family Health, Peace & Spiritual Well-being');
  const [dob, setDob] = useState('');
  const [tob, setTob] = useState('');
  const [pob, setPob] = useState('');
  const [focusArea, setFocusArea] = useState('General Kundali & Dasha Analysis');

  const onSelectRashi = (v) => { const u = handleRashiSelection(v, nakshatram); setRashi(u.rashi); setNakshatram(u.nakshatra); };
  const onSelectNakshatra = (v) => { const u = handleNakshatraSelection(v, rashi); setRashi(u.rashi); setNakshatram(u.nakshatra); };

  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const devoteeId = user?.id || 'devotee-guest';
      const devoteeName = user?.name || user?.username || name || 'Devotee';
      const cleanPhone = phone.trim();
      const sevaTitle = isAstrology
        ? 'Free 1-on-1 Jyotisha Vedic Astrology Consultation'
        : 'Free 1-on-1 Vishnu Sahasranama Parayanam';

      await DataStore.createBooking({
        devoteeId, devoteeName, devoteePhone: cleanPhone,
        purohitId: 'unassigned',
        purohitName: isAstrology ? 'Verified Daivajna Astrologer' : 'Vedic Parayanam Acharya',
        sampradaya: isAstrology ? (user?.sampradaya || '') : '',
        ritualName: sevaTitle, date,
        muhurtaTime: isAstrology ? selectedTimeSlot : '6:00 PM – 6:30 PM',
        dakshinaAmount: '₹0 (100% Free Seva)',
        dakshinaStatus: '100% Truly Free Seva',
        samagriMode: isAstrology
          ? `Birth: ${dob || '—'} ${tob || '—'} @ ${pob || '—'} | Focus: ${focusArea}`
          : `Gotram: ${gotram || '—'} | Nakshatra: ${nakshatram || '—'} | Sankalpa: ${sankalpaIntention}`,
        status: 'Confirmed',
        isAparaKaryam: 0,
        location: 'In-App Live Stream & WhatsApp (Google Meet Link Sent to Devotee)'
      });

      setSubmitting(false);
      setCompleted(true);
      if (onSuccess) onSuccess(`Registered for ${sevaTitle}! The Google Meet session link will be delivered directly via WhatsApp.`);
    } catch (err) {
      console.error('Free seva registration error:', err);
      setSubmitting(false);
      alert('Registration error: ' + err.message);
    }
  };

  // ─── Success Screen ────────────────────────────────────────────────────────
  if (completed) {
    return (
      <div style={S.overlay} onClick={onClose}>
        <div style={{ ...S.card, padding: 32, textAlign: 'center' }} onClick={e => e.stopPropagation()}>
          <div style={S.accentBar(isAstrology)} />
          <div style={{ padding: '28px 24px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 68, height: 68, borderRadius: 20, fontSize: 34,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: isAstrology ? 'linear-gradient(135deg,#e0f2fe,#bae6fd)' : 'linear-gradient(135deg,#d1fae5,#fef3c7)',
            }}>
              {isAstrology ? '🔭' : '🙏'}
            </div>
            <div>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: 0 }}>Seva Confirmed! 🎉</h3>
              <p style={{ fontSize: 13, color: '#64748b', marginTop: 6, lineHeight: 1.6 }}>
                {isAstrology
                  ? 'Your Free Jyotisha Consultation is registered. The Google Meet link will be sent to your WhatsApp.'
                  : 'Your Free Vishnu Sahasranama Parayanam is registered. The Google Meet link will be sent to your WhatsApp.'}
              </p>
            </div>
            <div style={{
              width: '100%', padding: '14px 18px', borderRadius: 16,
              background: '#f8fafc', border: '1.5px solid #e2e8f0',
              textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: '#475569',
            }}>
              <div><span style={{ color: '#0f172a', fontWeight: 700 }}>Devotee: </span>{user?.name || user?.username || name}</div>
              <div><span style={{ color: '#0f172a', fontWeight: 700 }}>Date: </span>{date}</div>
              <div><span style={{ color: '#0f172a', fontWeight: 700 }}>Time: </span>{isAstrology ? selectedTimeSlot : '6:00 PM – 6:30 PM'}</div>
              <div style={{ color: '#059669', fontWeight: 700 }}>✅ 100% Truly Free (₹0 Platform Fee)</div>
              <div><span style={{ color: '#25D366', fontWeight: 700 }}>💬 WhatsApp: </span>{phone || user?.phone || 'Your registered number'}</div>
            </div>
            <div style={{ display: 'flex', gap: 10, width: '100%', marginTop: 4 }}>
              {onOpenVault && isLoggedIn && (
                <button onClick={onOpenVault} style={{ ...S.btnNext(isAstrology), flex: 1 }}>
                  Open My Vault 🪔
                </button>
              )}
              <button onClick={onClose} style={{ ...S.btnBack, flex: 1, justifyContent: 'center' }}>Done</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Main Modal ────────────────────────────────────────────────────────────
  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.card} onClick={e => e.stopPropagation()}>
        {/* Accent bar */}
        <div style={S.accentBar(isAstrology)} />

        {/* Header */}
        <div style={S.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={S.icon(isAstrology)}>{isAstrology ? '🔭' : '🙏'}</div>
            <div>
              <h2 style={S.title}>
                {isAstrology ? 'Free Jyotisha Astrology' : 'Free Vishnu Sahasranama'}
              </h2>
              <p style={{ ...S.subtitle, color: accentColor }}>
                100% Free Seva · WhatsApp Delivery
              </p>
            </div>
          </div>
          <button style={S.closeBtn} onClick={onClose}><X size={15} /></button>
        </div>

        {/* Breadcrumb */}
        <div style={S.breadcrumb}>
          <div style={S.stepDot(step === 1, step > 1)} />
          <span style={S.step(step === 1)}>
            {step > 1 ? <Check size={10} style={{ color: '#10b981', verticalAlign: 'middle' }} /> : null}
            {' '}Who are you?
          </span>
          <div style={S.stepLine} />
          <div style={S.stepDot(step === 2, false)} />
          <span style={S.step(step === 2)}>Pick a date</span>
          <div style={{ fontSize: 10, color: '#94a3b8', marginLeft: 'auto', whiteSpace: 'nowrap' }}>
            Step {step} of 2
          </div>
        </div>

        {/* ── STEP 1: Who are you? ─────────────────────────────────────────── */}
        <div
          key={`step-${step}-${fadeKey}`}
          style={{
            opacity: stepVisible ? 1 : 0,
            transition: 'opacity 0.22s ease',
          }}
        >
          {step === 1 && (
            <>
              <div style={S.body}>
                {isLoggedIn ? (
                  <div style={S.loggedInPill}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 22 }}>{user?.avatar || '🕉️'}</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>{user?.name || user?.username}</div>
                        <div style={{ fontSize: 11, color: '#78716c' }}>
                          {user?.phone ? `💬 ${user.phone}` : user?.email || 'Logged in'}
                        </div>
                      </div>
                    </div>
                    <span style={S.badge}>Verified</span>
                  </div>
                ) : (
                  <>
                    <div style={S.grid2}>
                      <div>
                        <label style={S.label()}>Devotee Full Name *</label>
                        <input
                          style={S.input}
                          type="text"
                          autoComplete="name"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          placeholder="e.g. Sri Sundar Rao"
                          required
                          onFocus={e => e.target.style.borderColor = accentColor}
                          onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                        />
                      </div>
                      <div>
                        <label style={S.label('#25D366')}>💬 WhatsApp Number *</label>
                        <input
                          style={{ ...S.input, borderColor: 'rgba(37,211,102,0.45)' }}
                          type="tel"
                          autoComplete="tel"
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          required
                          onFocus={e => e.target.style.borderColor = '#25D366'}
                          onBlur={e => e.target.style.borderColor = 'rgba(37,211,102,0.45)'}
                        />
                      </div>
                    </div>

                    {/* WhatsApp notice */}
                    <div style={S.waNotice}>
                      <span>🟢</span>
                      <span>Meet link & session reminders will be sent to this WhatsApp number.</span>
                    </div>

                    {/* Additional Details toggle */}
                    <div>
                      <button
                        type="button"
                        style={S.toggleBtn(showAdditional)}
                        onClick={() => setShowAdditional(v => !v)}
                      >
                        <Sparkles size={12} />
                        Additional Details
                        {showAdditional ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                      </button>

                      <div style={S.expandPanel(showAdditional)}>
                        <div style={S.panel}>
                          {isAstrology ? (
                            <>
                              <div style={S.grid3}>
                                <div>
                                  <label style={S.label('#0369a1')}>Date of Birth</label>
                                  <input style={S.dateInput} type="date" value={dob} onChange={e => setDob(e.target.value)} />
                                </div>
                                <div>
                                  <label style={S.label('#0369a1')}>Time of Birth</label>
                                  <input style={S.input} type="text" value={tob} onChange={e => setTob(e.target.value)} placeholder="06:30 AM" />
                                </div>
                                <div>
                                  <label style={S.label('#0369a1')}>Place of Birth</label>
                                  <input style={S.input} type="text" value={pob} onChange={e => setPob(e.target.value)} placeholder="City, State" />
                                </div>
                              </div>
                              <div>
                                <label style={S.label('#0369a1')}>Consultation Focus</label>
                                <select style={S.select} value={focusArea} onChange={e => setFocusArea(e.target.value)}>
                                  <option>General Kundali & Dasha Analysis</option>
                                  <option>Career, Job & Business Guidance</option>
                                  <option>Marriage, Compatibility & Family</option>
                                  <option>Health, Longevity & Graha Remedies</option>
                                  <option>Education & Academic Path</option>
                                </select>
                              </div>
                            </>
                          ) : (
                            <>
                              <div style={S.grid3}>
                                <div>
                                  <label style={S.label('#047857')}>Gotram</label>
                                  <input style={S.input} type="text" value={gotram} onChange={e => setGotram(e.target.value)} placeholder="e.g. Kashyapa" />
                                </div>
                                <div>
                                  <label style={S.label('#047857')}>Janma Rashi</label>
                                  <select style={S.select} value={rashi} onChange={e => onSelectRashi(e.target.value)}>
                                    <option value="">-- Rashi --</option>
                                    {getRashisForNakshatra(nakshatram).map(r => <option key={r} value={r}>{r}</option>)}
                                  </select>
                                </div>
                                <div>
                                  <label style={S.label('#047857')}>Janma Nakshatram</label>
                                  <select style={S.select} value={nakshatram} onChange={e => onSelectNakshatra(e.target.value)}>
                                    <option value="">-- Nakshatra --</option>
                                    {getNakshatrasForRashi(rashi).map(n => <option key={n} value={n}>{n}</option>)}
                                  </select>
                                </div>
                              </div>
                              <div>
                                <label style={S.label('#047857')}>Sankalpa / Prayer Intention</label>
                                <input style={S.input} type="text" value={sankalpaIntention} onChange={e => setSankalpaIntention(e.target.value)} placeholder="Specific prayer intent…" />
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Footer Step 1 */}
              <div style={S.footer}>
                <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>0% Platform Fee</span>
                <button
                  type="button"
                  style={S.btnNext(isAstrology)}
                  onClick={() => {
                    if (!isLoggedIn && (!name.trim() || !phone.trim())) {
                      alert('Please fill in your name and WhatsApp number.');
                      return;
                    }
                    goTo(2);
                  }}
                >
                  Next <ArrowRight size={16} />
                </button>
              </div>
            </>
          )}

          {/* ── STEP 2: Pick a date ──────────────────────────────────────────── */}
          {step === 2 && (
            <form onSubmit={handleSubmit}>
              <div style={S.body}>
                {/* Summary pill */}
                <div style={{
                  padding: '10px 14px', borderRadius: 14,
                  background: '#f8fafc', border: '1.5px solid #e2e8f0',
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <span style={{ fontSize: 20 }}>{isLoggedIn ? (user?.avatar || '🕉️') : '👤'}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{user?.name || user?.username || name}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>💬 {phone || user?.phone}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => goTo(1)}
                    style={{ marginLeft: 'auto', fontSize: 11, color: accentColor, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Edit
                  </button>
                </div>

                {/* Date toggle pills */}
                <div>
                  <label style={S.label()}>📅 When do you want the Seva?</label>

                  {/* Pill row */}
                  <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                    {[
                      { key: 'today',    label: 'Today',         sub: todayStr },
                      { key: 'tomorrow', label: 'Tomorrow',      sub: tomorrowStr },
                      { key: 'custom',   label: 'Custom Date',   sub: null },
                    ].map(({ key, label, sub }) => {
                      const active = dateChoice === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setDateChoice(key)}
                          style={{
                            flex: 1,
                            padding: '10px 8px',
                            borderRadius: 14,
                            border: `2px solid ${active ? accentColor : '#e2e8f0'}`,
                            background: active
                              ? isAstrology ? '#eff6ff' : '#f0fdf4'
                              : '#f8fafc',
                            color: active ? (isAstrology ? '#1d4ed8' : '#065f46') : '#64748b',
                            fontWeight: 700,
                            fontSize: 13,
                            cursor: 'pointer',
                            transition: 'all 0.18s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 3,
                          }}
                        >
                          <span>{label}</span>
                          {sub && (
                            <span style={{ fontSize: 10, fontWeight: 500, opacity: 0.65 }}>
                              {sub}
                            </span>
                          )}
                          {key === 'custom' && !sub && (
                            <span style={{ fontSize: 10, fontWeight: 500, opacity: 0.65 }}>pick from calendar</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom calendar — slides in */}
                  <div style={{
                    overflow: 'hidden',
                    maxHeight: dateChoice === 'custom' ? 80 : 0,
                    opacity: dateChoice === 'custom' ? 1 : 0,
                    transition: 'max-height 0.3s ease, opacity 0.22s ease',
                  }}>
                    <input
                      style={{ ...S.dateInput, marginTop: 4 }}
                      type="date"
                      value={customDate}
                      min={todayStr}
                      onChange={e => setCustomDate(e.target.value)}
                      required={dateChoice === 'custom'}
                      onFocus={e => e.target.style.borderColor = accentColor}
                      onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                    />
                  </div>
                </div>

                {/* Session time */}
                <div>
                  <label style={S.label('#047857')}>🪔 Session Time</label>
                  {isAstrology ? (
                    <select style={S.select} value={selectedTimeSlot} onChange={e => setSelectedTimeSlot(e.target.value)}>
                      <option value="07:00 AM – 08:00 AM">07:00 AM – 08:00 AM</option>
                      <option value="10:00 AM – 11:00 AM">10:00 AM – 11:00 AM</option>
                      <option value="04:00 PM – 05:00 PM">04:00 PM – 05:00 PM</option>
                      <option value="07:00 PM – 08:00 PM">07:00 PM – 08:00 PM</option>
                    </select>
                  ) : (
                    <div style={S.timeBadge}>
                      <span style={{ fontSize: 18 }}>🕕</span>
                      <span>6:00 PM – 6:30 PM</span>
                      <span style={{ marginLeft: 'auto', fontSize: 11, color: '#6b7280', fontWeight: 600 }}>Fixed</span>
                    </div>
                  )}
                </div>

                {/* Info strip */}
                <div style={{
                  padding: '10px 14px', borderRadius: 12,
                  background: '#f0fdf4', border: '1px solid #a7f3d0',
                  fontSize: 12, color: '#065f46', fontWeight: 600, lineHeight: 1.5,
                }}>
                  ✅ <strong>100% Free Seva</strong> · The Google Meet link will be sent to your WhatsApp before the session.
                </div>
              </div>

              {/* Footer Step 2 */}
              <div style={S.footer}>
                <button type="button" style={S.btnBack} onClick={() => goTo(1)}>
                  <ArrowLeft size={14} /> Back
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ ...S.btnNext(isAstrology), opacity: submitting ? 0.7 : 1 }}
                >
                  {submitting ? 'Confirming…' : isAstrology ? 'Confirm Consultation ✓' : 'Confirm Free Seva ✓'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
