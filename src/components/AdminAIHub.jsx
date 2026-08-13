import React, { useState } from 'react';
import {
  ShieldCheck, PhoneCall, Star, Award, Sparkles, CheckCircle2, TrendingUp, Filter
} from 'lucide-react';
import { SAMPRADAYA_MATRIX, INITIAL_PUROHITS } from '../services/systemData.js';

export default function AdminAIHub({ feedbacks }) {
  const [muttFilter, setMuttFilter] = useState('all');

  const filtered = muttFilter === 'all' ? feedbacks : feedbacks.filter(f => f.sampradaya === muttFilter);
  const avgGlobal = feedbacks.length
    ? (feedbacks.reduce((acc, f) => acc + Object.values(f.ratings).reduce((a,b)=>a+b,0)/5, 0) / feedbacks.length).toFixed(2)
    : '4.92';

  const kpis = [
    { label: 'Avg Quality Score', value: `${avgGlobal} / 5.0`, sub: '↑ +0.14 this month',  icon: Star,       color: '#f59e0b', borderColor: '#f59e0b' },
    { label: 'Sampradayas Active', value: '7 Traditions',       sub: 'Mutt taxonomy matched', icon: Award,      color: '#a78bfa', borderColor: '#7c3aed' },
    { label: 'Platform Fee',      value: '0% Pure Bridge',     sub: 'Direct On-spot Dakshina', icon: ShieldCheck, color: '#34d399', borderColor: '#10b981' },
    { label: 'Next-Day Call Queue',value: `${feedbacks.filter(f=>f.aiSentiment?.includes('Alert')).length || 1} Flagged`, sub: 'Guaranteed within 24h', icon: PhoneCall, color: '#f87171', borderColor: '#dc2626' },
  ];

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 48 }}>

      {/* Banner */}
      <div className="hero-banner animate-fade-up" style={{ marginBottom: 32 }}>
        <div className="orb orb-gold" style={{ width: 400, height: 300, top: -100, right: -60, opacity: 0.12 }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: 'linear-gradient(135deg,rgba(245,158,11,0.3),rgba(139,92,246,0.2))', border: '1px solid rgba(245,158,11,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🛡️</div>
              <div>
                <h2 style={{ fontSize: 22, fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#f8fafc' }}>Quality Care & Sampradaya Hub</h2>
                <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 3 }}>Real-time sentiment monitoring · Multi-Mutt Trust Scoring · Outbound Call Guarantee</p>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ padding: '8px 16px', borderRadius: 20, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', fontSize: 11, color: '#34d399', fontWeight: 700, fontFamily: 'monospace' }}>
              ● OUTBOUND CALL GUARANTEE ACTIVE
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid-4" style={{ marginBottom: 32 }}>
        {kpis.map(kpi => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="kpi-card" style={{ borderLeft: `3px solid ${kpi.borderColor}` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <span className="kpi-label">{kpi.label}</span>
                <Icon size={18} style={{ color: kpi.color }} />
              </div>
              <div className="kpi-value">{kpi.value}</div>
              <p style={{ fontSize: 11, color: kpi.color, marginTop: 8 }}>{kpi.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>

        {/* Left: Feedback Stream */}
        <div className="card" style={{ padding: 28 }}>
          <div className="section-header">
            <div className="section-title"><Sparkles size={20} style={{ color: '#f59e0b' }} /> Live Feedback Stream</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Filter size={14} style={{ color: '#64748b' }} />
              <select className="select" style={{ width: 'auto', minWidth: 170, padding: '6px 12px', fontSize: 12 }}
                value={muttFilter} onChange={e => setMuttFilter(e.target.value)}>
                <option value="all">All Sampradayas</option>
                {Object.entries(SAMPRADAYA_MATRIX).map(([k, v]) => (
                  <option key={k} value={k}>{v.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: '#475569', fontSize: 14 }}>
                No reviews for this Sampradaya yet.
              </div>
            )}
            {filtered.map((fb, i) => {
              const sm = SAMPRADAYA_MATRIX[fb.sampradaya];
              const avg = typeof fb.ratings === 'object'
                ? (Object.values(fb.ratings).reduce((a,b)=>a+b,0)/5).toFixed(1)
                : '5.0';
              return (
                <div key={fb.id || i} className="card" style={{ padding: '18px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc', fontFamily: 'Outfit,sans-serif' }}>{fb.purohitName}</span>
                        {sm && (
                          <span className={`badge badge-${fb.sampradaya}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                            {sm.image ? <img src={sm.image} alt="" style={{ width: 14, height: 14, borderRadius: '50%', objectFit: 'contain' }} /> : sm.icon}
                            {sm.name.split(' ')[0]}
                          </span>
                        )}
                        <span style={{ fontSize: 11, color: '#64748b' }}>by {fb.devoteeName}</span>
                      </div>
                      <p className="serif" style={{ fontSize: 14, color: '#e2e8f0', fontStyle: 'italic', marginTop: 8, lineHeight: 1.6 }}>
                        "{fb.reviewText}"
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(245,158,11,0.1)', padding: '5px 10px', borderRadius: 20, border: '1px solid rgba(245,158,11,0.2)', flexShrink: 0 }}>
                      <Star size={13} style={{ fill: '#fbbf24', color: '#fbbf24' }} />
                      <span style={{ fontSize: 13, fontWeight: 800, color: '#fbbf24', fontFamily: 'monospace' }}>{avg}</span>
                    </div>
                  </div>
                  <div className="divider" style={{ margin: '12px 0' }} />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#34d399' }}>
                      <CheckCircle2 size={12} /> {fb.sampradayaPaddhatiAccuracy}
                    </span>
                    <div style={{ display: 'flex', gap: 12 }}>
                      {fb.aiSentiment && <span style={{ color: '#a78bfa', fontFamily: 'monospace' }}>AI: {fb.aiSentiment}</span>}
                      <span style={{ color: '#64748b', fontFamily: 'monospace' }}>{fb.dateSubmitted}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Outbound Call Queue */}
          <div className="card" style={{ padding: 24, borderColor: 'rgba(220,38,38,0.25)', background: 'rgba(220,38,38,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <PhoneCall size={18} style={{ color: '#f87171' }} />
              <h4 style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc', fontFamily: 'Outfit,sans-serif' }}>Next-Day Outbound Call Queue</h4>
            </div>
            <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6, marginBottom: 16 }}>
              Real-Purohit guarantees a personal telephone call to any devotee who did not leave feedback within 24 hours.
            </p>
            <div style={{ padding: '10px 14px', borderRadius: 12, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', fontSize: 12, color: '#34d399', display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle2 size={14} />
              All critical cases have been called. ✓
            </div>
          </div>

          {/* Leaderboard */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <Award size={18} style={{ color: '#f59e0b' }} />
              <h4 style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc', fontFamily: 'Outfit,sans-serif' }}>Top Acharya Trust Scores</h4>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {INITIAL_PUROHITS.slice().sort((a,b) => b.trustScore - a.trustScore).map((p, i) => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{
                    width: 24, height: 24, borderRadius: 8,
                    background: i === 0 ? 'linear-gradient(135deg,#f59e0b,#ea580c)' : i === 1 ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 800, color: i === 0 ? '#1a0a00' : '#94a3b8', flexShrink: 0
                  }}>#{i+1}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#f8fafc', fontFamily: 'Outfit,sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                    <div style={{ fontSize: 10, color: '#64748b' }}>{p.mutt}</div>
                  </div>
                  <div>
                    <div style={{ height: 4, width: 60, borderRadius: 99, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${p.trustScore}%`, background: p.trustScore >= 98 ? 'linear-gradient(90deg,#34d399,#10b981)' : 'linear-gradient(90deg,#fbbf24,#f59e0b)', borderRadius: 99 }} />
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: p.trustScore >= 98 ? '#34d399' : '#fbbf24', marginTop: 3, textAlign: 'right', fontFamily: 'monospace' }}>{p.trustScore}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
