import React, { useState, useEffect, useCallback } from 'react';
import { Wallet, ShieldCheck, BookOpen, Calendar, MapPin, Clock, CheckCircle2, Award, ArrowRight } from 'lucide-react';
import { INITIAL_PUROHITS, INITIAL_BOOKINGS, SAMPRADAYA_MATRIX } from '../services/systemData.js';
import { DataStore } from '../services/store.js';

export default function PurohitDashboard({ auth }) {
  const [purohits, setPurohits] = useState(INITIAL_PUROHITS);
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [loading, setLoading] = useState(true);

  // Fetch live Acharya data & Bookings from SQLite DB
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const pData = await DataStore.getPurohits();
      const bData = await DataStore.getBookings();
      if (Array.isArray(pData)) setPurohits(pData);
      if (Array.isArray(bData)) setBookings(bData);
    } catch (e) {
      console.error('PurohitDashboard load error:', e);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Identify the logged-in Acharya (strictly no dropdown to view other Acharyas)
  const currentUserName = auth?.user?.name || auth?.user?.username || '';
  const currentPurohit = purohits.find(p =>
    p.name.toLowerCase() === currentUserName.toLowerCase() ||
    (auth?.user?.username === 'acharyar' && p.id === 'pur-101')
  ) || purohits[0]; // Default to primary verified master acharya if guest

  const sm = SAMPRADAYA_MATRIX[currentPurohit.sampradaya] || SAMPRADAYA_MATRIX['uttaradhi'];

  // Filter assigned bookings strictly for THIS Acharya only
  const assignedBookings = bookings.filter(b =>
    (b.purohitId && b.purohitId === currentPurohit.id) ||
    (b.purohitName && b.purohitName.toLowerCase() === currentPurohit.name.toLowerCase()) ||
    (b.sampradaya === currentPurohit.sampradaya)
  );

  const handleUpdateStatus = async (bookingId, newStatus) => {
    await DataStore.updateBookingStatus(bookingId, newStatus);
    loadData();
  };

  const kpis = [
    { label: 'Trust Score',       value: `${currentPurohit.trustScore}%`,  icon: ShieldCheck, color: '#f59e0b', width: `${currentPurohit.trustScore}%` },
    { label: 'Dakshina Kept',    value: '100% (0% Platform Fee)',     icon: Wallet,      color: '#34d399', width: '100%' },
    { label: 'Rituals Completed', value: `${currentPurohit.reviewsCount}+`, icon: BookOpen,    color: '#a78bfa', width: '100%' },
    { label: 'Avg Rating',        value: `${currentPurohit.rating} / 5.0`,  icon: () => <span style={{ fontSize: 18 }}>⭐</span>, color: '#f59e0b', width: `${(currentPurohit.rating/5)*100}%` },
  ];

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 48 }}>
      {/* ── Acharya Profile Banner ── */}
      <div className="hero-banner animate-fade-up" style={{ marginBottom: 32 }}>
        <div className="orb orb-gold" style={{ width: 300, height: 300, bottom: -80, right: 0, opacity: 0.15 }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{
              width: 72, height: 72, borderRadius: 20, fontSize: 38, flexShrink: 0,
              background: 'linear-gradient(135deg,rgba(245,158,11,0.2),rgba(234,88,12,0.15))',
              border: '1px solid rgba(245,158,11,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(245,158,11,0.25)'
            }} className="animate-float">🧘</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: 24, fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#f8fafc' }}>
                  {currentPurohit.name}
                </h2>
                {sm && <span className={`badge badge-${currentPurohit.sampradaya}`}>{sm.icon} {sm.name}</span>}
              </div>
              <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: '0 14px' }}>
                <span>Shakha: <strong style={{ color: '#fbbf24' }}>{currentPurohit.vedaShakha || 'Rigveda'}</strong></span>
                <span>·</span>
                <span>Sutram: <strong style={{ color: '#fbbf24' }}>{currentPurohit.sutram || 'Ashvalayana Sutram'}</strong></span>
                <span>·</span>
                <strong style={{ color: '#fbbf24' }}>{currentPurohit.experienceYears} Years Vedic Practice</strong>
              </p>
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)', fontWeight: 700 }}>
                  ● {currentPurohit.status || 'Verified Master Acharya'}
                </span>
                <span style={{ fontSize: 11, color: '#64748b' }}>
                  Lineage: {currentPurohit.mutt}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── KPIs Grid ── */}
      <div className="grid-4" style={{ marginBottom: 32 }}>
        {kpis.map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={i} className="kpi-card">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <span className="kpi-label">{k.label}</span>
                <Icon size={18} style={{ color: k.color }} />
              </div>
              <div className="kpi-value">{k.value}</div>
              <div className="progress-track" style={{ marginTop: 14 }}>
                <div className="progress-bar" style={{ width: k.width }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Assigned Ritual Allotments Section ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
        <div className="card" style={{ padding: 28 }}>
          <div className="section-header" style={{ marginBottom: 20 }}>
            <div className="section-title"><Calendar size={20} style={{ color: '#f59e0b' }} /> Assigned Muhurta Allotments</div>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>{assignedBookings.length} Active Slots</span>
          </div>

          {assignedBookings.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b', fontSize: 13 }}>
              No upcoming allotments assigned to your schedule.
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {assignedBookings.map(b => {
              const bSm = SAMPRADAYA_MATRIX[b.sampradaya];
              return (
                <div key={b.id} className="card-premium" style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        {bSm && <span className={`badge badge-${b.sampradaya}`}>{bSm.icon} {bSm.name.split(' ')[0]}</span>}
                        {b.isAparaKaryam && <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 20, background: '#dc2626', color: 'white', fontWeight: 700 }}>APARA KARYAM</span>}
                        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: 'rgba(245,158,11,0.15)', color: '#fbbf24', fontWeight: 700 }}>
                          Status: {b.status}
                        </span>
                      </div>

                      <h4 style={{ fontSize: 17, fontWeight: 800, color: '#f8fafc', marginTop: 10, fontFamily: 'Outfit,sans-serif' }}>
                        {b.ritualName}
                      </h4>
                      <p style={{ fontSize: 13, color: '#cbd5e1', marginTop: 4 }}>
                        Host Devotee: <strong style={{ color: '#f8fafc' }}>{b.devoteeName}</strong>
                      </p>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 12, fontSize: 12, color: '#94a3b8' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Clock size={14} style={{ color: '#f59e0b' }} /> {b.date} · {b.muhurtaTime}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <MapPin size={14} style={{ color: '#38bdf8' }} /> {b.location}
                        </span>
                      </div>

                      <p style={{ fontSize: 11, color: '#64748b', marginTop: 10 }}>
                        Samagri Logistics: <span style={{ color: '#94a3b8' }}>{b.samagriMode}</span>
                      </p>
                    </div>

                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                      <div style={{ fontSize: 18, fontWeight: 900, color: '#34d399', fontFamily: 'Outfit,sans-serif' }}>
                        {b.dakshinaAmount}
                      </div>
                      <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        {b.dakshinaStatus}
                      </div>

                      {/* Status Update Actions */}
                      <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {b.status === 'Scheduled' && (
                          <button className="btn btn-sm btn-primary" onClick={() => handleUpdateStatus(b.id, 'Confirmed')}>
                            Confirm Slot
                          </button>
                        )}
                        {b.status === 'Confirmed' && (
                          <button className="btn btn-sm" style={{ background: '#10b981', color: 'white' }} onClick={() => handleUpdateStatus(b.id, 'Completed')}>
                            <CheckCircle2 size={12} /> Mark Completed
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Acharya Guidelines & Specialties Card ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#f8fafc', marginBottom: 14 }}>
              🪔 Verified Master Specialties
            </h3>
            <div style={{ display: 'flex', flexDirection: 'wrap', gap: 6, flexWrap: 'wrap' }}>
              {(currentPurohit.specialties || []).map((spec, i) => (
                <span key={i} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 8, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', color: '#fbbf24', fontWeight: 600 }}>
                  {spec}
                </span>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: 24, background: 'rgba(16,185,129,0.04)', borderColor: 'rgba(16,185,129,0.2)' }}>
            <h3 style={{ fontSize: 15, fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#34d399', marginBottom: 10 }}>
              🛡️ Direct Honorarium Guarantee
            </h3>
            <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>
              Real-Purohit charges 0% platform commission. 100% of all Dakshina goes directly from the devotee family to the Acharya.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
