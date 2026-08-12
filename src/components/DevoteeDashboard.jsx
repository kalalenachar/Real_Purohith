import React, { useState } from 'react';
import {
  Users, Calendar, ShoppingBag, BookOpen, Sparkles,
  ChevronRight, Flame, CheckCircle2, ShieldCheck, Plus,
  MapPin, Clock, Check, Star
} from 'lucide-react';
import { INITIAL_DEVOTEES, SAMPRADAYA_MATRIX, INITIAL_PUROHITS } from '../services/systemData.js';
import { calculateNextTithiAllotments } from '../services/aiTimeAllotmentEngine.js';
import { DataStore } from '../services/store.js';

const SUB_TABS = [
  { id: 'vault',    label: 'Ancestral Vault',      icon: Users },
  { id: 'tithi',   label: 'AI Tithi Reminders',   icon: Calendar },
  { id: 'booking', label: 'Book Ritual',           icon: BookOpen },
  { id: 'samagri', label: 'Samagri Checkout',      icon: ShoppingBag },
];

const SAMAGRI_DEFAULT = [
  { id: 'sg1', name: 'Fresh Mango Leaves & Banana Stems',         price: 150,  checked: true  },
  { id: 'sg2', name: 'Pooja Flowers (Jasmine, Marigold, Lotus)', price: 250,  checked: true  },
  { id: 'sg3', name: 'Turmeric, Kumkum & Chandana Pastes',        price: 100,  checked: true  },
  { id: 'sg4', name: 'Pure Cow Ghee & Camphor (Karpuram)',        price: 300,  checked: false },
  { id: 'sg5', name: 'Betel Leaves (Tamalapaku) & Nuts',          price: 120,  checked: true  },
  { id: 'sg6', name: 'Dry Fruits & Panchamrutam Bowl',            price: 350,  checked: false },
  { id: 'sg7', name: 'New Vastram (White Dhoti)',                 price: 400,  checked: true  },
  { id: 'sg8', name: 'Coconut, Banana & Sacred Fruits',           price: 180,  checked: true  },
];

const RITUAL_CARDS = [
  { icon: '🪔', title: 'Satyanarayana Vrata Pooja', desc: 'Full Katha, Ashtothram, and Archana per traditional paddhati. English/Telugu/Kannada explanation.' },
  { icon: '🔥', title: 'Mahasudarshana Homam',      desc: 'Elaborate fire ritual invoking divine protection with 108 Ahutis, Swahakara, and Purnahuti.' },
  { icon: '🎙️', title: 'Srimad Ramayana Pravachanam', desc: 'Discourse by senior Pauranika for home or hall. Sundarakanda, Seetha Rama Kalyanam & more.' },
  { icon: '🏠', title: 'Griha Pravesham',            desc: 'Vastu Pooja, Ganapati Homam, and house-warming ritual per family tradition and planetary muhurta.' },
  { icon: '👶', title: 'Namakarana (Baby Naming)',   desc: 'Sacred naming ceremony with Nakshatra-based name selection and multi-lingual explanation.' },
  { icon: '📖', title: 'Garuda Purana Pravachanam',  desc: 'STRICTLY APARA ONLY — 10–13 day Apara Karyam discourse providing solace to grieving families.', isApara: true },
];

export default function DevoteeDashboard({ onTriggerSOS, onRunBackgroundTithi, onOpenFeedback, auth, onOpenLogin, onOpenBooking }) {
  const [selectedDevotee, setSelectedDevotee] = useState(INITIAL_DEVOTEES[0]);
  const [subTab, setSubTab] = useState('vault');
  const [samagri, setSamagri] = useState(SAMAGRI_DEFAULT);
  const [delivery, setDelivery] = useState('handCarried');
  const [booked, setBooked] = useState(false);
  const [myBookings, setMyBookings] = useState([]);

  React.useEffect(() => {
    DataStore.getBookings().then(res => {
      if (Array.isArray(res)) setMyBookings(res);
    });
  }, []);

  if (!auth?.isLoggedIn) {
    return (
      <div className="container" style={{ paddingTop: 60, paddingBottom: 60, textAlign: 'center' }}>
        <div className="card-premium animate-fade-up" style={{ maxWidth: 520, margin: '0 auto', padding: '40px 32px' }}>
          <div style={{ fontSize: 52, marginBottom: 16 }} className="animate-float">🕉️</div>
          <h2 style={{ fontSize: 24, fontWeight: 900, fontFamily: 'Outfit, sans-serif', color: '#f8fafc', marginBottom: 10 }}>
            Sacred Ancestral Devotee Vault
          </h2>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 24 }}>
            To safeguard family privacy, ancestral Shraaddha records, Gotram/Sutra details, and AI Tithi allotments are protected. Please sign in or register to access your personal vault.
          </p>
          <button className="btn btn-primary btn-lg" onClick={onOpenLogin} style={{ justifyContent: 'center', width: '100%', gap: 8 }}>
            <ShieldCheck size={18} /> Sign In / Register to Access Vault
          </button>
        </div>
      </div>
    );
  }

  const tithiData = calculateNextTithiAllotments(selectedDevotee);
  const sampradaya = SAMPRADAYA_MATRIX[selectedDevotee.sampradaya];
  const total = samagri.filter(i => i.checked).reduce((s, i) => s + i.price, 0);


  const handleBook = () => {
    setBooked(true);
    setTimeout(() => setBooked(false), 5000);
  };

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 48 }}>

      {/* ── Hero Banner ── */}
      <div className="hero-banner animate-fade-up">
        {/* bg decoration */}
        <div className="orb orb-gold" style={{ width: 300, height: 300, top: -80, right: -40, opacity: 0.15 }} />
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20, position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{
              width: 68, height: 68, borderRadius: 20, flexShrink: 0,
              background: 'linear-gradient(135deg, #f59e0b, #ea580c)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 34, boxShadow: '0 8px 32px rgba(245,158,11,0.45)'
            }} className="animate-float">🕉️</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: 24, fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#f8fafc' }}>
                  {selectedDevotee.name}
                </h2>
                <span className={`badge badge-${selectedDevotee.sampradaya}`}>{sampradaya?.name}</span>
              </div>
              <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: '0 14px' }}>
                <span>Gotram: <strong style={{ color: '#fbbf24' }}>{selectedDevotee.gotram}</strong></span>
                <span>Shakha: <strong style={{ color: '#fbbf24' }}>{selectedDevotee.vedaShakha}</strong></span>
                <span>Sutram: <strong style={{ color: '#fbbf24' }}>{selectedDevotee.sutram}</strong></span>
                <span>Kula Daivam: <strong style={{ color: '#fbbf24' }}>{selectedDevotee.kulaDaivam}</strong></span>
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
            <select
              className="select"
              style={{ width: 'auto', minWidth: 200 }}
              value={selectedDevotee.id}
              onChange={e => setSelectedDevotee(INITIAL_DEVOTEES.find(d => d.id === e.target.value))}
            >
              {INITIAL_DEVOTEES.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>

            <button className="btn btn-ghost btn-sm" onClick={() => onRunBackgroundTithi(selectedDevotee)}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={14} /> Recalculate Tithis
            </button>

            <button className="btn btn-danger btn-sm sos-btn" onClick={onTriggerSOS}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Flame size={14} /> 30-Min Emergency SOS
            </button>
          </div>
        </div>
      </div>

      {/* ── Sub Tabs ── */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 28, overflowX: 'auto', paddingBottom: 4 }}>
        {SUB_TABS.map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              className={`nav-tab${subTab === t.id ? ' active' : ''}`}
              style={{ fontSize: 13, padding: '8px 18px' }}
              onClick={() => setSubTab(t.id)}
            >
              <Icon size={15} /> {t.label}
              {t.id === 'tithi' && ` (${tithiData.totalAllotments})`}
            </button>
          );
        })}
      </div>

      {/* ── Booking Success Toast ── */}
      {booked && (
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 12,
          padding: '16px 20px', borderRadius: 16, marginBottom: 20,
          background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.35)',
          animation: 'fadeInUp 0.35s ease'
        }}>
          <CheckCircle2 size={20} style={{ color: '#34d399', flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ fontWeight: 700, color: '#f8fafc', fontSize: 14 }}>Booking Confirmed — 0% Platform Fee!</p>
            <p style={{ fontSize: 12, color: '#6ee7b7', marginTop: 2 }}>
              Assigned Acharya will call within 15 minutes. Pay Dakshina directly on the spot.
            </p>
          </div>
        </div>
      )}

      {/* ── VAULT TAB ── */}
      {subTab === 'vault' && (
        <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Active Seva Bookings & In-App Google Meet Links Section */}
          <div className="card" style={{ padding: 28, borderColor: 'rgba(14,165,233,0.3)', background: 'rgba(14,165,233,0.03)' }}>
            <div className="section-header">
              <div className="section-title" style={{ color: '#38bdf8' }}>
                📱 Active Seva Bookings & Live Session Links
              </div>
              <span className="badge badge-uttaradhi">In-App Vault Delivery</span>
            </div>

            {(() => {
              const activeSevas = myBookings.filter(b => b.status !== 'Completed' && b.status !== 'Cancelled');
              if (activeSevas.length === 0) {
                return (
                  <p style={{ fontSize: 12, color: '#94a3b8' }}>
                    No active live sevas currently scheduled. Register for a Free Seva or schedule a ritual to view your live meeting link here.
                  </p>
                );
              }
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {activeSevas.map((b, idx) => {
                    const hasMeetUrl = Boolean(b.location && (b.location.startsWith('http://') || b.location.startsWith('https://')));
                    const meetUrl = hasMeetUrl ? b.location.match(/https?:\/\/[^\s]+/)?.[0] : null;

                    return (
                      <div key={b.id || idx} className="card-premium" style={{ padding: '18px 22px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                              <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#f59e0b', fontWeight: 700 }}>{b.id}</span>
                              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: 'rgba(16,185,129,0.15)', color: '#34d399', fontWeight: 700 }}>
                                {b.status || 'Scheduled'}
                              </span>
                              <span style={{ fontSize: 11, color: '#38bdf8', fontWeight: 700 }}>
                                {b.dakshinaAmount}
                              </span>
                            </div>

                            <h4 style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', fontFamily: 'Outfit,sans-serif' }}>
                              {b.ritualName}
                            </h4>

                            <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4, display: 'flex', gap: 12 }}>
                              <span>📅 Date: <strong style={{ color: '#e2e8f0' }}>{b.date}</strong></span>
                              <span>⏰ Slot: <strong style={{ color: '#fbbf24' }}>{b.muhurtaTime}</strong></span>
                            </p>
                          </div>

                          <div>
                            {hasMeetUrl && meetUrl ? (
                              <a
                                href={meetUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary"
                                style={{
                                  background: 'linear-gradient(135deg, #10b981, #059669)',
                                  color: 'white', textDecoration: 'none', fontWeight: 800,
                                  display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px'
                                }}
                              >
                                📹 Join Live Google Meet Session
                              </a>
                            ) : (
                              <span style={{ fontSize: 11, padding: '6px 14px', borderRadius: 12, background: 'rgba(245,158,11,0.08)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.25)', fontWeight: 700 }}>
                                ⏳ Meet Link Pending Admin Dispatch
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>

          <div className="card" style={{ padding: 28 }}>
            <div className="section-header">
              <div className="section-title"><Users size={20} style={{ color: '#f59e0b' }} /> Ancestral Shraaddha Ledger</div>
              <button className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Plus size={14} /> Add Ancestor
              </button>
            </div>
            <div className="grid-2">
              {selectedDevotee.ancestors.map(anc => (
                <div key={anc.id} className="acharya-card" style={{ cursor: 'default' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: 1 }}>
                    {anc.relation}
                  </div>
                  <h4 style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', marginTop: 6, fontFamily: 'Outfit,sans-serif' }}>
                    {anc.name}
                  </h4>
                  <p className="serif" style={{ fontSize: 15, color: '#fcd34d', marginTop: 8, fontStyle: 'italic' }}>
                    {anc.month} · {anc.paksha} Paksha · {anc.tithi}
                  </p>
                  <p style={{ fontSize: 12, color: '#64748b', marginTop: 6 }}>Passing Year: {anc.passingYear}</p>
                  <div className="divider" style={{ marginTop: 14, marginBottom: 12 }} />
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setSubTab('tithi')}
                    style={{ width: '100%', justifyContent: 'space-between' }}
                  >
                    View AI Tithi Allotment <ChevronRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TITHI TAB ── */}
      {subTab === 'tithi' && (
        <div className="animate-fade-up">
          <div className="card" style={{ padding: 28 }}>
            <div className="section-header">
              <div className="section-title">
                <Sparkles size={20} style={{ color: '#f59e0b' }} /> AI Solar-Lunar Tithi Allotments 2026
              </div>
              <span style={{ fontSize: 12, color: '#34d399', fontFamily: 'monospace' }}>Aparahna Kaala Windows</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {tithiData.allotments.map((a, i) => (
                <div key={i} className="timeline-item">
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
                    <div className="timeline-dot" />
                    {i < tithiData.allotments.length - 1 && (
                      <div style={{ width: 2, flex: 1, minHeight: 40, background: 'linear-gradient(to bottom, rgba(245,158,11,0.3), transparent)', marginTop: 4 }} />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="card-premium" style={{ padding: '20px 24px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                        <div>
                          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                            <span className="badge badge-uttaradhi">{a.tithiDetails}</span>
                            <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace' }}>{a.gregorianDate}</span>
                          </div>
                          <h4 style={{ fontSize: 17, fontWeight: 700, color: '#f8fafc', marginTop: 10, fontFamily: 'Outfit,sans-serif' }}>
                            {a.ancestorName}
                          </h4>
                          <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{a.relation}</p>
                          <p style={{ fontSize: 13, color: '#f8fafc', marginTop: 8 }}>
                            Auspicious Window: <strong style={{ color: '#fbbf24' }}>{a.recommendedWindow}</strong>
                          </p>
                          <p style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                            Matched Lineage: <span style={{ color: '#94a3b8' }}>{a.recommendedMuttLineage}</span>
                          </p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
                          <span style={{ fontSize: 11, color: '#34d399', display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'monospace' }}>
                            <ShieldCheck size={12} /> Pre-Allotted Acharya
                          </span>
                          <button className="btn btn-primary btn-sm" onClick={handleBook}
                            style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            Confirm Allotment <ChevronRight size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── BOOKING TAB ── */}
      {subTab === 'booking' && (
        <div className="animate-fade-up">
          <div className="card" style={{ padding: 28 }}>
            <div className="section-header">
              <div className="section-title"><BookOpen size={20} style={{ color: '#f59e0b' }} /> Book Vedic Rituals & Discourses</div>
            </div>
            <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
              {RITUAL_CARDS.map((r, i) => (
                <div key={i} className={`acharya-card ${r.isApara ? 'glass-red' : ''}`}
                  style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ fontSize: 32 }}>{r.icon}</div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                      <h4 style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc', fontFamily: 'Outfit,sans-serif' }}>
                        {r.title}
                      </h4>
                      {r.isApara && (
                        <span style={{
                          fontSize: 9, padding: '2px 8px', borderRadius: 20,
                          background: '#dc2626', color: 'white', fontWeight: 700, whiteSpace: 'nowrap'
                        }}>APARA ONLY</span>
                      )}
                    </div>
                    <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 6, lineHeight: 1.6 }}>{r.desc}</p>
                  </div>
                  <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, color: '#34d399', fontWeight: 700 }}>0% Platform Fee</span>
                    <button
                      className={`btn btn-sm ${r.isApara ? 'btn-danger' : 'btn-primary'}`}
                      onClick={r.isApara ? onTriggerSOS : () => onOpenBooking && onOpenBooking(r.title)}
                    >
                      {r.isApara ? 'Request Apara' : 'Book Now'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SAMAGRI TAB ── */}
      {subTab === 'samagri' && (
        <div className="animate-fade-up">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
            <div className="card" style={{ padding: 28 }}>
              <div className="section-header">
                <div className="section-title"><ShoppingBag size={20} style={{ color: '#f59e0b' }} /> Smart Samagri Customizer</div>
                <div className="tab-group" style={{ gap: 3 }}>
                  {['handCarried', 'courier'].map(m => (
                    <button key={m} className={`tab${delivery === m ? ' active' : ''}`} onClick={() => setDelivery(m)}>
                      {m === 'handCarried' ? '🧳 Pandit Carries' : '📦 2-Day Courier'}
                    </button>
                  ))}
                </div>
              </div>
              <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 20 }}>
                Uncheck items you already own. The Pandit will bring or courier only the remaining items.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {samagri.map(item => (
                  <div
                    key={item.id}
                    className={`samagri-item${item.checked ? ' checked' : ''}`}
                    onClick={() => setSamagri(prev => prev.map(x => x.id === item.id ? { ...x, checked: !x.checked } : x))}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className={`checkbox${item.checked ? ' checked' : ''}`}>
                        {item.checked && <Check size={12} strokeWidth={3} style={{ color: '#1a0a00' }} />}
                      </div>
                      <span style={{ fontSize: 13, color: item.checked ? '#e2e8f0' : '#475569' }}>{item.name}</span>
                    </div>
                    <span style={{ fontSize: 12, fontFamily: 'monospace', fontWeight: 700, color: item.checked ? '#fbbf24' : '#475569' }}>
                      ₹{item.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="card-premium" style={{ padding: 24 }}>
              <h4 style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Outfit,sans-serif', color: '#f8fafc', marginBottom: 20 }}>Order Summary</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                {[
                  { label: `${samagri.filter(i => i.checked).length} Selected Items`, value: `₹${total}`, color: '#f8fafc' },
                  { label: delivery === 'handCarried' ? 'Pandit Carries (Pooja Day)' : '2-Day Courier Pre-Delivery', value: 'FREE', color: '#34d399' },
                  { label: 'Platform Fee (0% Policy)', value: '₹0', color: '#34d399' },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#94a3b8' }}>
                    <span>{row.label}</span>
                    <strong style={{ color: row.color, fontFamily: 'monospace' }}>{row.value}</strong>
                  </div>
                ))}
                <div className="divider" />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 800 }}>
                  <span style={{ color: '#f8fafc' }}>Total</span>
                  <span className="text-gold-gradient" style={{ fontFamily: 'monospace' }}>₹{total}</span>
                </div>
              </div>
              <button className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: 14, justifyContent: 'center' }} onClick={handleBook}>
                Confirm Samagri Kit
              </button>
              <p style={{ fontSize: 11, color: '#64748b', textAlign: 'center', marginTop: 12 }}>
                Dakshina paid directly to Acharya on the spot
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
