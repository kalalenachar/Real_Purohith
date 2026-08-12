import React, { useState } from 'react';
import { Wallet, ShieldCheck, BookOpen, Calendar, MapPin, Clock, Sparkles, ChevronRight } from 'lucide-react';
import { INITIAL_PUROHITS, INITIAL_BOOKINGS, SAMPRADAYA_MATRIX } from '../services/mockData.js';

export default function PurohitDashboard() {
  const [selected, setSelected] = useState(INITIAL_PUROHITS[0]);
  const sm = SAMPRADAYA_MATRIX[selected.sampradaya];
  const bookings = INITIAL_BOOKINGS.filter(b => b.purohitId === selected.id || b.sampradaya === selected.sampradaya);

  const kpis = [
    { label: 'Trust Score',       value: `${selected.trustScore}%`,  icon: ShieldCheck, color: '#f59e0b' },
    { label: 'Dakshina Kept',    value: '100% (0% Deduction)',       icon: Wallet,      color: '#34d399' },
    { label: 'Rituals Completed', value: `${selected.reviewsCount}+`, icon: BookOpen,    color: '#a78bfa' },
    { label: 'Avg Rating',        value: `${selected.rating} / 5.0`,  icon: () => <span style={{ fontSize: 18 }}>⭐</span>, color: '#f59e0b' },
  ];

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 48 }}>
      {/* Acharya Banner */}
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
                <h2 style={{ fontSize: 22, fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#f8fafc' }}>{selected.name}</h2>
                {sm && <span className={`badge badge-${selected.sampradaya}`}>{sm.icon} {sm.name}</span>}
              </div>
              <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 5, display: 'flex', flexWrap: 'wrap', gap: '0 14px' }}>
                <span>{selected.vedaShakha}</span>
                <span>·</span>
                <span>{selected.sutram}</span>
                <span>·</span>
                <strong style={{ color: '#fbbf24' }}>{selected.experienceYears} Years Experience</strong>
              </p>
              <p style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{selected.status}</p>
            </div>
          </div>
          <select className="select" style={{ width: 'auto', minWidth: 220 }}
            value={selected.id} onChange={e => setSelected(INITIAL_PUROHITS.find(p => p.id === e.target.value))}>
            {INITIAL_PUROHITS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
      </div>

      {/* KPIs */}
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
                <div className="progress-bar" style={{ width: k.label === 'Trust Score' ? `${selected.trustScore}%` : k.label === 'Avg Rating' ? `${(selected.rating/5)*100}%` : '100%' }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>

        {/* Allotments */}
        <div className="card" style={{ padding: 28 }}>
          <div className="section-header">
            <div className="section-title"><Calendar size={20} style={{ color: '#f59e0b' }} /> Assigned Muhurta Allotments</div>
          </div>
          {bookings.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#475569' }}>No upcoming allotments.</div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {bookings.map(b => {
              const bSm = SAMPRADAYA_MATRIX[b.sampradaya];
              return (
                <div key={b.id} className="card-premium" style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        {bSm && <span className={`badge badge-${b.sampradaya}`}>{bSm.icon} {bSm.name.split(' ')[0]}</span>}
                        {b.isAparaKaryam && <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 20, background: '#dc2626', color: 'white', fontWeight: 700 }}>APARA</span>}
                      </div>
                      <h4 style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', marginTop: 8, fontFamily: 'Outfit,sans-serif' }}>{b.ritualName}</h4>
                      <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>Devotee: <span style={{ color: '#f8fafc' }}>{b.devoteeName}</span></p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 10, fontSize: 12, color: '#64748b' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Clock size={12} style={{ color: '#f59e0b' }} />{b.date} · {b.muhurtaTime}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><MapPin size={12} />{b.location}</span>
                      </div>
                      <p style={{ fontSize: 11, color: '#64748b', marginTop: 8 }}>Samagri: <span style={{ color: '#94a3b8' }}>{b.samagriMode}</span></p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: '#34d399', fontFamily: 'monospace' }}>{b.dakshinaAmount}</div>
                      <span style={{ fontSize: 10, color: '#64748b', textAlign: 'right' }}>{b.dakshinaStatus}</span>
                      <button className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        Accept <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Coaching */}
        <div className="card" style={{ padding: 24, borderColor: 'rgba(245,158,11,0.2)', background: 'rgba(245,158,11,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <Sparkles size={18} style={{ color: '#f59e0b' }} />
            <h4 style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc', fontFamily: 'Outfit,sans-serif' }}>AI Coaching Insights</h4>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { title: 'Recitation Clarity', tip: 'Maintain steady Vedic Swara tempo — clear articulation during Gayatri and Nyaya Sudha significantly improves family engagement.' },
              { title: 'Phalasruti Explanation', tip: 'Spend 5 minutes post-ritual explaining the inner significance to young family members. This is your highest feedback differentiator.' },
              { title: 'Mandap Setup Timing', tip: 'Arrive 20 minutes before Muhurta to organize the samagri and mandap methodically to project discipline and Madi standards.' },
            ].map((item, i) => (
              <div key={i} style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#fbbf24', marginBottom: 6 }}>{item.title}</div>
                <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>{item.tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
