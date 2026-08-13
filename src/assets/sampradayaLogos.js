// High-resolution SVG Data URIs for Real-Purohit Sampradaya Lineage Logos

const svgToDataUri = (svgStr) => `data:image/svg+xml;utf8,${encodeURIComponent(svgStr)}`;

export const SAMPRADAYA_LOGOS = {
  uttaradhi: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <defs>
        <linearGradient id="g-utt" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f59e0b"/>
          <stop offset="100%" stop-color="#b45309"/>
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="#1e1b18" stroke="url(#g-utt)" stroke-width="4"/>
      <path d="M50 18 L68 36 L62 36 L62 70 L38 70 L38 36 L32 36 Z" fill="url(#g-utt)"/>
      <path d="M44 70 L44 52 Q50 46 56 52 L56 70 Z" fill="#1e1b18"/>
      <circle cx="50" cy="30" r="4" fill="#fcd34d"/>
      <path d="M26 80 Q50 72 74 80" stroke="#f59e0b" stroke-width="3" fill="none" stroke-linecap="round"/>
    </svg>
  `),

  udupi: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <defs>
        <linearGradient id="g-udp" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8"/>
          <stop offset="100%" stop-color="#1e40af"/>
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="#0f172a" stroke="url(#g-udp)" stroke-width="4"/>
      <path d="M50 16 L50 82 M50 20 L78 36 L50 48 Z" fill="url(#g-udp)" stroke="url(#g-udp)" stroke-width="2" stroke-linejoin="round"/>
      <circle cx="50" cy="50" r="12" fill="#38bdf8" opacity="0.3"/>
      <circle cx="50" cy="50" r="6" fill="#f8fafc"/>
      <path d="M24 78 Q50 84 76 78" stroke="#38bdf8" stroke-width="3" fill="none" stroke-linecap="round"/>
    </svg>
  `),

  vadagalai: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <defs>
        <linearGradient id="g-vdg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ef4444"/>
          <stop offset="100%" stop-color="#991b1b"/>
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="#1a0f12" stroke="url(#g-vdg)" stroke-width="4"/>
      <!-- U-Shaped White Namam -->
      <path d="M30 22 L30 52 Q30 76 50 76 Q70 76 70 52 L70 22 L56 22 L56 50 Q56 64 50 64 Q44 64 44 50 L44 22 Z" fill="#f8fafc"/>
      <!-- Inner Yellow Srichurnam Line -->
      <path d="M47 20 L53 20 L53 68 L47 68 Z" fill="#fbbf24"/>
    </svg>
  `),

  thengalai: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <defs>
        <linearGradient id="g-tng" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f97316"/>
          <stop offset="100%" stop-color="#c2410c"/>
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="#1c130e" stroke="url(#g-tng)" stroke-width="4"/>
      <!-- Y-Shaped Namam with extended lotus base -->
      <path d="M28 20 L28 48 Q28 66 44 72 L44 82 L56 82 L56 72 Q72 66 72 48 L72 20 L58 20 L58 46 Q58 56 50 60 Q42 56 42 46 L42 20 Z" fill="#f8fafc"/>
      <!-- Red Srichurnam Line -->
      <path d="M47 18 L53 18 L53 76 L47 76 Z" fill="#ef4444"/>
    </svg>
  `),

  shankara: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <defs>
        <linearGradient id="g-snk" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#a855f7"/>
          <stop offset="100%" stop-color="#6b21a8"/>
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="#160d1b" stroke="url(#g-snk)" stroke-width="4"/>
      <!-- Sacred Dharma Chakra / Trishula Symbol -->
      <circle cx="50" cy="50" r="24" stroke="url(#g-snk)" stroke-width="5" fill="none"/>
      <circle cx="50" cy="50" r="6" fill="#c084fc"/>
      <path d="M50 16 L50 84 M16 50 L84 50 M26 26 L74 74 M26 74 L74 26" stroke="#c084fc" stroke-width="3" stroke-linecap="round"/>
    </svg>
  `),

  secular: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <defs>
        <linearGradient id="g-sec" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#10b981"/>
          <stop offset="100%" stop-color="#047857"/>
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="#091814" stroke="url(#g-sec)" stroke-width="4"/>
      <!-- Sacred Kalasha & Leaves -->
      <path d="M36 50 Q32 68 50 78 Q68 68 64 50 Z" fill="url(#g-sec)"/>
      <path d="M38 48 L62 48 L58 42 L42 42 Z" fill="#6ee7b7"/>
      <!-- Mango Leaves -->
      <path d="M50 42 C40 24 28 30 36 44" fill="#34d399"/>
      <path d="M50 42 C60 24 72 30 64 44" fill="#34d399"/>
      <path d="M50 42 C50 20 50 18 50 18 C50 18 50 20 50 42" stroke="#6ee7b7" stroke-width="4" stroke-linecap="round"/>
      <circle cx="50" cy="38" r="5" fill="#fcd34d"/>
    </svg>
  `),

  orthodox: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <defs>
        <linearGradient id="g-ort" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fbbf24"/>
          <stop offset="100%" stop-color="#d97706"/>
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="#1c160a" stroke="url(#g-ort)" stroke-width="4"/>
      <!-- Yagna Kundam Fire Flame & Crown -->
      <path d="M26 68 L74 68 L66 82 L34 82 Z" fill="url(#g-ort)"/>
      <path d="M50 18 Q62 38 56 50 Q66 40 68 58 Q50 66 32 58 Q34 40 44 50 Q38 38 50 18 Z" fill="#f59e0b"/>
      <path d="M50 28 Q56 42 52 50 Q56 44 58 54 Q48 60 42 54 Q44 44 50 28 Z" fill="#fef08a"/>
    </svg>
  `)
};
