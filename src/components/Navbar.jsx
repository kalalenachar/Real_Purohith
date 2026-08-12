import React from 'react';
import {
  Home, BookOpen, Flame,
  Heart, ShieldCheck, User, Activity, LogIn, Crown, LogOut
} from 'lucide-react';

const TABS = [
  { id: 'devotee',     label: 'Devotee Portal',    icon: Home },
  { id: 'pravachanam', label: 'Pravachanam',        icon: BookOpen },
  { id: 'apara',       label: '30-Min SOS',         icon: Flame,       danger: true },
  { id: 'freeSeva',    label: 'Noble Free Seva',    icon: Heart },
  { id: 'admin',       label: 'AI Quality Hub',     icon: ShieldCheck },
  { id: 'purohit',     label: 'Purohit Portal',     icon: User },
  { id: 'background',  label: 'BG Queue',           icon: Activity,    badge: true },
];

export default function Navbar({ activeTab, setActiveTab, queueCount, auth, onAdminClick }) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <div className="logo-mark" onClick={() => setActiveTab('devotee')} id="nav-brand">
          <div className="logo-icon animate-pulse-gold">🪔</div>
          <div className="logo-text">
            <div className="logo-title">REAL-PUROHIT</div>
            <div className="logo-sub">Sacred Sampradaya Ecosystem</div>
          </div>
        </div>

        {/* Nav Tabs */}
        <nav className="nav-tabs">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            let cls = 'nav-tab';
            if (isActive && tab.danger) cls += ' active-danger';
            else if (isActive) cls += ' active';
            return (
              <button key={tab.id} id={`nav-${tab.id}`} className={cls} onClick={() => setActiveTab(tab.id)}>
                <Icon size={14} />
                <span>{tab.label}</span>
                {tab.badge && queueCount > 0 && (
                  <span className="nav-badge">{queueCount}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Admin Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div className="fee-pill">0% FEE</div>
          {auth?.isLoggedIn ? (
            <button
              onClick={onAdminClick}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '7px 14px', borderRadius: 10, border: '1px solid rgba(245,158,11,0.4)',
                background: 'rgba(245,158,11,0.1)', color: '#fbbf24',
                fontSize: 12, fontFamily: 'Outfit,sans-serif', fontWeight: 700, cursor: 'pointer',
                transition: 'all 0.2s', whiteSpace: 'nowrap'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,158,11,0.18)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(245,158,11,0.1)'}
            >
              <Crown size={14} /> Admin Panel
            </button>
          ) : (
            <button
              onClick={onAdminClick}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '7px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.04)', color: '#94a3b8',
                fontSize: 12, fontFamily: 'Outfit,sans-serif', fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.2s', whiteSpace: 'nowrap'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,158,11,0.08)'; e.currentTarget.style.color = '#fbbf24'; e.currentTarget.style.borderColor = 'rgba(245,158,11,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
            >
              <LogIn size={14} /> Admin Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
