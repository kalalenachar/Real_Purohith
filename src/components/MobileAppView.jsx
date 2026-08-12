import React, { useState } from 'react';
import { Bell, Flame, ShieldCheck, BookOpen, Star, MapPin } from 'lucide-react';
import { SAMPRADAYA_MATRIX, INITIAL_PUROHITS } from '../services/mockData.js';

export default function MobileAppView({ onTriggerSOS, onOpenFeedback }) {
  const [os, setOs] = useState('android');
  const [sampradaya, setSampradaya] = useState('uttaradhi');
  const [pushVisible, setPushVisible] = useState(false);

  const info = SAMPRADAYA_MATRIX[sampradaya];
  const purohits = INITIAL_PUROHITS.filter(p => p.sampradaya === sampradaya);
  const allPurohits = INITIAL_PUROHITS.filter(p => p.sampradaya === sampradaya || purohits.length === 0);
  const list = purohits.length ? purohits : INITIAL_PUROHITS.slice(0, 3);

  const showPush = () => {
    setPushVisible(true);
    setTimeout(() => setPushVisible(false), 5000);
  };

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 48 }}>
      {/* Controls */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between',
        gap: 16, padding: '20px 24px', borderRadius: 20,
        background: 'rgba(12,18,32,0.7)', border: '1px solid rgba(255,255,255,0.07)',
        marginBottom: 32
      }}>
        <div>
          <h2 style={{ fontSize: 18, fontFamily: 'Outfit,sans-serif', fontWeight: 700, color: '#f8fafc' }}>
            Native Mobile App Simulator
          </h2>
          <p style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
            {os === 'android' ? 'Android FCM Push Notifications' : 'iOS APNs Push Notifications'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div className="tab-group">
            {['android', 'ios'].map(o => (
              <button key={o} className={`tab${os === o ? ' active' : ''}`} onClick={() => setOs(o)}>
                {o === 'android' ? '🤖 Android' : '🍎 iOS'}
              </button>
            ))}
          </div>
          <button className="btn btn-ghost btn-sm" onClick={showPush}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Bell size={14} /> Test Push
          </button>
        </div>
      </div>

      {/* Phone Frame */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="phone-shell" style={{
          boxShadow: `0 0 0 8px rgba(255,255,255,0.03), 0 0 0 10px rgba(255,255,255,0.015), 0 50px 100px rgba(0,0,0,0.85), 0 0 60px ${os === 'android' ? 'rgba(16,185,129,0.12)' : 'rgba(14,165,233,0.12)'}`
        }}>
          {/* Dynamic Island */}
          <div className="phone-island">
            <div className="island-camera" />
            <div className="island-mic" />
          </div>

          {/* Push Banner */}
          {pushVisible && (
            <div className="push-banner">
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>🪔</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#f8fafc' }}>🪔 Tithi Allotment Reminder</span>
                    <span style={{ fontSize: 10, color: '#64748b' }}>now</span>
                  </div>
                  <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 2, lineHeight: 1.5 }}>
                    Bhadrapada Krishna Navami on Aug 14 — Pre-allotted {info.name} Acharya ready. 0% fee.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Screen Content */}
          <div className="phone-screen">
            {/* App Bar */}
            <div style={{
              padding: '12px 16px', background: 'rgba(5,8,16,0.95)', position: 'sticky', top: 0, zIndex: 20,
              borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>🪔</span>
                <div>
                  <div style={{ fontSize: 12, fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#f8fafc' }}>REAL-PUROHIT</div>
                  <div style={{ fontSize: 9, color: '#f59e0b', fontFamily: 'monospace' }}>0% Fee · Direct Dakshina</div>
                </div>
              </div>
              <button onClick={onTriggerSOS} style={{
                padding: '4px 10px', borderRadius: 20, background: '#dc2626',
                border: 'none', color: 'white', fontSize: 10, fontWeight: 800,
                display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer'
              }} className="sos-btn">
                <Flame size={10} /> SOS
              </button>
            </div>

            {/* Noble Guarantee Banner */}
            <div style={{ margin: '12px', padding: '12px 14px', borderRadius: 14, background: 'linear-gradient(135deg, rgba(245,158,11,0.12),rgba(234,88,12,0.07))', border: '1px solid rgba(245,158,11,0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <ShieldCheck size={13} style={{ color: '#f59e0b' }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#fbbf24' }}>Noble Service Guarantee</span>
              </div>
              <p style={{ fontSize: 10, color: '#94a3b8', lineHeight: 1.5 }}>
                0% Platform Fee. Devotees pay the Acharya directly on the spot. No live GPS tracking.
              </p>
            </div>

            {/* Sampradaya Filter */}
            <div style={{ padding: '0 12px 10px' }}>
              <p style={{ fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                Select Lineage / Sampradaya
              </p>
              <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
                {Object.entries(SAMPRADAYA_MATRIX).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => setSampradaya(key)}
                    className={`badge badge-${key}`}
                    style={{
                      cursor: 'pointer', border: 'none', whiteSpace: 'nowrap', padding: '5px 10px',
                      outline: sampradaya === key ? `2px solid #fbbf24` : 'none',
                      outlineOffset: 2,
                      transform: sampradaya === key ? 'scale(1.05)' : 'scale(1)',
                      transition: 'all 0.2s'
                    }}
                  >
                    {val.icon} {val.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Mutt Info */}
            <div style={{ margin: '0 12px 12px', padding: '10px 12px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#f8fafc', marginBottom: 3 }}>{info.icon} {info.name}</div>
              <p style={{ fontSize: 10, color: '#64748b', lineHeight: 1.5 }}>{info.description}</p>
            </div>

            {/* Acharyas */}
            <div style={{ padding: '0 12px 16px' }}>
              <p style={{ fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
                Verified Acharyas ({list.length})
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {list.map(p => (
                  <div key={p.id} style={{
                    padding: '12px 14px', borderRadius: 16,
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                    transition: 'border-color 0.2s'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#f8fafc', fontFamily: 'Outfit,sans-serif' }}>{p.name}</div>
                        <span className={`badge badge-${p.sampradaya}`} style={{ marginTop: 5, fontSize: 9 }}>{p.mutt}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: 'rgba(245,158,11,0.12)', padding: '3px 8px', borderRadius: 20, border: '1px solid rgba(245,158,11,0.25)' }}>
                        <Star size={10} style={{ fill: '#fbbf24', color: '#fbbf24' }} />
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#fbbf24' }}>{p.rating}</span>
                      </div>
                    </div>
                    <div style={{ marginTop: 8, fontSize: 10, color: '#64748b', lineHeight: 1.6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <BookOpen size={9} /> {p.vedaShakha} · {p.sutram}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                        <ShieldCheck size={9} style={{ color: '#34d399' }} />
                        <span style={{ color: '#34d399' }}>{p.experienceYears}y exp · Trust {p.trustScore}%</span>
                      </div>
                    </div>
                    <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 9, color: '#34d399', fontFamily: 'monospace', fontWeight: 700 }}>0% Commission</span>
                      <button
                        onClick={() => onOpenFeedback(p)}
                        style={{
                          padding: '4px 12px', borderRadius: 12, background: 'rgba(245,158,11,0.12)',
                          border: '1px solid rgba(245,158,11,0.3)', color: '#fbbf24',
                          fontSize: 10, fontWeight: 700, cursor: 'pointer'
                        }}
                      >
                        Rate Acharya
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Home Bar */}
          <div className="phone-home-bar" />
        </div>
      </div>
    </div>
  );
}
