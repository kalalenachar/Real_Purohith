import React, { useState } from 'react';
import {
  Home, BookOpen, Flame,
  Heart, ShieldCheck, User, LogIn, Crown, Menu, X, LogOut, UserCheck
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, queueCount, auth, onAdminClick, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const role = auth?.user?.role || auth?.role;
  const isLoggedIn = auth?.isLoggedIn;

  // Build dynamic navigation tabs based on auth status
  const mainTabs = [
    { id: 'pravachanam', label: 'Pravachanam',     icon: BookOpen },
    { id: 'apara',       label: '30-Min SOS',      icon: Flame,     danger: true },
    { id: 'freeSeva',    label: 'Noble Free Seva', icon: Heart,     accent: 'heart' },
  ];

  // Add user portal tab for logged in users
  if (isLoggedIn) {
    if (role !== 'admin') {
      mainTabs.unshift({ id: 'devotee', label: 'User Profile & Vault', icon: User, protected: true });
    }
  }

  const handleTabClick = (tabId, isProtected) => {
    if (isProtected && !isLoggedIn) {
      onAdminClick(); // Open Sign In / Register modal for guest visitors
      return;
    }
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="navbar-container">
        {/* Top Ambient Gold Shimmer Line */}
        <div className="navbar-shimmer-line" />

        <div className="navbar-inner">
          {/* Brand Section */}
          <div className="logo-mark" onClick={() => handleTabClick('home')} id="nav-brand">
            <div className="logo-icon-wrapper">
              <div className="logo-glow" />
              <div className="logo-icon animate-pulse-gold">🪔</div>
            </div>
            <div className="logo-text">
              <div className="logo-title-row">
                <span className="logo-title text-gold-gradient">REAL-PUROHIT</span>
                <span className="logo-live-dot" title="Platform Status: Active 24/7"></span>
              </div>
              <div className="logo-sub">Sacred Sampradaya Ecosystem</div>
            </div>
          </div>

          {/* Desktop Nav Tabs */}
          <nav className="nav-tabs desktop-tabs">
            {mainTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              let cls = 'nav-tab';
              if (isActive && tab.danger) cls += ' active-danger';
              else if (isActive) cls += ' active';
              else if (tab.danger) cls += ' tab-danger-subtle';
              else if (tab.accent === 'heart') cls += ' tab-heart-subtle';

              return (
                <button
                  key={tab.id}
                  id={`nav-${tab.id}`}
                  className={cls}
                  onClick={() => handleTabClick(tab.id, tab.protected)}
                >
                  <Icon size={14} className={tab.danger ? 'sos-icon-spin' : ''} />
                  <span>{tab.label}</span>
                  {tab.badge && queueCount > 0 && (
                    <span className="nav-badge animate-bounce-subtle">{queueCount}</span>
                  )}
                  {tab.danger && <span className="sos-pulse-ring" />}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="nav-right-actions">
            {!isLoggedIn && (
              <div className="fee-pill-wrapper" title="100% Direct Scholar Honorarium — Zero Commission Platform">
                <span className="fee-live-pulse" />
                <span className="fee-pill">0% PLATFORM FEE</span>
              </div>
            )}

            {isLoggedIn ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {/* User Avatar & Info Pill */}
                <div 
                  onClick={() => setActiveTab('devotee')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '4px 12px', borderRadius: 20, cursor: 'pointer',
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(245,158,11,0.25)',
                    fontSize: 12, color: '#f8fafc', transition: 'all 0.2s'
                  }}
                  title="Click to view & edit your User Profile"
                >
                  <span style={{ fontSize: 16 }}>{auth?.user?.avatar || '👤'}</span>
                  <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                    <span style={{ fontWeight: 700, fontSize: 12, color: '#f8fafc' }}>
                      {auth?.user?.name || auth?.user?.username || ''}
                    </span>
                    <span style={{ fontSize: 9, color: '#fbbf24', fontWeight: 800, textTransform: 'uppercase' }}>
                      {role === 'admin' ? '👑 Admin' : '👤 User'}
                    </span>
                  </div>
                </div>

                {/* Admin Panel Access Button */}
                {role === 'admin' && (
                  <button onClick={onAdminClick} className="admin-btn logged-in" id="nav-admin-btn">
                    <Crown size={14} className="crown-glow" />
                    <span>Admin Panel</span>
                  </button>
                )}

                {/* Logout Button */}
                <button
                  onClick={onLogout}
                  style={{
                    background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.3)',
                    color: '#f87171', padding: '8px 12px', borderRadius: 12, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700,
                    transition: 'all 0.2s'
                  }}
                  title="Sign Out"
                >
                  <LogOut size={14} />
                  <span className="desktop-only">Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onAdminClick}
                className="admin-btn logged-out"
                id="nav-admin-btn"
              >
                <LogIn size={14} />
                <span>Sign In / Register</span>
              </button>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              className="mobile-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer (sibling to header to prevent position:fixed trapped in backdrop-filter container) */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer-content" onClick={e => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <div className="logo-text">
                <span className="logo-title text-gold-gradient">REAL-PUROHIT</span>
                <div className="logo-sub">Navigation Portals</div>
              </div>
              <button className="mobile-close-btn" onClick={() => setMobileMenuOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="mobile-nav-list">
              {mainTabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                let cls = 'mobile-nav-item';
                if (isActive && tab.danger) cls += ' active-danger';
                else if (isActive) cls += ' active';

                return (
                  <button
                    key={tab.id}
                    className={cls}
                    onClick={() => handleTabClick(tab.id, tab.protected)}
                  >
                    <div className="mobile-nav-label-group">
                      <Icon size={16} />
                      <span>{tab.label}</span>
                    </div>
                    {tab.badge && queueCount > 0 && (
                      <span className="nav-badge">{queueCount}</span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mobile-drawer-footer" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {isLoggedIn ? (
                <button
                  onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                  style={{
                    width: '100%', padding: '10px', borderRadius: 12, background: 'rgba(220,38,38,0.15)',
                    border: '1px solid rgba(220,38,38,0.3)', color: '#f87171', fontWeight: 700, fontSize: 13,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer'
                  }}
                >
                  <LogOut size={16} /> Sign Out ({auth?.user?.name || auth?.user?.username || ''})
                </button>
              ) : (
                <button
                  onClick={() => { onAdminClick(); setMobileMenuOpen(false); }}
                  style={{
                    width: '100%', padding: '10px', borderRadius: 12, background: 'linear-gradient(135deg, #f59e0b, #ea580c)',
                    border: 'none', color: '#1a0a00', fontWeight: 800, fontSize: 13,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer'
                  }}
                >
                  <LogIn size={16} /> Sign In / Register
                </button>
              )}
              <div className="fee-pill-wrapper" style={{ display: 'flex' }}>
                <span className="fee-live-pulse" />
                <span className="fee-pill">0% DIRECT SCHOLAR FEE</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


