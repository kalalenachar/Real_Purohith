import React, { useState } from 'react';
import {
  Users, Calendar, ShoppingBag, BookOpen, Sparkles,
  ChevronRight, Flame, CheckCircle2, ShieldCheck, Plus,
  MapPin, Clock, Check, Star, User, Save, Edit3
} from 'lucide-react';
import { INITIAL_DEVOTEES, SAMPRADAYA_MATRIX, INITIAL_PUROHITS } from '../services/systemData.js';
import { RASHI_LIST, NAKSHATRA_LIST, getNakshatrasForRashi, getRashisForNakshatra, handleRashiSelection, handleNakshatraSelection } from '../services/vedicAstrologyService.js';
import { calculateNextTithiAllotments } from '../services/aiTimeAllotmentEngine.js';
import { DataStore } from '../services/store.js';

const SUB_TABS = [
  { id: 'profile', label: 'My Profile',           icon: User },
  { id: 'vault',   label: 'Ancestral Vault',      icon: Users },
  { id: 'tithi',   label: 'Tithi Reminders',      icon: Calendar },
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

export default function DevoteeDashboard({ onTriggerSOS, onRunBackgroundTithi, onOpenFeedback, auth, onOpenLogin, onOpenBooking, onUpdateUser }) {
  const [selectedDevotee, setSelectedDevotee] = useState(null);
  const [subTab, setSubTab] = useState('profile');
  const [samagri, setSamagri] = useState(SAMAGRI_DEFAULT);
  const [delivery, setDelivery] = useState('handCarried');
  const [booked, setBooked] = useState(false);
  const [myBookings, setMyBookings] = useState([]);

  // Profile form state
  const [profileName, setProfileName] = useState('');
  const [profileGotram, setProfileGotram] = useState('');
  const [profileRashi, setProfileRashi] = useState('');
  const [profileNakshatra, setProfileNakshatra] = useState('');
  const [profileSampradaya, setProfileSampradaya] = useState('vadagalai');
  const [profileVedaShakha, setProfileVedaShakha] = useState('Rigveda');
  const [profileSutram, setProfileSutram] = useState('Ashvalayana Sutram');
  const [profileKulaDaivam, setProfileKulaDaivam] = useState('');
  const [profileLocation, setProfileLocation] = useState('');
  const [profileAvatar, setProfileAvatar] = useState('👤');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaveMsg, setProfileSaveMsg] = useState('');

  const onSelectProfileRashi = (newRashi) => {
    const updated = handleRashiSelection(newRashi, profileNakshatra);
    setProfileRashi(updated.rashi);
    setProfileNakshatra(updated.nakshatra);
  };

  const onSelectProfileNakshatra = (newNakshatra) => {
    const updated = handleNakshatraSelection(newNakshatra, profileRashi);
    setProfileRashi(updated.rashi);
    setProfileNakshatra(updated.nakshatra);
  };

  // Load user-specific bookings & profile details
  React.useEffect(() => {
    if (!auth?.isLoggedIn || !auth?.user) return;

    // 1. Fetch user bookings and filter for this user ONLY
    DataStore.getBookings().then(res => {
      if (Array.isArray(res)) {
        const userBookings = res.filter(b => 
          (auth.user.id && (b.devoteeId === auth.user.id || b.userId === auth.user.id)) ||
          (auth.user.name && b.devoteeName?.toLowerCase() === auth.user.name.toLowerCase()) ||
          (auth.user.username && b.devoteeName?.toLowerCase() === auth.user.username.toLowerCase())
        );
        setMyBookings(userBookings);
      }
    });

    // 2. Fetch devotee profile for this logged-in user
    DataStore.getDevotees().then(devotees => {
      if (Array.isArray(devotees) && devotees.length > 0) {
        const match = devotees.find(
          d => d.userId === auth.user.id || d.id === auth.user.id || (d.name && auth.user.name && d.name.toLowerCase() === auth.user.name.toLowerCase())
        );
        if (match) {
          setSelectedDevotee({
            ...match,
            name: auth.user.name || match.name,
            gotram: (auth.user.gotram && auth.user.gotram !== 'Kashyapa') ? auth.user.gotram : (match.gotram && match.gotram !== 'Kashyapa' && match.gotram !== 'Not Specified' ? match.gotram : ''),
            sampradaya: auth.user.sampradaya || match.sampradaya || 'secular'
          });
          return;
        }
      }

      // Default profile object built directly from auth.user (no Sri Venkatesh Rao fallbacks)
      setSelectedDevotee({
        id: auth.user.id || `dev-${Date.now()}`,
        name: auth.user.name || auth.user.username || 'Devotee',
        gotram: (auth.user.gotram && auth.user.gotram !== 'Kashyapa') ? auth.user.gotram : '',
        vedaShakha: auth.user.vedaShakha && auth.user.vedaShakha !== 'Not Specified' ? auth.user.vedaShakha : '',
        sutram: auth.user.sutram && auth.user.sutram !== 'Not Specified' ? auth.user.sutram : '',
        sampradaya: auth.user.sampradaya || 'secular',
        mutt: auth.user.mutt || '',
        kulaDaivam: auth.user.kulaDaivam || '',
        location: auth.user.location || '',
        ancestors: auth.user.ancestors || []
      });
    });
  }, [auth]);

  // Sync profile form state when currentDevotee or auth.user updates
  React.useEffect(() => {
    if (auth?.user) {
      setProfileName(auth.user.name || auth.user.username || '');
      const userGotram = auth.user.gotram || selectedDevotee?.gotram || '';
      setProfileGotram(userGotram !== 'Kashyapa' && userGotram !== 'Not Specified' ? userGotram : '');
      setProfileRashi(auth.user.rashi || selectedDevotee?.rashi || '');
      setProfileNakshatra(auth.user.nakshatra || selectedDevotee?.nakshatra || '');
      setProfileSampradaya(auth.user.sampradaya || selectedDevotee?.sampradaya || 'secular');
      const vShakha = selectedDevotee?.vedaShakha || auth.user.vedaShakha || '';
      setProfileVedaShakha(vShakha !== 'Not Specified' ? vShakha : '');
      const pSutram = selectedDevotee?.sutram || auth.user.sutram || '';
      setProfileSutram(pSutram !== 'Not Specified' ? pSutram : '');
      setProfileKulaDaivam(selectedDevotee?.kulaDaivam || auth.user.kulaDaivam || '');
      setProfileLocation(selectedDevotee?.location || auth.user.location || '');
      setProfileAvatar(auth.user.avatar || selectedDevotee?.avatar || '👤');
    }
  }, [auth, selectedDevotee]);

  const handleSaveProfile = async (e) => {
    e?.preventDefault();
    setSavingProfile(true);
    setProfileSaveMsg('');

    const payload = {
      name: profileName.trim(),
      gotram: profileGotram.trim(),
      rashi: profileRashi,
      nakshatra: profileNakshatra,
      sampradaya: profileSampradaya,
      vedaShakha: profileVedaShakha,
      sutram: profileSutram,
      kulaDaivam: profileKulaDaivam.trim(),
      location: profileLocation.trim(),
      avatar: profileAvatar
    };

    const res = await DataStore.updateProfile(payload);
    setSavingProfile(false);

    if (res.success) {
      setSelectedDevotee(prev => ({ ...prev, ...payload }));
      if (onUpdateUser) onUpdateUser(res.user);
      setProfileSaveMsg('User Profile successfully updated in database!');
      setTimeout(() => setProfileSaveMsg(''), 4000);
    } else {
      setProfileSaveMsg(`Error updating profile: ${res.error || 'Database error'}`);
    }
  };

  if (!auth?.isLoggedIn) {
    return (
      <div className="container" style={{ paddingTop: 60, paddingBottom: 60, textAlign: 'center' }}>
        <div className="card-premium animate-fade-up" style={{ maxWidth: 520, margin: '0 auto', padding: '40px 32px' }}>
          <div style={{ fontSize: 52, marginBottom: 16 }} className="animate-float">🕉️</div>
          <h2 style={{ fontSize: 24, fontWeight: 900, fontFamily: 'Outfit, sans-serif', color: '#f8fafc', marginBottom: 10 }}>
            User Profile & Ancestral Vault
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

  const currentDevotee = selectedDevotee || {
    id: auth?.user?.id || 'dev-user',
    name: auth?.user?.name || auth?.user?.username || 'User',
    gotram: auth?.user?.gotram || 'Not Specified',
    vedaShakha: 'Not Specified',
    sutram: 'Not Specified',
    sampradaya: auth?.user?.sampradaya || 'vadagalai',
    mutt: 'Not Specified',
    kulaDaivam: 'Not Specified',
    location: 'Not Specified',
    ancestors: []
  };

  const tithiData = calculateNextTithiAllotments(currentDevotee);
  const sampradaya = SAMPRADAYA_MATRIX[currentDevotee.sampradaya || 'vadagalai'] || SAMPRADAYA_MATRIX['vadagalai'];
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
            }} className="animate-float">{currentDevotee.avatar || '👤'}</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: 24, fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#f8fafc' }}>
                  {currentDevotee.name}
                </h2>
                <span className={`badge badge-${currentDevotee.sampradaya}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  {sampradaya?.image ? <img src={sampradaya.image} alt="" style={{ width: 14, height: 14, borderRadius: '50%', objectFit: 'contain' }} /> : sampradaya?.icon}
                  {sampradaya?.name}
                </span>
              </div>
              <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: '0 14px' }}>
                {currentDevotee.gotram && <span>Gotram: <strong style={{ color: '#fbbf24' }}>{currentDevotee.gotram}</strong></span>}
                {currentDevotee.rashi && <span>Rashi: <strong style={{ color: '#38bdf8' }}>{currentDevotee.rashi}</strong></span>}
                {currentDevotee.nakshatra && <span>Nakshatra: <strong style={{ color: '#34d399' }}>{currentDevotee.nakshatra}</strong></span>}
                {currentDevotee.vedaShakha && <span>Shakha: <strong style={{ color: '#fbbf24' }}>{currentDevotee.vedaShakha}</strong></span>}
                {currentDevotee.sutram && <span>Sutram: <strong style={{ color: '#fbbf24' }}>{currentDevotee.sutram}</strong></span>}
                {currentDevotee.kulaDaivam && <span>Kula Daivam: <strong style={{ color: '#fbbf24' }}>{currentDevotee.kulaDaivam}</strong></span>}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
            <button className="btn btn-primary btn-sm" onClick={() => setSubTab('profile')}
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800 }}>
              <User size={14} /> Edit Profile
            </button>

            <button className="btn btn-ghost btn-sm" onClick={() => onRunBackgroundTithi(currentDevotee)}
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

      {/* ── MY PROFILE TAB ── */}
      {subTab === 'profile' && (
        <div className="card animate-fade-up" style={{ padding: 32, maxWidth: 740, margin: '0 auto' }}>
          <div className="section-header" style={{ marginBottom: 24 }}>
            <div className="section-title">
              <User size={22} style={{ color: '#f59e0b' }} /> User Profile & Lineage Details
            </div>
            <span className="badge badge-uttaradhi">Database Authenticated</span>
          </div>

          {profileSaveMsg && (
            <div style={{
              padding: '12px 16px', borderRadius: 12, marginBottom: 20,
              background: profileSaveMsg.includes('Error') ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
              border: profileSaveMsg.includes('Error') ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(16,185,129,0.3)',
              color: profileSaveMsg.includes('Error') ? '#f87171' : '#34d399',
              fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8
            }}>
              <CheckCircle2 size={16} /> {profileSaveMsg}
            </div>
          )}

          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="grid-2">
              <div>
                <label className="input-label">Full Name</label>
                <input
                  type="text"
                  className="input"
                  value={profileName}
                  onChange={e => setProfileName(e.target.value)}
                  placeholder="Your Full Name"
                  required
                />
              </div>

              <div>
                <label className="input-label">Avatar Icon</label>
                <select
                  className="select"
                  value={profileAvatar}
                  onChange={e => setProfileAvatar(e.target.value)}
                >
                  <option value="👤">👤 User Default</option>
                  <option value="🕉️">🕉️ Sacred Om</option>
                  <option value="🪔">🪔 Diyas / Light</option>
                  <option value="🙏">🙏 Namaste</option>
                  <option value="🌺">🌺 Sacred Flower</option>
                  <option value="☀️">☀️ Surya / Sun</option>
                </select>
              </div>
            </div>

            <div className="grid-2">
              <div>
                <label className="input-label">Gotram (Lineage)</label>
                <input
                  type="text"
                  className="input"
                  value={profileGotram}
                  onChange={e => setProfileGotram(e.target.value)}
                  placeholder="e.g. Kashyapa, Bharadwaja, Kaushika..."
                />
              </div>

              <div>
                <label className="input-label">Sampradaya / Tradition</label>
                <select
                  className="select"
                  value={profileSampradaya}
                  onChange={e => setProfileSampradaya(e.target.value)}
                >
                  <option value="vadagalai">Sri Vaishnava (Vadagalai)</option>
                  <option value="thengalai">Sri Vaishnava (Thengalai)</option>
                  <option value="uttaradhi">Madhva (Uttaradhi Mutt)</option>
                  <option value="udupi">Madhva (Udupi Ashta Mutt)</option>
                  <option value="smartha">Smartha / Bhagavata Paddhati</option>
                  <option value="secular">Modern Secular / Multi-Lingual</option>
                </select>
              </div>
            </div>

            {/* Janma Rashi & Janma Nakshatra */}
            <div className="grid-2">
              <div>
                <label className="input-label">Janma Rashi (Moon Zodiac Sign)</label>
                <select
                  className="select"
                  value={profileRashi}
                  onChange={e => onSelectProfileRashi(e.target.value)}
                >
                  <option value="">-- Select Janma Rashi --</option>
                  {getRashisForNakshatra(profileNakshatra).map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="input-label">Janma Nakshatra (Birth Star)</label>
                <select
                  className="select"
                  value={profileNakshatra}
                  onChange={e => onSelectProfileNakshatra(e.target.value)}
                >
                  <option value="">-- Select Janma Nakshatra --</option>
                  {getNakshatrasForRashi(profileRashi).map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid-2">
              <div>
                <label className="input-label">Veda Shakha</label>
                <select
                  className="select"
                  value={profileVedaShakha}
                  onChange={e => setProfileVedaShakha(e.target.value)}
                >
                  <option value="Rigveda">Rigveda</option>
                  <option value="Yajurveda (Krishna)">Yajurveda (Krishna)</option>
                  <option value="Yajurveda (Shukla)">Yajurveda (Shukla)</option>
                  <option value="Samaveda">Samaveda</option>
                  <option value="Atharvaveda">Atharvaveda</option>
                  <option value="Not Specified">Not Specified</option>
                </select>
              </div>

              <div>
                <label className="input-label">Sutram</label>
                <select
                  className="select"
                  value={profileSutram}
                  onChange={e => setProfileSutram(e.target.value)}
                >
                  <option value="Ashvalayana Sutram">Ashvalayana Sutram</option>
                  <option value="Apastamba Sutram">Apastamba Sutram</option>
                  <option value="Katyayana Sutram">Katyayana Sutram</option>
                  <option value="Drahyayana Sutram">Drahyayana Sutram</option>
                  <option value="Bodhayana Sutram">Bodhayana Sutram</option>
                  <option value="Not Specified">Not Specified</option>
                </select>
              </div>
            </div>

            <div className="grid-2">
              <div>
                <label className="input-label">Kula Daivam (Family Deity)</label>
                <input
                  type="text"
                  className="input"
                  value={profileKulaDaivam}
                  onChange={e => setProfileKulaDaivam(e.target.value)}
                  placeholder="e.g. Tirupati Venkateswara Swamy"
                />
              </div>

              <div>
                <label className="input-label">Location / City</label>
                <input
                  type="text"
                  className="input"
                  value={profileLocation}
                  onChange={e => setProfileLocation(e.target.value)}
                  placeholder="e.g. Bengaluru, Chennai, Hyderabad..."
                />
              </div>
            </div>

            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={savingProfile}
                style={{ padding: '12px 28px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <Save size={16} /> {savingProfile ? 'Saving Profile...' : 'Save User Profile Details'}
              </button>
            </div>
          </form>
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
                    const meetUrl = (b.meetLink && b.meetLink.trim().length > 0) ? b.meetLink : (b.location && (b.location.startsWith('http://') || b.location.startsWith('https://')) ? b.location : null);

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

                            <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                              <span>📅 Date: <strong style={{ color: '#e2e8f0' }}>{b.date}</strong></span>
                              <span>⏰ Slot: <strong style={{ color: '#fbbf24' }}>{b.muhurtaTime}</strong></span>
                              {b.location && <span>📍 Venue: <strong style={{ color: '#e2e8f0' }}>{b.location}</strong></span>}
                            </p>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                            {meetUrl ? (
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

                            {onOpenFeedback && (
                              <button
                                className="btn btn-ghost btn-sm"
                                onClick={() => onOpenFeedback({ id: b.purohitId || 'pur-101', name: b.purohitName || 'Assigned Pandit', sampradaya: b.sampradaya })}
                                style={{ fontSize: 11, padding: '6px 14px', borderRadius: 12, borderColor: 'rgba(245,158,11,0.3)', color: '#fbbf24', fontWeight: 700 }}
                              >
                                ⭐ Leave Feedback & Audit Review
                              </button>
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
              {(!currentDevotee.ancestors || currentDevotee.ancestors.length === 0) ? (
                <div style={{ textAlign: 'center', padding: '32px 16px', color: '#94a3b8', gridColumn: '1 / -1', background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px dashed rgba(255,255,255,0.1)' }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>No ancestral records added yet to your sacred vault.</p>
                  <p style={{ fontSize: 12, marginTop: 6, color: '#64748b' }}>
                    Click "Add Ancestor" to record your family's Shraaddha dates, Gotram, and Tithi details for automated reminders.
                  </p>
                </div>
              ) : (
                (currentDevotee.ancestors || []).map(anc => (
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
                      View Tithi Allotment <ChevronRight size={14} />
                    </button>
                  </div>
                ))
              )}
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
                <Sparkles size={20} style={{ color: '#f59e0b' }} /> Solar-Lunar Tithi Allotments 2026
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
