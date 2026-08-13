import React, { useState } from 'react';
import {
  Star, Mic, X, Send, Sparkles, CheckCircle2, MicOff
} from 'lucide-react';

const PARAMS = [
  { key: 'punctuality',       emoji: '⏱️', title: 'Time Sense & Punctuality',     desc: 'Arrival and Muhurta window adherence' },
  { key: 'cleanliness',       emoji: '🧼', title: 'Discipline & Cleanliness',       desc: 'Madi purity, attire, mandap setup' },
  { key: 'mantraAccuracy',    emoji: '🗣️', title: 'Mantra Pronunciation',           desc: 'Vedic Swara clarity and accuracy' },
  { key: 'vidhiExecution',    emoji: '🪔', title: 'Tantra / Vidhi Execution',       desc: 'Step-by-step Paddhati adherence' },
  { key: 'devoteeExperience', emoji: '💬', title: 'Devotee Experience',             desc: 'Politeness, patience, ritual explanation' },
];

const PADDHATI_OPTIONS = [
  '100% Strict Mutt Paddhati Followed',
  '90% — Minor Regional Variation',
  'Partially Followed — Some Deviations',
  'Deviated from Traditional Paddhati',
];

export default function FeedbackModal({ purohit, onClose, onSubmit }) {
  const [ratings, setRatings] = useState({ punctuality: 5, cleanliness: 5, mantraAccuracy: 5, vidhiExecution: 5, devoteeExperience: 5 });
  const [paddhati, setPaddhati] = useState(PADDHATI_OPTIONS[0]);
  const [reviewText, setReviewText] = useState('');
  const [recording, setRecording] = useState(false);
  const [voiceDone, setVoiceDone] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const avgRating = (Object.values(ratings).reduce((a, b) => a + b, 0) / 5).toFixed(1);

  const handleVoice = () => {
    if (recording) return;
    setRecording(true);
    setTimeout(() => {
      setRecording(false);
      setVoiceDone(true);
      setReviewText(t => t + (t ? ' ' : '') + '[Voice note: "Flawless Vedic Swara recitation."]');
    }, 3000);
  };

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onSubmit({ purohitId: purohit.id, purohitName: purohit.name, sampradaya: purohit.sampradaya, ratings, sampradayaPaddhatiAccuracy: paddhati, reviewText });
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        {/* Header */}
        <div style={{ padding: '24px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14, fontSize: 22,
              background: 'linear-gradient(135deg,rgba(245,158,11,0.2),rgba(234,88,12,0.15))',
              border: '1px solid rgba(245,158,11,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>⭐</div>
            <div>
              <h3 style={{ fontSize: 18, fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#f8fafc' }}>
                Multi-Dimensional Review
              </h3>
              <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                Reviewing <span style={{ color: '#fbbf24', fontWeight: 600 }}>{purohit.name}</span> · {purohit.mutt}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 10, padding: 8, cursor: 'pointer', color: '#94a3b8', display: 'flex' }}>
            <X size={18} />
          </button>
        </div>

        {/* Avg Rating Display */}
        <div style={{ margin: '0 28px', marginTop: 20, padding: '16px 20px', borderRadius: 14, background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, color: '#94a3b8' }}>Your Overall Rating</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {[1,2,3,4,5].map(s => (
              <Star key={s} size={18} style={{ color: s <= Math.round(+avgRating) ? '#fbbf24' : '#1e293b', fill: s <= Math.round(+avgRating) ? '#fbbf24' : '#1e293b' }} />
            ))}
            <span className="text-gold-gradient" style={{ fontSize: 22, fontWeight: 900, fontFamily: 'Outfit,sans-serif', marginLeft: 8 }}>{avgRating}</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* 5 Parameters */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
              Rate 5 Dimensions
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {PARAMS.map(p => (
                <div key={p.key} className="param-row">
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{p.emoji} {p.title}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{p.desc}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                    {[1,2,3,4,5].map(s => (
                      <button type="button" key={s} className="star-btn" onClick={() => setRatings(r => ({ ...r, [p.key]: s }))}>
                        <Star size={20} className={s <= ratings[p.key] ? 'star-filled' : 'star-empty'}
                          style={{ fill: s <= ratings[p.key] ? '#fbbf24' : '#1e293b', color: s <= ratings[p.key] ? '#fbbf24' : '#1e293b' }} />
                      </button>
                    ))}
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#fbbf24', marginLeft: 6, fontFamily: 'monospace', minWidth: 14 }}>
                      {ratings[p.key]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Paddhati Select */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>
              Sampradaya & Mutt Paddhati Accuracy
            </label>
            <select className="select" value={paddhati} onChange={e => setPaddhati(e.target.value)}>
              {PADDHATI_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          {/* Review Text + Voice */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>Detailed Feedback</label>
              <button type="button" onClick={handleVoice} style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px',
                borderRadius: 20, border: `1px solid ${recording ? '#dc2626' : voiceDone ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.1)'}`,
                background: recording ? 'rgba(220,38,38,0.15)' : voiceDone ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.04)',
                color: recording ? '#fca5a5' : voiceDone ? '#34d399' : '#94a3b8',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
                animation: recording ? 'pulse-ring 1.4s infinite' : 'none'
              }}>
                {recording ? <Mic size={14} /> : voiceDone ? <CheckCircle2 size={14} /> : <Mic size={14} />}
                {recording ? 'Listening…' : voiceDone ? 'Voice Attached' : 'Record Voice'}
              </button>
            </div>
            <textarea
              className="input"
              rows={3}
              style={{ resize: 'vertical', fontFamily: 'Inter,sans-serif' }}
              placeholder="Describe your experience with this Acharya…"
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
            />
          </div>

          {/* notice */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 12, background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', fontSize: 12, color: '#c4b5fd' }}>
            <Sparkles size={15} style={{ flexShrink: 0, color: '#a78bfa' }} />
            Submission updates scholar ratings and Mutt Trust Score in real time.
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 4 }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: submitted ? 0.7 : 1 }}
              disabled={submitted}>
              {submitted ? <CheckCircle2 size={15} /> : <Send size={15} />}
              {submitted ? 'Submitting Review…' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
