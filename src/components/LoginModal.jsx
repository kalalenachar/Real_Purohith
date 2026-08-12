import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User, ShieldCheck, Flame, AlertCircle } from 'lucide-react';
import { DataStore } from '../services/store.js';

export default function LoginModal({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }
    setLoading(true);
    setError('');
    // Simulate async auth
    await new Promise(r => setTimeout(r, 800));
    const result = DataStore.login(username, password);
    setLoading(false);
    if (result.success) {
      onLoginSuccess(result.auth);
    } else {
      setError(result.error);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'radial-gradient(ellipse at 30% 20%, rgba(245,158,11,0.12) 0%, rgba(5,8,16,0.98) 60%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, backdropFilter: 'blur(4px)'
    }}>
      {/* Decorative Orbs */}
      <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.07), transparent 70%)', top: '-10%', left: '-10%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(220,38,38,0.06), transparent 70%)', bottom: '5%', right: '-5%', pointerEvents: 'none' }} />

      <div style={{
        width: '100%', maxWidth: 440,
        background: 'rgba(12, 18, 32, 0.95)',
        border: '1px solid rgba(245,158,11,0.25)',
        borderRadius: 28,
        overflow: 'hidden',
        boxShadow: '0 0 60px rgba(245,158,11,0.12), 0 40px 80px rgba(0,0,0,0.7)',
        animation: 'fadeInUp 0.4s ease',
        position: 'relative'
      }}>
        {/* Top Gold Line */}
        <div style={{ height: 3, background: 'linear-gradient(90deg, transparent, #f59e0b, #ea580c, transparent)' }} />

        {/* Logo + Header */}
        <div style={{ padding: '36px 40px 28px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20, margin: '0 auto 20px',
            background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(234,88,12,0.15))',
            border: '1px solid rgba(245,158,11,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, boxShadow: '0 8px 32px rgba(245,158,11,0.25)'
          }}>🪔</div>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 26, fontWeight: 900, color: '#f8fafc', letterSpacing: 0.5 }}>REAL-PUROHIT</h1>
          <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 6 }}>Sacred Admin Control Panel</p>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            marginTop: 14, padding: '5px 14px', borderRadius: 20,
            background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)',
            fontSize: 11, color: '#fbbf24', fontWeight: 700
          }}>
            <ShieldCheck size={12} /> ADMIN ACCESS REQUIRED
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '28px 40px 36px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 16px', borderRadius: 12,
              background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)',
              animation: 'fadeIn 0.3s ease'
            }}>
              <AlertCircle size={16} style={{ color: '#f87171', flexShrink: 0 }} />
              <p style={{ fontSize: 13, color: '#fca5a5' }}>{error}</p>
            </div>
          )}

          {/* Username */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', letterSpacing: 0.5 }}>Username</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>
                <User size={16} />
              </div>
              <input
                type="text"
                autoComplete="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter admin username"
                className="input"
                style={{ paddingLeft: 42 }}
                autoFocus
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', letterSpacing: 0.5 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>
                <Lock size={16} />
              </div>
              <input
                type={showPwd ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="input"
                style={{ paddingLeft: 42, paddingRight: 42 }}
              />
              <button type="button" onClick={() => setShowPwd(v => !v)} style={{
                position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex'
              }}>
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading} className="btn btn-primary btn-lg"
            style={{ width: '100%', justifyContent: 'center', marginTop: 6, opacity: loading ? 0.7 : 1 }}>
            {loading ? (
              <>
                <span style={{
                  width: 16, height: 16, border: '2px solid rgba(26,10,0,0.3)',
                  borderTop: '2px solid #1a0a00', borderRadius: '50%',
                  animation: 'spin-slow 0.8s linear infinite', display: 'inline-block'
                }} />
                Authenticating…
              </>
            ) : (
              <>
                <ShieldCheck size={16} /> Sign In to Admin Panel
              </>
            )}
          </button>

          {/* Hint */}
          <div style={{
            padding: '10px 14px', borderRadius: 10,
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
            fontSize: 12, color: '#475569', textAlign: 'center'
          }}>
            Demo credentials: <strong style={{ color: '#fbbf24' }}>admin</strong> / <strong style={{ color: '#fbbf24' }}>admin</strong>
          </div>
        </form>
      </div>
    </div>
  );
}
