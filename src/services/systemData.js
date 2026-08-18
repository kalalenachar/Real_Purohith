import { SAMPRADAYA_LOGOS } from '../assets/sampradayaLogos.js';

export const RASHI_LIST = [
  'Mesha (Aries)', 'Vrishabha (Taurus)', 'Mithuna (Gemini)', 'Karkataka (Cancer)',
  'Simha (Leo)', 'Kanya (Virgo)', 'Tula (Libra)', 'Vrishchika (Scorpio)',
  'Dhanus (Sagittarius)', 'Makara (Capricorn)', 'Kumbha (Aquarius)', 'Meena (Pisces)'
];

export const NAKSHATRA_LIST = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya',
  'Ashlesha', 'Magha', 'Purva Phalguni (Pubba)', 'Uttara Phalguni (Uttara)', 'Hasta', 'Chitra',
  'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purvashadha', 'Uttarashadha',
  'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

export const SAMPRADAYA_MATRIX = {
  uttaradhi: {
    id: 'uttaradhi',
    name: 'Uttaradhi Mutt (Dvaita)',
    badgeClass: 'badge-uttaradhi',
    description: 'Adhering strictly to Uttaradhi Mutt lineage.',
    icon: '🛕',
    image: SAMPRADAYA_LOGOS.uttaradhi
  },
  udupi: {
    id: 'udupi',
    name: 'Udupi Madhva (Ashta Mutts)',
    badgeClass: 'badge-udupi',
    description: 'Trained under Udupi Ashta Mutts (Palimaru, Pejavara, Sodhe, etc.).',
    icon: '🚩',
    image: SAMPRADAYA_LOGOS.udupi
  },
  vadagalai: {
    id: 'vadagalai',
    name: 'Sri Vaishnava (Vadagalai)',
    badgeClass: 'badge-vadagalai',
    description: 'Following Vedanta Desika tradition.',
    icon: '🪔',
    image: SAMPRADAYA_LOGOS.vadagalai
  },
  thengalai: {
    id: 'thengalai',
    name: 'Sri Vaishnava (Thengalai)',
    badgeClass: 'badge-thengalai',
    description: 'Following Manavala Mahamuni tradition.',
    icon: '⚜️',
    image: SAMPRADAYA_LOGOS.thengalai
  },
  shankara: {
    id: 'shankara',
    name: 'Shankara Mutt (Smartha / Advaita)',
    badgeClass: 'badge-shankara',
    description: 'Following Sringeri, Kanchi, or other Sankara traditions.',
    icon: '☸️',
    image: SAMPRADAYA_LOGOS.shankara
  },
  secular: {
    id: 'secular',
    name: 'Secular / Modern Purohit',
    badgeClass: 'badge-secular',
    description: 'Approachable, multi-lingual explanations (English/Hindi/Telugu/Tamil/Kannada) for modern homes.',
    icon: '🌿',
    image: SAMPRADAYA_LOGOS.secular
  },
  orthodox: {
    id: 'orthodox',
    name: 'High-Level Orthodox Acharyas',
    badgeClass: 'badge-orthodox',
    description: 'Senior Mahamahopadhyayas & Veda Bhashya Rathnas for complex Yagnas, Somayagam & strict Apara Karyam.',
    icon: '👑',
    image: SAMPRADAYA_LOGOS.orthodox
  }
};

export const INITIAL_DEVOTEES = [
  {
    id: 'dev-1',
    name: 'Sri Venkatesh Rao',
    gotram: 'Kashyapa',
    vedaShakha: 'Rigveda',
    sutram: 'Ashvalayana Sutram',
    sampradaya: 'uttaradhi',
    mutt: 'Uttaradhi Mutt',
    kulaDaivam: 'Tirupati Venkateswara Swamy',
    location: 'Bengaluru, Karnataka',
    ancestors: [
      { id: 'anc-1', relation: 'Paternal Grandfather', name: 'Late Ramachandra Rao', month: 'Bhadrapada', paksha: 'Krishna', tithi: 'Navami', passingYear: 2018 },
      { id: 'anc-2', relation: 'Paternal Grandmother', name: 'Late Sita Bai', month: 'Kartika', paksha: 'Shukla', tithi: 'Ekadashi', passingYear: 2021 }
    ]
  }
];

export const INITIAL_PUROHITS = [
  {
    id: 'pur-101',
    name: 'Vidwan Raghavendra Acharya',
    sampradaya: 'uttaradhi',
    mutt: 'Uttaradhi Mutt',
    vedaShakha: 'Rigveda',
    sutram: 'Ashvalayana Sutram',
    experienceYears: 18,
    languages: ['Kannada', 'Sanskrit', 'Telugu', 'English'],
    specialties: ['Satyanarayana Pooja', 'Mahasudarshana Homam', 'Varshika Shraaddha', 'Garuda Purana Pravachanam'],
    trustScore: 98,
    status: 'Verified Master Acharya'
  },
  {
    id: 'pur-102',
    name: 'Sri Krishna Bhat',
    sampradaya: 'udupi',
    mutt: 'Palimaru Mutt (Ashta Mutt)',
    vedaShakha: 'Rigveda',
    sutram: 'Ashvalayana Sutram',
    experienceYears: 15,
    languages: ['Kannada', 'Tulu', 'Sanskrit'],
    specialties: ['Madhva Devara Pooja', 'Koti Gayatri Parayanam', 'Vastu Shanti'],
    trustScore: 96,
    status: 'Verified Acharya'
  },
  {
    id: 'pur-103',
    name: 'Srinivasa Sampath Kumaran Acharya',
    sampradaya: 'vadagalai',
    mutt: 'Ahobila Mutt / Parakala Mutt',
    vedaShakha: 'Yajurveda',
    sutram: 'Apastamba Sutram',
    experienceYears: 22,
    languages: ['Tamil', 'Sanskrit', 'English'],
    specialties: ['Sudarsana Homam', 'Seetha Rama Kalyanam', 'Desika Prabhanda Parayanam'],
    trustScore: 99,
    status: 'Verified Master Acharya'
  },
  {
    id: 'pur-104',
    name: 'Sri Thiruvengada Ramanuja Jeeyar Swami',
    sampradaya: 'thengalai',
    mutt: 'Vanamamalai Mutt',
    vedaShakha: 'Sama Veda',
    sutram: 'Drahyayana Sutram',
    experienceYears: 20,
    languages: ['Tamil', 'Sanskrit', 'Telugu'],
    specialties: ['Nalayira Divya Prabhandam', 'Thiruppavai Pravachanam', 'Nitya Aradhana'],
    trustScore: 97,
    status: 'Verified Acharya'
  },
  {
    id: 'pur-105',
    name: 'Mahamahopadhyaya Shankara Narayana Ghanapathi',
    sampradaya: 'orthodox',
    mutt: 'Sringeri Sharada Peetham',
    vedaShakha: 'Krishna Yajurveda (Ghana Pathi)',
    sutram: 'Bodhayana Sutram',
    experienceYears: 32,
    rating: 5.0,
    reviewsCount: 310,
    languages: ['Sanskrit', 'Telugu', 'Tamil', 'Kannada', 'Hindi'],
    specialties: ['Koti Chandi Homam', 'Somayagam', 'Strict Apara Karyams (13-day lifecycle)', 'Garuda Purana Pravachanam'],
    trustScore: 100,
    status: 'High-Level Orthodox Veda Rathna'
  },
  {
    id: 'pur-106',
    name: 'Pt. Anish Sharma',
    sampradaya: 'secular',
    mutt: 'Secular / Multi-Lingual',
    vedaShakha: 'Yajurveda',
    sutram: 'Apastamba Sutram',
    experienceYears: 9,
    rating: 4.78,
    reviewsCount: 84,
    languages: ['English', 'Hindi', 'Telugu'],
    specialties: ['Griha Pravesham with English Explanation', 'Compact Ganapathi Pooja', 'Baby Naming Ceremony'],
    trustScore: 92,
    status: 'Verified Modern Acharya'
  }
];

export const INITIAL_BOOKINGS = [
  {
    id: 'BK-8901',
    devoteeName: 'Sri Venkatesh Rao',
    devoteeId: 'dev-1',
    devoteePhone: '+91 98450 11223',
    purohitName: 'Vidwan Raghavendra Acharya',
    purohitId: 'pur-101',
    sampradaya: 'uttaradhi',
    ritualName: 'Varshika Shraaddha (Ancestral Rites)',
    date: '2026-08-14',
    muhurtaTime: '08:30 AM',
    dakshinaAmount: '₹ 3,500',
    dakshinaStatus: 'Direct On-the-Spot (0% Platform Fee)',
    samagriMode: 'Pandit Hand-Carried Custom Kit',
    status: 'Scheduled',
    isAparaKaryam: true,
    location: 'Indiranagar, Bengaluru'
  },
  {
    id: 'BK-8902',
    devoteeName: 'Sri Venkatesh Rao',
    devoteeId: 'dev-1',
    devoteePhone: '+91 98450 11223',
    purohitName: 'Srinivasa Sampath Kumaran Acharya',
    purohitId: 'pur-103',
    sampradaya: 'vadagalai',
    ritualName: 'Srimad Ramayana & Sundarakanda Pravachanam',
    date: '2026-08-16',
    muhurtaTime: '06:00 PM',
    dakshinaAmount: '₹ 5,000',
    dakshinaStatus: 'Direct On-the-Spot (0% Platform Fee)',
    samagriMode: 'Pre-Delivery via Courier (Delivered)',
    status: 'Confirmed',
    isAparaKaryam: false,
    location: 'T. Nagar, Chennai'
  },
  {
    id: 'VSP-9001',
    devoteeName: 'Smt. Gayatri Devi',
    devoteeId: 'dev-2',
    devoteePhone: '+91 98450 44556',
    purohitName: 'Pending Parayana Acharya',
    purohitId: 'unassigned',
    sampradaya: 'uttaradhi',
    ritualName: 'Free 1-on-1 Vishnu Sahasranama Parayanam',
    date: '2026-08-20',
    muhurtaTime: '06:00 PM – 06:30 PM',
    dakshinaAmount: '₹0 (100% Free Seva)',
    dakshinaStatus: '100% Truly Free Seva',
    samagriMode: 'Gotram: Bharadwaja | Nakshatra: Hasta | Sankalpa: Family Wellbeing & Health',
    status: 'Pending Admin Review',
    isAparaKaryam: false,
    location: 'In-App Live Stream & WhatsApp (Google Meet Link Sent to Devotee)'
  },
  {
    id: 'VSP-9002',
    devoteeName: 'Sri Ramesh Kumar',
    devoteeId: 'dev-3',
    devoteePhone: '+91 97312 77889',
    purohitName: 'Vidwan Raghavendra Acharya',
    purohitId: 'pur-101',
    sampradaya: 'shankara',
    ritualName: 'Free 1-on-1 Vishnu Sahasranama Parayanam',
    date: '2026-08-21',
    muhurtaTime: '06:00 PM – 06:30 PM',
    dakshinaAmount: '₹0 (100% Free Seva)',
    dakshinaStatus: '100% Truly Free Seva',
    samagriMode: 'Gotram: Kashyapa | Nakshatra: Rohini | Sankalpa: Peace & Spiritual Growth',
    status: 'Scheduled',
    isAparaKaryam: false,
    location: 'In-App Live Stream & WhatsApp (Google Meet Link Sent to Devotee)'
  }
];


export const INITIAL_FEEDBACKS = [
  {
    id: 'FB-501',
    bookingId: 'BK-8850',
    devoteeName: 'Sri Ananth Swamy',
    purohitId: 'pur-101',
    purohitName: 'Vidwan Raghavendra Acharya',
    sampradaya: 'uttaradhi',
    ratings: {
      punctuality: 5,
      cleanliness: 5,
      mantraAccuracy: 5,
      vidhiExecution: 5,
      devoteeExperience: 5
    },
    sampradayaPaddhatiAccuracy: '100% Strict Uttaradhi Mutt Paddhati Followed',
    reviewText: 'Acharyaru performed the Satyanarayana pooja with absolute devotion and impeccable Nyaya Sudha/Madhva paddhati. Flawless Vedic Swara!',
    aiSentiment: 'Extremely Positive',
    aiConfidence: '99%',
    status: 'Processed by AI Queue',
    dateSubmitted: '2026-08-10'
  }
];
