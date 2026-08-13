import React from 'react';
import {
  Flame, Heart, BookOpen, User, ShieldCheck, Star,
  CheckCircle2, Globe, Clock, ArrowRight, Sparkles, Award, Compass, Zap
} from 'lucide-react';
import { SAMPRADAYA_MATRIX, INITIAL_PUROHITS } from '../services/systemData.js';

export default function HomePage({ onNavigate, onTriggerSOS, onOpenBooking }) {
  const sampradayaList = Object.values(SAMPRADAYA_MATRIX);
  const featuredAcharyas = INITIAL_PUROHITS.slice(0, 3);

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
      {/* ──────────────────────────────────────────────────────────── */}
      {/*  HERO SECTION                                                */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section className="hero-banner" style={{ marginBottom: 40, position: 'relative', overflow: 'hidden', padding: '48px 36px', borderRadius: 28 }}>
        <div className="orb orb-gold" style={{ width: 450, height: 450, top: -140, right: -100, opacity: 0.2 }} />
        <div className="orb orb-red" style={{ width: 350, height: 350, bottom: -120, left: -80, opacity: 0.12 }} />

        <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
          {/* Top Sacred Pill */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 9999, background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.35)', marginBottom: 20 }}>
            <span style={{ fontSize: 14 }}>🪔</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#fbbf24', fontFamily: 'Outfit,sans-serif', letterSpacing: '0.4px' }}>
              0% Platform Fee · 100% Direct Dakshina to Acharyas
            </span>
          </div>

          {/* Hero Headline */}
          <h1 style={{ fontSize: 'clamp(28px, 4.5vw, 44px)', fontFamily: 'Outfit,sans-serif', fontWeight: 900, color: '#f8fafc', lineHeight: 1.15, marginBottom: 16 }}>
            Sacred Vedic Acharya & <br />
            <span className="text-gold-gradient">Sampradaya Ecosystem</span>
          </h1>

          <p style={{ fontSize: 15, color: '#cbd5e1', lineHeight: 1.7, marginBottom: 32, maxWidth: 960 }}>
            Directly connect with authenticated Veda Pandits & Pauranikas adhering strictly to your family’s tradition: <span className="serif" style={{ color: '#fbbf24', fontStyle: 'italic', fontWeight: 600 }}>Uttaradhi Mutt (Dvaita)</span>, <span className="serif" style={{ color: '#f59e0b', fontStyle: 'italic', fontWeight: 600 }}>Udupi Ashta Mutts</span>, <span className="serif" style={{ color: '#f97316', fontStyle: 'italic', fontWeight: 600 }}>Sri Vaishnava</span>, <span className="serif" style={{ color: '#c4b5fd', fontStyle: 'italic', fontWeight: 600 }}>Smartha Shankara</span>, and <span className="serif" style={{ color: '#6ee7b7', fontStyle: 'italic', fontWeight: 600 }}>Secular / Universal</span>.
          </p>

          {/* Action CTAs — FREE SEVA AT THE VERY TOP */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
            <button className="btn btn-primary btn-lg" onClick={() => onNavigate('freeSeva')} style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', fontWeight: 800 }}>
              <Heart size={18} /> 🪔 Explore Noble Free Sevas (100% Free)
            </button>
            <button className="btn btn-ghost btn-lg" onClick={() => onOpenBooking && onOpenBooking('Free 1-on-1 Vishnu Sahasranama Parayanam')}>
              <BookOpen size={18} /> Schedule Ritual Booking
            </button>
            <button className="btn btn-danger btn-lg sos-btn" onClick={onTriggerSOS}>
              <Flame size={18} /> 30-Min Emergency SOS
            </button>
            <button className="btn btn-ghost btn-lg" onClick={() => onNavigate('pravachanam')}>
              <BookOpen size={18} /> Explore Pravachanam
            </button>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/*  TOP FEATURED NOBLE FREE SEVAS BANNER                        */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section style={{ marginBottom: 44, padding: '24px 28px', borderRadius: 24, background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.3)', boxShadow: '0 10px 40px rgba(16,185,129,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: 18, background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, boxShadow: '0 6px 20px rgba(16,185,129,0.35)' }}>
              🪔
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#34d399', textTransform: 'uppercase', letterSpacing: 1 }}>100% Truly Free Seva Vertical</div>
              <h3 style={{ fontSize: 20, fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#f8fafc', marginTop: 2 }}>Free 1-on-1 Vishnu Sahasranama & Jyotisha Astrology</h3>
              <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>No platform fees · Direct Google Meet session links delivered to your Devotee Vault inside the app.</p>
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => onNavigate('freeSeva')} style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', fontWeight: 800, padding: '10px 20px' }}>
            Book Free Seva Now <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/*  KPI STATS FLOATING BAR                                      */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 48 }}>
        <div className="kpi-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span className="kpi-label">Direct Admin Desk</span>
            <Award size={18} style={{ color: '#fbbf24' }} />
          </div>
          <div className="kpi-value text-gold-gradient">Centralized</div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>Verified Admin Desk Allocation</div>
        </div>

        <div className="kpi-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span className="kpi-label">Sampradayas</span>
            <Compass size={18} style={{ color: '#38bdf8' }} />
          </div>
          <div className="kpi-value" style={{ color: '#38bdf8' }}>Multi Tradition</div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>Strict Paddhati & Sutra Matching</div>
        </div>

        <div className="kpi-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span className="kpi-label">Platform Fee</span>
            <Zap size={18} style={{ color: '#34d399' }} />
          </div>
          <div className="kpi-value" style={{ color: '#34d399' }}>0% Platform Fee</div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>100% Direct Scholar Honorarium</div>
        </div>

        <div className="kpi-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span className="kpi-label">Emergency SLA</span>
            <Clock size={18} style={{ color: '#f87171' }} />
          </div>
          <div className="kpi-value" style={{ color: '#f87171' }}>&lt; 30 Mins</div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>Apara Kriya Emergency Dispatch</div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/*  SAMPRADAYA MATRIX EXPLORER                                  */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section style={{ marginBottom: 56 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>
              Tradition & Lineage Filter
            </div>
            <h2 style={{ fontSize: 24, fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#f8fafc' }}>
              Explore Supported Sampradaya Traditions
            </h2>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => onOpenBooking && onOpenBooking('Satyanarayana Swamy Pooja & Vrata')}>
            Request Ritual Booking <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {sampradayaList.map((item) => (
            <div key={item.id} className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  {item.image ? (
                    <img src={item.image} alt={item.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'contain' }} />
                  ) : (
                    <span style={{ fontSize: 32 }}>{item.icon}</span>
                  )}
                  <span className={`badge ${item.badgeClass}`}>{item.name}</span>
                </div>
                <h3 style={{ fontSize: 16, fontFamily: 'Outfit,sans-serif', fontWeight: 700, color: '#f8fafc', marginBottom: 8 }}>
                  {item.name}
                </h3>
                <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6, marginBottom: 16 }}>
                  {item.description}
                </p>
              </div>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => onOpenBooking && onOpenBooking('Satyanarayana Swamy Pooja & Vrata')}
                style={{ width: '100%', justifyContent: 'space-between' }}
              >
                <span>Book {item.name.split(' ')[0]} Ritual</span>
                <ArrowRight size={13} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/*  CORE SERVICE VERTICALS                                      */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section style={{ marginBottom: 56 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>
            Core Ecosystem Verticals
          </div>
          <h2 style={{ fontSize: 26, fontFamily: 'Outfit,sans-serif', fontWeight: 900, color: '#f8fafc' }}>
            Comprehensive Vedic Services
          </h2>
          <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 6 }}>
            From joyful home discourses to urgent after-death rites and free public sevas.
          </p>
        </div>

        <div className="grid-3">
          {/* Vertical 1: Pravachanam */}
          <div className="card" style={{ padding: 28, borderTop: '3px solid #fbbf24', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 36, marginBottom: 14 }}>🎙️</div>
              <h3 style={{ fontSize: 18, fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#f8fafc', marginBottom: 8 }}>
                Upanyasam & Pravachanam
              </h3>
              <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6, marginBottom: 16 }}>
                Srimad Bhagavatha Sapthaham, Ramayana Katha, and Bhagavad Gita discourses by renowned Pauranikas for home, hall, or online NRI events.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
                {['7-Day Katha & Sapthaham', 'NRI Live HD Virtual Stream', 'Pauranika Scholar Verification'].map((feat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#cbd5e1' }}>
                    <CheckCircle2 size={12} style={{ color: '#fbbf24' }} /> {feat}
                  </div>
                ))}
              </div>
            </div>
            <button className="btn btn-primary" onClick={() => onNavigate('pravachanam')}>
              Book Pravachanam
            </button>
          </div>

          {/* Vertical 2: Apara Kriya */}
          <div className="card glass-red" style={{ padding: 28, borderTop: '3px solid #dc2626', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 36, marginBottom: 14 }}>🔥</div>
              <h3 style={{ fontSize: 18, fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#f8fafc', marginBottom: 8 }}>
                30-Min Apara Kriya SOS
              </h3>
              <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6, marginBottom: 16 }}>
                24/7 instant dispatch for final rites, Dasha Dina Kriyas, and sacred Tirtha Kriyas (Gaya, Rameswaram, Kashi, Gokarna).
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
                {['30-Min Guaranteed Response', 'Strict Sutra & Shakha Alignment', 'Remote NRI E-Pinda Daan'].map((feat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#cbd5e1' }}>
                    <CheckCircle2 size={12} style={{ color: '#f87171' }} /> {feat}
                  </div>
                ))}
              </div>
            </div>
            <button className="btn btn-danger" onClick={onTriggerSOS}>
              Dispatch Emergency SOS
            </button>
          </div>

          {/* Vertical 3: Noble Free Seva */}
          <div className="card" style={{ padding: 28, borderTop: '3px solid #10b981', background: 'rgba(16,185,129,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 36, marginBottom: 14 }}>🪷</div>
              <h3 style={{ fontSize: 18, fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#f8fafc', marginBottom: 8 }}>
                Noble Free Seva
              </h3>
              <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6, marginBottom: 16 }}>
                100% Truly free digital 1-on-1 Vishnu Sahasranama Parayanam and Jyotisha Vedic Astrology consultations for underprivileged families.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
                {['Personalized Sankalpa Recitation', 'Free Jyotisha Kundali Analysis', 'Google Meet 1-on-1 Sessions'].map((feat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#cbd5e1' }}>
                    <CheckCircle2 size={12} style={{ color: '#34d399' }} /> {feat}
                  </div>
                ))}
              </div>
            </div>
            <button className="btn btn-ghost" onClick={() => onNavigate('freeSeva')} style={{ borderColor: 'rgba(16,185,129,0.4)', color: '#34d399' }}>
              Register for Free Seva
            </button>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/*  FEATURED RITUAL SERVICES SHOWCASE                            */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section style={{ marginBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>
              Direct Admin Fulfillment
            </div>
            <h2 style={{ fontSize: 24, fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#f8fafc' }}>
              Featured Sacred Ceremony Services
            </h2>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => onOpenBooking && onOpenBooking('Satyanarayana Swamy Pooja & Vrata')}>
            View All Ritual Types <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid-3">
          {[
            { title: 'Satyanarayana Swamy Pooja & Vrata', badge: 'Popular Vrata', desc: 'Full Katha, Ashtothram, and Archana per family paddhati.', dakshina: '₹3,500', icon: '🪔' },
            { title: 'Mahasudarshana & Dhanvantari Homam', badge: 'Divine Protection', desc: 'Elaborate fire ritual invoking health, peace & prosperity with 108 Ahutis.', dakshina: '₹6,500', icon: '🔥' },
            { title: 'Griha Pravesham & Vastu Shanti', badge: 'House Warming', desc: 'Vastu Shanti, Ganapati Homam, and house blessing per planetary muhurta.', dakshina: '₹8,500', icon: '🏠' }
          ].map((item, idx) => (
            <div key={idx} className="card acharya-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
                  <div style={{ fontSize: 32 }}>{item.icon}</div>
                  <span className="badge badge-uttaradhi">{item.badge}</span>
                </div>
                <h3 style={{ fontSize: 16, fontFamily: 'Outfit,sans-serif', fontWeight: 700, color: '#f8fafc', marginBottom: 6 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5, marginBottom: 16 }}>
                  {item.desc}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 14 }}>
                <span style={{ fontSize: 13, color: '#34d399', fontWeight: 800, fontFamily: 'monospace' }}>
                  {item.dakshina}
                </span>
                <button className="btn btn-primary btn-sm" onClick={() => onOpenBooking && onOpenBooking(item.title)}>
                  Book Ritual
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
