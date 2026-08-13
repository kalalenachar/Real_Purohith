/* ──────────────────────────────────────────────────────────── */
/*  Vedic Astrology Engine — Rashi & Nakshatra Mapping Matrix  */
/* ──────────────────────────────────────────────────────────── */

export const RASHI_LIST = [
  'Mesha (Aries)',
  'Vrishabha (Taurus)',
  'Mithuna (Gemini)',
  'Karkataka (Cancer)',
  'Simha (Leo)',
  'Kanya (Virgo)',
  'Tula (Libra)',
  'Vrishchika (Scorpio)',
  'Dhanus (Sagittarius)',
  'Makara (Capricorn)',
  'Kumbha (Aquarius)',
  'Meena (Pisces)'
];

export const NAKSHATRA_LIST = [
  'Ashwini',
  'Bharani',
  'Krittika',
  'Rohini',
  'Mrigashira',
  'Ardra',
  'Punarvasu',
  'Pushya',
  'Ashlesha',
  'Magha',
  'Purva Phalguni (Pubba)',
  'Uttara Phalguni (Uttara)',
  'Hasta',
  'Chitra',
  'Swati',
  'Vishakha',
  'Anuradha',
  'Jyeshtha',
  'Mula',
  'Purvashadha',
  'Uttarashadha',
  'Shravana',
  'Dhanishta',
  'Shatabhisha',
  'Purva Bhadrapada',
  'Uttara Bhadrapada',
  'Revati'
];

// Mapping each Rashi to its exact constituent Nakshatras
export const RASHI_TO_NAKSHATRAS = {
  'Mesha (Aries)': ['Ashwini', 'Bharani', 'Krittika'],
  'Vrishabha (Taurus)': ['Krittika', 'Rohini', 'Mrigashira'],
  'Mithuna (Gemini)': ['Mrigashira', 'Ardra', 'Punarvasu'],
  'Karkataka (Cancer)': ['Punarvasu', 'Pushya', 'Ashlesha'],
  'Simha (Leo)': ['Magha', 'Purva Phalguni (Pubba)', 'Uttara Phalguni (Uttara)'],
  'Kanya (Virgo)': ['Uttara Phalguni (Uttara)', 'Hasta', 'Chitra'],
  'Tula (Libra)': ['Chitra', 'Swati', 'Vishakha'],
  'Vrishchika (Scorpio)': ['Vishakha', 'Anuradha', 'Jyeshtha'],
  'Dhanus (Sagittarius)': ['Mula', 'Purvashadha', 'Uttarashadha'],
  'Makara (Capricorn)': ['Uttarashadha', 'Shravana', 'Dhanishta'],
  'Kumbha (Aquarius)': ['Dhanishta', 'Shatabhisha', 'Purva Bhadrapada'],
  'Meena (Pisces)': ['Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati']
};

// Mapping each Nakshatra to its corresponding Rashis
export const NAKSHATRA_TO_RASHIS = {
  'Ashwini': ['Mesha (Aries)'],
  'Bharani': ['Mesha (Aries)'],
  'Krittika': ['Mesha (Aries)', 'Vrishabha (Taurus)'],
  'Rohini': ['Vrishabha (Taurus)'],
  'Mrigashira': ['Vrishabha (Taurus)', 'Mithuna (Gemini)'],
  'Ardra': ['Mithuna (Gemini)'],
  'Punarvasu': ['Mithuna (Gemini)', 'Karkataka (Cancer)'],
  'Pushya': ['Karkataka (Cancer)'],
  'Ashlesha': ['Karkataka (Cancer)'],
  'Magha': ['Simha (Leo)'],
  'Purva Phalguni (Pubba)': ['Simha (Leo)'],
  'Uttara Phalguni (Uttara)': ['Simha (Leo)', 'Kanya (Virgo)'],
  'Hasta': ['Kanya (Virgo)'],
  'Chitra': ['Kanya (Virgo)', 'Tula (Libra)'],
  'Swati': ['Tula (Libra)'],
  'Vishakha': ['Tula (Libra)', 'Vrishchika (Scorpio)'],
  'Anuradha': ['Vrishchika (Scorpio)'],
  'Jyeshtha': ['Vrishchika (Scorpio)'],
  'Mula': ['Dhanus (Sagittarius)'],
  'Purvashadha': ['Dhanus (Sagittarius)'],
  'Uttarashadha': ['Dhanus (Sagittarius)', 'Makara (Capricorn)'],
  'Shravana': ['Makara (Capricorn)'],
  'Dhanishta': ['Makara (Capricorn)', 'Kumbha (Aquarius)'],
  'Shatabhisha': ['Kumbha (Aquarius)'],
  'Purva Bhadrapada': ['Kumbha (Aquarius)', 'Meena (Pisces)'],
  'Uttara Bhadrapada': ['Meena (Pisces)'],
  'Revati': ['Meena (Pisces)']
};

// Helper: Get valid Nakshatras for a selected Rashi
export function getNakshatrasForRashi(rashi) {
  if (!rashi) return NAKSHATRA_LIST;
  return RASHI_TO_NAKSHATRAS[rashi] || NAKSHATRA_LIST;
}

// Helper: Get valid Rashis for a selected Nakshatra
export function getRashisForNakshatra(nakshatra) {
  if (!nakshatra) return RASHI_LIST;
  return NAKSHATRA_TO_RASHIS[nakshatra] || RASHI_LIST;
}

// Helper: Handle Rashi change with auto Nakshatra validation
export function handleRashiSelection(selectedRashi, currentNakshatra) {
  const validNakshatras = getNakshatrasForRashi(selectedRashi);
  if (currentNakshatra && !validNakshatras.includes(currentNakshatra)) {
    return { rashi: selectedRashi, nakshatra: '' };
  }
  return { rashi: selectedRashi, nakshatra: currentNakshatra };
}

// Helper: Handle Nakshatra change with auto Rashi filtering/selection
export function handleNakshatraSelection(selectedNakshatra, currentRashi) {
  const validRashis = getRashisForNakshatra(selectedNakshatra);
  if (validRashis.length === 1) {
    // Unique Rashi match — auto select it!
    return { rashi: validRashis[0], nakshatra: selectedNakshatra };
  }
  if (currentRashi && validRashis.includes(currentRashi)) {
    return { rashi: currentRashi, nakshatra: selectedNakshatra };
  }
  return { rashi: validRashis[0] || '', nakshatra: selectedNakshatra };
}
