import React, { useState, useEffect, useCallback } from 'react';
import { Flame, Heart, Video, Phone, CheckCircle2, X, BookOpen, ShieldCheck, Globe, LogIn } from 'lucide-react';

import { Starfield } from './components/Starfield.jsx';
import Navbar from './components/Navbar.jsx';
import HomePage from './components/HomePage.jsx';
import DevoteeDashboard from './components/DevoteeDashboard.jsx';
import AdminAIHub from './components/AdminAIHub.jsx';
import BackgroundWorkerMonitor from './components/BackgroundWorkerMonitor.jsx';
import FeedbackModal from './components/FeedbackModal.jsx';
import LoginModal from './components/LoginModal.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import BookingModal from './components/BookingModal.jsx';
import FreeSevaModal from './components/FreeSevaModal.jsx';

import { INITIAL_FEEDBACKS } from './services/systemData.js';
import { backgroundQueue } from './services/backgroundQueue.js';
import { DataStore } from './services/store.js';

/* ──────────────────────────────────────────────────────────── */
/*  Inline Page Views (Pravachanam, Apara, Free Seva)          */
/* ──────────────────────────────────────────────────────────── */

function PravachanamView({ onTriggerSOS, onOpenBooking }) {
  const ITEMS = [
    { icon: '📖', title: 'Srimad Bhagavatha Sapthaham', duration: '7-Day Katha', desc: 'Sri Krishna Avathara & Rukmini Kalyana. Full immersive Pravachanam for home, apartment complex, or community hall.' },
    { icon: '🏹', title: 'Srimad Ramayana Pravachanam', duration: 'Single / 3-Day / 7-Day', desc: 'Sundarakanda, Seetha Rama Kalyana, and Sampoorna Ramayana by senior Pauranika scholars only.' },
    { icon: '⚔️', title: 'Mahabharatam & Bhagavad Gita', duration: 'Flexible Sessions', desc: 'Karma Yoga, Dharma Discourse, and Battlefield Wisdom — customized depth for the audience.' },
    { icon: '🌺', title: 'Purana & Stotra Pravachanams', duration: 'Customizable', desc: 'Shiva Puranam, Devi Mahatmyam, Vishnu Sahasranamam, Lalitha Sahasranamam, Venkateswara Vaibhavam.' },
    { icon: '📱', title: 'Online HD Virtual Pravachanam', duration: 'Live Video', desc: 'Tailored for NRI families and remote gatherings. Premium HD live stream with simultaneous translation.', badge: 'NRI-READY' },
    { icon: '🕊️', title: 'Garuda Purana Pravachanam', duration: '10–13 Day Apara Period', desc: "STRICTLY EXCLUSIVE to Apara Karyam. Provides solace, spiritual clarity on the soul's journey. NEVER offered during auspicious occasions.", badge: 'APARA ONLY', isApara: true },
  ];
  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 48 }}>
      <div className="hero-banner" style={{ marginBottom: 32 }}>
        <div className="orb orb-gold" style={{ width: 350, height: 350, top: -100, left: -80, opacity: 0.12 }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
            <span style={{ fontSize: 48 }} className="animate-float">🎙️</span>
            <div>
              <h2 style={{ fontSize: 26, fontFamily: 'Outfit,sans-serif', fontWeight: 900, color: '#f8fafc' }}>Upanyasam & Pravachanam Services</h2>
              <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>Dedicated Vertical · Spiritual Discourses & Sacred Storytelling</p>
            </div>
          </div>
          <p style={{ fontSize: 13, color: '#e2e8f0', maxWidth: 700, lineHeight: 1.7 }}>
            Real-Purohit connects families with renowned <span className="serif" style={{ color: '#fbbf24', fontStyle: 'italic' }}>Pauranikas</span> for home, hall, or online sessions.
          </p>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {ITEMS.map((item, i) => (
          <div key={i} className={`acharya-card ${item.isApara ? 'glass-red' : ''}`} style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>{item.icon}</div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
              <h3 style={{ fontSize: 15, fontFamily: 'Outfit,sans-serif', fontWeight: 700, color: '#f8fafc' }}>{item.title}</h3>
              {item.badge && (
                <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 20, fontWeight: 800, flexShrink: 0, background: item.isApara ? '#dc2626' : 'rgba(14,165,233,0.25)', color: item.isApara ? 'white' : '#38bdf8', border: item.isApara ? 'none' : '1px solid rgba(14,165,233,0.4)' }}>{item.badge}</span>
              )}
            </div>
            <p style={{ fontSize: 11, color: '#f59e0b', fontFamily: 'monospace', marginBottom: 8 }}>{item.duration}</p>
            <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6, flex: 1 }}>{item.desc}</p>
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, color: '#34d399', fontWeight: 700 }}>0% Platform Fee</span>
              <button className={`btn btn-sm ${item.isApara ? 'btn-danger' : 'btn-primary'}`} onClick={item.isApara ? onTriggerSOS : () => onOpenBooking && onOpenBooking(item.title)}>
                {item.isApara ? 'Request Apara' : 'Book Pravachanam'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AparaView({ onTriggerSOS, onOpenBooking }) {
  const TIRTHAS = ['Gaya (Vishnupad — Pinda Daan)', 'Rameswaram (Sethu Snanam & Til Tarpana)', 'Kashi / Varanasi (Ganga Ghats)', 'Gokarna / Trimbakeshwar (Narayan Nagbali)', 'Haridwar / Rishikesh (Ganga Pinda Daan)'];
  const LIFECYCLE = ['Antyeshti (Final Rites & Instant Pandit Dispatch)', 'Sanchayanam (Bone Collection Rites)', 'Dasha Dina Kriyas (Day 1–10 Pinda Daanam)', 'Ekodishta Shraaddha (11th & 12th Day)', 'Sapindakarana (13th Day Ritual)', 'Subha Sweekaram / Vaikunta Samaradhana'];
  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 48 }}>
      <div style={{ borderRadius: 24, padding: 36, marginBottom: 32, position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, rgba(220,38,38,0.15) 0%, rgba(159,18,57,0.1) 100%)', border: '1px solid rgba(220,38,38,0.4)', boxShadow: '0 0 60px rgba(220,38,38,0.15)' }}>
        <div className="orb orb-red" style={{ width: 300, height: 300, top: -80, right: -40, opacity: 0.2 }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <span style={{ fontSize: 48 }}>🕊️</span>
            <div>
              <h2 style={{ fontSize: 26, fontFamily: 'Outfit,sans-serif', fontWeight: 900, color: '#f8fafc' }}>Apara Karyam & Pitru Kriya Protocol</h2>
              <p style={{ fontSize: 13, color: '#fca5a5', marginTop: 4 }}>Guaranteed 30-Min Instant Response · 24/7 Support · Sutra/Veda Shakha Matching</p>
            </div>
          </div>
          <p style={{ fontSize: 13, color: '#e2e8f0', maxWidth: 700, lineHeight: 1.7, marginBottom: 24 }}>
            After-death rituals require extreme sensitivity, strict adherence to family tradition, and immediate response.
          </p>
          <button className="btn btn-danger btn-lg sos-btn" onClick={onTriggerSOS} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15 }}>
            <Flame size={20} /> Dispatch Emergency SOS — Guaranteed 30-Min SLA
          </button>
        </div>
      </div>
      <div className="grid-2">
        <div className="card" style={{ padding: 28 }}>
          <h3 style={{ fontSize: 16, fontFamily: 'Outfit,sans-serif', fontWeight: 700, color: '#f8fafc', marginBottom: 16 }}>🕯️ Complete Apara Karyam Lifecycle</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {LIFECYCLE.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#f59e0b', fontWeight: 700, minWidth: 24 }}>D{i <= 1 ? '1' : '1–13'}</span>
                <span style={{ fontSize: 12, color: '#e2e8f0' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontFamily: 'Outfit,sans-serif', fontWeight: 700, color: '#f8fafc', marginBottom: 14 }}>🏛️ Sacred Tirtha Kshetra Apara Kriya</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {TIRTHAS.map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: '#94a3b8' }}>
                  <CheckCircle2 size={13} style={{ color: '#34d399', flexShrink: 0 }} />{t}
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: 24, borderRadius: 16, background: 'rgba(14,165,233,0.07)', border: '1px solid rgba(14,165,233,0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Globe size={16} style={{ color: '#38bdf8' }} />
              <h4 style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc', fontFamily: 'Outfit,sans-serif' }}>Remote E-Pinda Daan</h4>
              <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 20, background: 'rgba(14,165,233,0.2)', color: '#38bdf8', border: '1px solid rgba(14,165,233,0.4)', fontWeight: 700 }}>NRI</span>
            </div>
            <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6, marginBottom: 14 }}>
              For NRIs unable to travel, authorized Acharyas perform the Pitru Kriya at holy river banks with live video stream and individualized Sankalpam.
            </p>
            <button className="btn btn-ghost btn-sm" onClick={() => onOpenBooking && onOpenBooking('Remote E-Pinda Daan')}>Request E-Pinda Daan</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FreeSeva({ onOpenFreeSeva }) {
  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 48 }}>
      <div className="hero-banner" style={{ marginBottom: 32, borderColor: 'rgba(16,185,129,0.35)', background: 'rgba(16,185,129,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 52 }} className="animate-float">🪷</span>
          <div>
            <h2 style={{ fontSize: 26, fontFamily: 'Outfit,sans-serif', fontWeight: 900, color: '#f8fafc' }}>Noble Seva Vertical</h2>
            <p style={{ fontSize: 13, color: '#6ee7b7', marginTop: 4 }}>100% Truly Free Digital Sevas for Underprivileged Families</p>
            <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 8, maxWidth: 600, lineHeight: 1.6 }}>
              Spiritual healing, divine protection, and astrological guidance accessible to everyone, regardless of financial background.
            </p>
          </div>
        </div>
      </div>
      <div className="grid-2">
        <div className="card" style={{ padding: 32, borderColor: 'rgba(16,185,129,0.25)', background: 'rgba(16,185,129,0.03)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🙏</div>
          <h3 style={{ fontSize: 20, fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#f8fafc', marginBottom: 8 }}>Free 1-on-1 Vishnu Sahasranama Parayanam</h3>
          <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.7, marginBottom: 20 }}>
            Personalized Sankalpa. Full 1008-name recitation by a Veda Pandit. Phalasruti & Vedic Ashirvadam via Google Meet.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
            {['Custom Sankalpa recitation', 'Full Sahasranama Parayanam', '5-min Phalasruti explanation', 'Vedic Ashirvadam blessing'].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#6ee7b7' }}><CheckCircle2 size={13} /> {s}</div>
            ))}
          </div>
          <button className="btn btn-lg" onClick={() => onOpenFreeSeva && onOpenFreeSeva('parayanam')} style={{ background: '#10b981', color: 'white', justifyContent: 'center', width: '100%', boxShadow: '0 4px 15px rgba(16,185,129,0.35)', cursor: 'pointer' }}>
            <Video size={16} /> Register for Free Seva
          </button>
        </div>
        <div className="card" style={{ padding: 32, borderColor: 'rgba(14,165,233,0.25)', background: 'rgba(14,165,233,0.03)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔭</div>
          <h3 style={{ fontSize: 20, fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#f8fafc', marginBottom: 8 }}>Free 1-on-1 Jyotisha Vedic Astrology</h3>
          <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.7, marginBottom: 20 }}>
            Kundali reading, planetary dasha analysis, and practical Vedic remedy guidance by verified Daivajnas. Absolutely free.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
            {['Kundali chart preparation', 'Dasha & Antardasha analysis', 'Graha drishti assessment', 'Practical Vedic remedies'].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#38bdf8' }}><CheckCircle2 size={13} /> {s}</div>
            ))}
          </div>
          <button className="btn btn-lg" onClick={() => onOpenFreeSeva && onOpenFreeSeva('astrology')} style={{ background: '#0ea5e9', color: 'white', justifyContent: 'center', width: '100%', boxShadow: '0 4px 15px rgba(14,165,233,0.35)', cursor: 'pointer' }}>
            <Phone size={16} /> Book Free Consultation
          </button>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────── */
/*  Main App                                                    */
/* ──────────────────────────────────────────────────────────── */

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [feedbacks, setFeedbacks]   = useState(INITIAL_FEEDBACKS);
  const [tasks, setTasks]           = useState([]);
  const [queueOpen, setQueueOpen]   = useState(false);
  const [feedbackPurohit, setFeedbackPurohit] = useState(null);
  const [toast, setToast]           = useState(null);

  // Auth state from store
  const [auth, setAuth] = useState({ isLoggedIn: false, user: null, role: 'guest' });
  const [showLogin, setShowLogin]   = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingRitual, setBookingRitual]       = useState(null);
  const [freeSevaType, setFreeSevaType]         = useState(null); // 'parayanam' | 'astrology' | null
  const [appMode, setAppMode]       = useState('public'); // 'public' | 'admin'

  const showToast = useCallback((msg, type = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 5000);
  }, []);

  const handleOpenBookingModal = useCallback((ritual = null) => {
    if (!auth?.isLoggedIn) {
      showToast('🔒 Please Sign In or Register to schedule a sacred ritual booking.', 'info');
      setShowLogin(true);
      return;
    }
    setBookingRitual(typeof ritual === 'string' ? ritual : null);
    setShowBookingModal(true);
  }, [auth, showToast]);

  const handleOpenFreeSevaModal = useCallback((type) => {
    if (!auth?.isLoggedIn) {
      showToast('🔒 Please Sign In or Register to register for Free Digital Sevas.', 'info');
      setShowLogin(true);
      return;
    }
    setFreeSevaType(type);
  }, [auth, showToast]);

  // Check auth and load feedbacks on mount from database
  useEffect(() => {
    DataStore.checkAuth().then(res => {
      if (res && res.isLoggedIn) setAuth(res);
    });
    DataStore.getFeedbacks().then(data => {
      if (Array.isArray(data)) setFeedbacks(data);
    });
  }, []);

  // Background queue subscription
  useEffect(() => {
    setTasks(backgroundQueue.getTasks());
    return backgroundQueue.subscribe(t => setTasks(t));
  }, []);

  const handleTriggerSOS = useCallback(() => {
    backgroundQueue.enqueueTask('SOS_APARA_DISPATCH', { location: 'Bengaluru' });
    setToast({ msg: '⚡ Emergency SOS dispatched! Guaranteed 30-minute response protocol activated.', type: 'danger' });
    setQueueOpen(true);
    setTimeout(() => setToast(null), 8000);
  }, []);

  const handleRunBackgroundTithi = useCallback((devotee) => {
    backgroundQueue.enqueueTask('TIME_ALLOTMENT_CALCULATION', devotee);
    showToast('🪔 Tithi calculation queued. AI is pre-allotting Mutt-matched Acharyas…', 'info');
    setQueueOpen(true);
  }, [showToast]);

  const handleSubmitFeedback = useCallback((payload) => {
    backgroundQueue.enqueueTask('FEEDBACK_PROCESSING', payload, result => {
      if (result) {
        const newFb = {
          id: `FB-${Date.now()}`,
          bookingId: `BK-${Math.floor(9000 + Math.random() * 900)}`,
          devoteeName: 'Devotee',
          purohitId: payload.purohitId,
          purohitName: payload.purohitName,
          sampradaya: payload.sampradaya,
          ratings: payload.ratings,
          sampradayaPaddhatiAccuracy: payload.sampradayaPaddhatiAccuracy,
          reviewText: payload.reviewText,
          aiSentiment: result.sentiment,
          aiConfidence: result.aiConfidence,
          status: 'Processed by AI Queue',
          dateSubmitted: 'Just now'
        };
        setFeedbacks(prev => [newFb, ...prev]);
      }
    });
    showToast('✅ Review submitted! AI processing sentiment and updating Trust Score.', 'success');
    setQueueOpen(true);
  }, [showToast]);

  const handleSetTab = useCallback(tab => {
    if (tab === 'background') { setQueueOpen(true); return; }
    setActiveTab(tab);
  }, []);

  const handleLoginSuccess = useCallback((newAuth) => {
    setAuth(newAuth);
    setShowLogin(false);
    const userRole = newAuth.user?.role || newAuth.role;
    if (userRole === 'admin') {
      setAppMode('admin');
    } else {
      setActiveTab('devotee');
    }
    showToast(` Namaste ${newAuth.user?.name || newAuth.user?.username || ''}! Logged in successfully.`, 'success');
  }, [showToast]);

  const handleLogout = useCallback(() => {
    const cleared = DataStore.logout();
    setAuth(cleared || { isLoggedIn: false, user: null, role: 'guest' });
    setAppMode('public');
    showToast('Signed out of Real-Purohit platform.', 'info');
  }, [showToast]);

  const handleAdminLoginClick = useCallback(() => {
    if (auth?.isLoggedIn) {
      if (auth.user?.role === 'admin' || auth.role === 'admin') {
        setAppMode('admin');
      } else {
        setActiveTab('devotee');
      }
    } else {
      setShowLogin(true);
    }
  }, [auth]);

  const queueCount = tasks.filter(t => t.status === 'RUNNING').length;

  /* ── Admin Mode ── */
  if (appMode === 'admin' && auth?.isLoggedIn && (auth?.user?.role === 'admin' || auth?.role === 'admin')) {
    return (
      <>
        <AdminPanel
          auth={auth}
          onLogout={handleLogout}
          onSwitchToPublic={() => setAppMode('public')}
        />
      </>
    );
  }

  /* ── Public / Multi-User Mode ── */
  return (
    <div className="page-wrapper">
      <Starfield />

      {/* Login Gate */}
      {showLogin && (
        <LoginModal
          onLoginSuccess={handleLoginSuccess}
          onClose={() => setShowLogin(false)}
        />
      )}

      {/* Booking Gate */}
      {showBookingModal && (
        <BookingModal
          initialRitual={bookingRitual}
          auth={auth}
          onClose={() => setShowBookingModal(false)}
          onBookingSuccess={(msg) => showToast(msg, 'success')}
        />
      )}

      {/* Standalone Free Seva Gate */}
      {freeSevaType && (
        <FreeSevaModal
          sevaType={freeSevaType}
          auth={auth}
          onClose={() => setFreeSevaType(null)}
          onSuccess={(msg) => showToast(msg, 'success')}
        />
      )}

      {/* Navbar — pass auth & action handlers */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleSetTab}
        queueCount={queueCount}
        auth={auth}
        onAdminClick={handleAdminLoginClick}
        onLogout={handleLogout}
      />


      {/* SOS Emergency Top Banner */}
      {toast?.type === 'danger' && (
        <div style={{ background: '#dc2626', color: 'white', padding: '12px 20px', zIndex: 90, position: 'relative', display: 'flex', alignItems: 'center', gap: 10, animation: 'fadeIn 0.3s ease' }}>
          <Flame size={16} />
          <strong style={{ fontSize: 13, flex: 1 }}>{toast.msg}</strong>
          <button onClick={() => setToast(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={16} /></button>
        </div>
      )}

      {/* Main Views */}
      <main style={{ flex: 1 }}>
        {activeTab === 'home'        && <HomePage onNavigate={handleSetTab} onTriggerSOS={handleTriggerSOS} onOpenBooking={handleOpenBookingModal} />}
        {activeTab === 'devotee'     && <DevoteeDashboard auth={auth} onOpenLogin={handleAdminLoginClick} onTriggerSOS={handleTriggerSOS} onRunBackgroundTithi={handleRunBackgroundTithi} onOpenFeedback={setFeedbackPurohit} onOpenBooking={handleOpenBookingModal} />}
        {activeTab === 'pravachanam' && <PravachanamView onTriggerSOS={handleTriggerSOS} onOpenBooking={handleOpenBookingModal} />}
        {activeTab === 'apara'       && <AparaView onTriggerSOS={handleTriggerSOS} onOpenBooking={handleOpenBookingModal} />}
        {activeTab === 'freeSeva'    && <FreeSeva onOpenFreeSeva={handleOpenFreeSevaModal} />}
        {activeTab === 'admin'       && <AdminAIHub feedbacks={feedbacks} />}
      </main>


      {/* Footer */}
      <footer style={{ background: 'rgba(5,8,16,0.95)', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '24px 20px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <p style={{ fontSize: 14, color: '#94a3b8', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic' }}>Real-Purohit — Sacred Multi-Sampradaya & Acharya Ecosystem</p>
        <p style={{ fontSize: 11, color: '#f59e0b', marginTop: 6, fontFamily: 'monospace', fontWeight: 700, letterSpacing: 1 }}>
          0% PLATFORM FEE · DIRECT ON-SPOT DAKSHINA · NO GPS TRACKING · 30-MIN EMERGENCY SOS
        </p>
      </footer>

      {/* Background Worker Monitor */}
      {queueOpen && <BackgroundWorkerMonitor tasks={tasks} onClose={() => setQueueOpen(false)} />}

      {/* Feedback Modal */}
      {feedbackPurohit && (
        <FeedbackModal purohit={feedbackPurohit} onClose={() => setFeedbackPurohit(null)} onSubmit={handleSubmitFeedback} />
      )}

      {/* Toast (non-danger) */}
      {toast && toast.type !== 'danger' && (
        <div className="toast">
          <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: toast.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(124,58,237,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
            {toast.type === 'success' ? '✅' : '🪔'}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, color: '#e2e8f0', lineHeight: 1.5 }}>{toast.msg}</p>
          </div>
          <button onClick={() => setToast(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 4 }}><X size={15} /></button>
        </div>
      )}
    </div>
  );
}
