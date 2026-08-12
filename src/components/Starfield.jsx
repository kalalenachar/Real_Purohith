import React, { useMemo } from 'react';

/** Animated starfield background */
export function Starfield() {
  const stars = useMemo(() => {
    return Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      dur: (Math.random() * 3 + 2).toFixed(1),
      delay: (Math.random() * 4).toFixed(1)
    }));
  }, []);

  return (
    <div className="starfield" aria-hidden="true">
      {stars.map(s => (
        <div
          key={s.id}
          className="star"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            '--dur': `${s.dur}s`,
            '--delay': `${s.delay}s`,
            opacity: 0.2
          }}
        />
      ))}
      {/* Floating orbs */}
      <div className="orb orb-gold" style={{ width: 500, height: 500, top: '-10%', left: '-5%', opacity: 0.12 }} />
      <div className="orb orb-red"  style={{ width: 400, height: 400, bottom: '10%', right: '-8%', opacity: 0.1 }} />
      <div className="orb orb-blue" style={{ width: 350, height: 350, top: '40%', left: '30%', opacity: 0.06 }} />
    </div>
  );
}
