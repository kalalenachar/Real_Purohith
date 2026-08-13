import React, { useState } from 'react';
import {
  Eye, EyeOff, Lock, User, Mail, ShieldCheck,
  AlertCircle, CheckCircle2, X, Sparkles, KeyRound, UserPlus, LogIn, ArrowLeft
} from 'lucide-react';
import { DataStore } from '../services/store.js';
import { SAMPRADAYA_MATRIX } from '../services/systemData.js';

export default function LoginModal({ onLoginSuccess, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register' | 'forgot'

  // Shared / Login state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  // Register state
  const [fullName, setFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPwd, setRegConfirmPwd] = useState('');
  const [role, setRole] = useState('devotee'); // 'devotee' | 'purohit' | 'admin'
  const [gotram, setGotram] = useState('');
  const [sampradaya, setSampradaya] = useState('uttaradhi');

  // Forgot password state
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [forgotSuccessMsg, setForgotSuccessMsg] = useState('');

  // General UI state
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle Login submission
  const handleLoginSubmit = async (e) => {
    e?.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setError('Please enter your Username/Email ID and Password.');
      return;
    }
    setLoading(true);
    setError('');

    const result = await DataStore.login(identifier, password);
    setLoading(false);
    if (result.success) {
      onLoginSuccess(result.auth);
    } else {
      setError(result.error);
    }
  };

  // Quick system credential fill
  const handleQuickLogin = async (accountIdentifier, accountPassword) => {
    setIdentifier(accountIdentifier);
    setPassword(accountPassword);
    setError('');
    setLoading(true);

    const result = await DataStore.login(accountIdentifier, accountPassword);
    setLoading(false);
    if (result.success) {
      onLoginSuccess(result.auth);
    } else {
      setError(result.error);
    }
  };

  // Handle Register submission
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) return setError('Please enter your full name.');
    if (!regUsername.trim()) return setError('Please choose a username.');
    if (!regEmail.trim()) return setError('Please enter your email address.');
    if (!regPassword) return setError('Please enter a password.');
    if (regPassword !== regConfirmPwd) return setError('Passwords do not match.');

    setLoading(true);

    const result = await DataStore.registerUser({
      name: fullName.trim(),
      username: regUsername.trim(),
      email: regEmail.trim(),
      password: regPassword,
      role,
      gotram: gotram.trim(),
      sampradaya
    });

    setLoading(false);
    if (result.success) {
      onLoginSuccess(result.auth);
    } else {
      setError(result.error);
    }
  };

  // Handle Forgot Password submission
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setForgotSuccessMsg('');

    if (!forgotIdentifier.trim()) return setError('Please enter your registered Username or Email ID.');
    if (!newPassword) return setError('Please enter a new password.');
    if (newPassword !== confirmNewPassword) return setError('New passwords do not match.');

    setLoading(true);
    await new Promise(r => setTimeout(r, 600));

    const result = DataStore.resetPassword(forgotIdentifier, newPassword);
    setLoading(false);

    if (result.success) {
      setForgotSuccessMsg(result.message);
    } else {
      setError(result.error);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'radial-gradient(ellipse at 30% 20%, rgba(245,158,11,0.15) 0%, rgba(5,8,16,0.98) 65%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px 16px', backdropFilter: 'blur(6px)', overflowY: 'auto'
    }}>
      {/* Background Orbs */}
      <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.08), transparent 70%)', top: '-10%', left: '-10%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.06), transparent 70%)', bottom: '5%', right: '-5%', pointerEvents: 'none' }} />

      <div style={{
        width: '100%', maxWidth: 480,
        background: 'rgba(12, 18, 32, 0.96)',
        border: '1px solid rgba(245,158,11,0.3)',
        borderRadius: 28,
        overflow: 'hidden',
        boxShadow: '0 0 70px rgba(245,158,11,0.15), 0 40px 80px rgba(0,0,0,0.8)',
        animation: 'fadeInUp 0.35s ease',
        position: 'relative',
        margin: 'auto 0'
      }}>
        {/* Top Gold Shimmer */}
        <div style={{ height: 3, background: 'linear-gradient(90deg, transparent, #f59e0b, #ea580c, transparent)' }} />

        {/* Modal Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            style={{
              position: 'absolute', right: 18, top: 18, zIndex: 10,
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '50%', width: 32, height: 32,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#94a3b8', cursor: 'pointer', transition: 'all 0.2s'
            }}
            title="Close"
          >
            <X size={16} />
          </button>
        )}

        {/* Header / Brand */}
        <div style={{ padding: '30px 32px 20px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{
            width: 64, height: 64, borderRadius: 20, margin: '0 auto 14px',
            background: 'linear-gradient(135deg, rgba(245,158,11,0.25), rgba(234,88,12,0.18))',
            border: '1px solid rgba(245,158,11,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, boxShadow: '0 8px 32px rgba(245,158,11,0.25)'
          }}>🪔</div>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 24, fontWeight: 900, color: '#f8fafc', letterSpacing: 0.5 }}>REAL-PUROHIT</h1>
          <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Sacred Multi-Sampradaya Ecosystem</p>

          {/* Mode Switcher Tabs */}
          <div style={{
            display: 'flex', background: 'rgba(255,255,255,0.03)',
            padding: 4, borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)',
            marginTop: 18
          }}>
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); }}
              style={{
                flex: 1, padding: '8px 12px', borderRadius: 12, border: 'none',
                background: mode === 'login' ? 'linear-gradient(135deg, #f59e0b, #ea580c)' : 'transparent',
                color: mode === 'login' ? '#1a0a00' : '#94a3b8',
                fontWeight: 700, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                transition: 'all 0.2s'
              }}
            >
              <LogIn size={14} /> Sign In
            </button>

            <button
              type="button"
              onClick={() => { setMode('register'); setError(''); }}
              style={{
                flex: 1, padding: '8px 12px', borderRadius: 12, border: 'none',
                background: mode === 'register' ? 'linear-gradient(135deg, #f59e0b, #ea580c)' : 'transparent',
                color: mode === 'register' ? '#1a0a00' : '#94a3b8',
                fontWeight: 700, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                transition: 'all 0.2s'
              }}
            >
              <UserPlus size={14} /> Sign Up
            </button>
          </div>
        </div>

        {/* Form Container */}
        <div style={{ padding: '24px 32px 32px' }}>
          {/* Error Banner */}
          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 16px', borderRadius: 12, marginBottom: 18,
              background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.3)',
              animation: 'fadeIn 0.3s ease'
            }}>
              <AlertCircle size={16} style={{ color: '#f87171', flexShrink: 0 }} />
              <p style={{ fontSize: 12, color: '#fca5a5' }}>{error}</p>
            </div>
          )}

          {/* ────────────────────────────────────────────────────────── */}
          {/* 1. SIGN IN MODE                                            */}
          {/* ────────────────────────────────────────────────────────── */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Username or Email */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: 0.5, textTransform: 'uppercase' }}>
                  Username or Email ID
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    placeholder="Enter your username or email"
                    className="input"
                    style={{ paddingLeft: 42 }}
                    autoFocus
                  />
                </div>
              </div>

              {/* Password */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: 0.5, textTransform: 'uppercase' }}>
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setError(''); setForgotIdentifier(identifier); }}
                    style={{ background: 'none', border: 'none', color: '#fbbf24', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter password"
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

              {/* Submit Button */}
              <button type="submit" disabled={loading} className="btn btn-primary btn-lg"
                style={{ width: '100%', justifyContent: 'center', marginTop: 4, opacity: loading ? 0.7 : 1 }}>
                {loading ? (
                  <>
                    <span style={{
                      width: 16, height: 16, border: '2px solid rgba(26,10,0,0.3)',
                      borderTop: '2px solid #1a0a00', borderRadius: '50%',
                      animation: 'spin-slow 0.8s linear infinite', display: 'inline-block'
                    }} />
                    Signing In…
                  </>
                ) : (
                  <>
                    <LogIn size={16} /> Sign In to Platform
                  </>
                )}
              </button>

              {/* Quick System Accounts Header */}
              <div style={{ marginTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 14 }}>
                <p style={{ fontSize: 11, color: '#64748b', textAlign: 'center', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700 }}>
                  🔑 Database Test Accounts
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('admin', 'admin123')}
                    style={{
                      padding: '8px 6px', borderRadius: 10,
                      background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
                      fontSize: 11, color: '#fbbf24', cursor: 'pointer', textAlign: 'center',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2
                    }}
                  >
                    <span>👑 Admin</span>
                    <span style={{ fontSize: 9, color: '#94a3b8' }}>admin</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('venkatesh', 'user123')}
                    style={{
                      padding: '8px 6px', borderRadius: 10,
                      background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.2)',
                      fontSize: 11, color: '#38bdf8', cursor: 'pointer', textAlign: 'center',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2
                    }}
                  >
                    <span>👤 User Account</span>
                    <span style={{ fontSize: 9, color: '#94a3b8' }}>venkatesh</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ────────────────────────────────────────────────────────── */}
          {/* 2. SIGN UP (REGISTER) MODE                                */}
          {/* ────────────────────────────────────────────────────────── */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ padding: '10px 14px', borderRadius: 12, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#fbbf24' }}>
                <span>👤</span>
                <span>Registering User / Householder Account</span>
              </div>


              {/* Full Name */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8' }}>Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Sri Sundara Raman"
                  className="input"
                />
              </div>

              {/* Username & Email row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8' }}>Username</label>
                  <input
                    type="text"
                    value={regUsername}
                    onChange={e => setRegUsername(e.target.value)}
                    placeholder="e.g. sundar_88"
                    className="input"
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8' }}>Email Address</label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    placeholder="name@email.com"
                    className="input"
                  />
                </div>
              </div>

              {/* Password & Confirm Password */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8' }}>Password</label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    placeholder="Create password"
                    className="input"
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8' }}>Confirm Password</label>
                  <input
                    type="password"
                    value={regConfirmPwd}
                    onChange={e => setRegConfirmPwd(e.target.value)}
                    placeholder="Re-enter password"
                    className="input"
                  />
                </div>
              </div>

              {/* Gotram & Sampradaya (for Devotee/Purohit) */}
              {role !== 'admin' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8' }}>Gotram (Optional)</label>
                    <input
                      type="text"
                      value={gotram}
                      onChange={e => setGotram(e.target.value)}
                      placeholder="e.g. Kashyapa"
                      className="input"
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8' }}>Sampradaya</label>
                    <select
                      value={sampradaya}
                      onChange={e => setSampradaya(e.target.value)}
                      className="select"
                      style={{ fontSize: 12 }}
                    >
                      {Object.values(SAMPRADAYA_MATRIX).map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Submit Register Button */}
              <button type="submit" disabled={loading} className="btn btn-primary btn-lg"
                style={{ width: '100%', justifyContent: 'center', marginTop: 8, opacity: loading ? 0.7 : 1 }}>
                {loading ? (
                  <>
                    <span style={{
                      width: 16, height: 16, border: '2px solid rgba(26,10,0,0.3)',
                      borderTop: '2px solid #1a0a00', borderRadius: '50%',
                      animation: 'spin-slow 0.8s linear infinite', display: 'inline-block'
                    }} />
                    Creating Account…
                  </>
                ) : (
                  <>
                    <UserPlus size={16} /> Complete Registration
                  </>
                )}
              </button>
            </form>
          )}

          {/* ────────────────────────────────────────────────────────── */}
          {/* 3. FORGOT PASSWORD MODE                                   */}
          {/* ────────────────────────────────────────────────────────── */}
          {mode === 'forgot' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); setForgotSuccessMsg(''); }}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600 }}
              >
                <ArrowLeft size={14} /> Back to Sign In
              </button>

              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', fontFamily: 'Outfit, sans-serif' }}>
                🔑 Password Recovery
              </h3>

              {forgotSuccessMsg ? (
                <div style={{
                  padding: 20, borderRadius: 16, background: 'rgba(16,185,129,0.1)',
                  border: '1px solid rgba(16,185,129,0.3)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12
                }}>
                  <CheckCircle2 size={36} style={{ color: '#34d399' }} />
                  <p style={{ fontSize: 13, color: '#6ee7b7', lineHeight: 1.6 }}>{forgotSuccessMsg}</p>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => { setMode('login'); setError(''); setForgotSuccessMsg(''); }}
                    style={{ marginTop: 6 }}
                  >
                    Proceed to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                      Registered Username or Email ID
                    </label>
                    <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>
                        <User size={16} />
                      </div>
                      <input
                        type="text"
                        value={forgotIdentifier}
                        onChange={e => setForgotIdentifier(e.target.value)}
                        placeholder="Enter your registered username or email"
                        className="input"
                        style={{ paddingLeft: 42 }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                      New Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>
                        <KeyRound size={16} />
                      </div>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="input"
                        style={{ paddingLeft: 42 }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                      Confirm New Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>
                        <KeyRound size={16} />
                      </div>
                      <input
                        type="password"
                        value={confirmNewPassword}
                        onChange={e => setConfirmNewPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="input"
                        style={{ paddingLeft: 42 }}
                      />
                    </div>
                  </div>

                  <button type="submit" disabled={loading} className="btn btn-primary btn-lg"
                    style={{ width: '100%', justifyContent: 'center', marginTop: 6, opacity: loading ? 0.7 : 1 }}>
                    {loading ? (
                      <>
                        <span style={{
                          width: 16, height: 16, border: '2px solid rgba(26,10,0,0.3)',
                          borderTop: '2px solid #1a0a00', borderRadius: '50%',
                          animation: 'spin-slow 0.8s linear infinite', display: 'inline-block'
                        }} />
                        Resetting Password…
                      </>
                    ) : (
                      <>
                        <KeyRound size={16} /> Reset Password Now
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
