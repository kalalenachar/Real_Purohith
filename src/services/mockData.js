export const SAMPRADAYA_MATRIX = {
  uttaradhi: {
    id: 'uttaradhi',
    name: 'Uttaradhi Mutt (Dvaita)',
    badgeClass: 'badge-uttaradhi',
    description: 'Adhering strictly to Uttaradhi Mutt lineage, Sri Jayatirthar Nyaya Sudha paddhati.',
    icon: '🛕'
  },
  udupi: {
    id: 'udupi',
    name: 'Udupi Madhva (Ashta Mutts)',
    badgeClass: 'badge-udupi',
    description: 'Trained under Udupi Ashta Mutts (Palimaru, Pejavara, Sodhe, etc.) paddhati.',
    icon: '🚩'
  },
  vadagalai: {
    id: 'vadagalai',
    name: 'Sri Vaishnava (Vadagalai)',
    badgeClass: 'badge-vadagalai',
    description: 'Following Swami Desikan tradition, Sri Bhashyam, and Desika Prabhandam.',
    icon: '🪔'
  },
  thengalai: {
    id: 'thengalai',
    name: 'Sri Vaishnava (Thengalai)',
    badgeClass: 'badge-thengalai',
    description: 'Following Manavala Mamunigal tradition and Nalayira Divya Prabhandam.',
    icon: '⚜️'
  },
  shankara: {
    id: 'shankara',
    name: 'Shankara Mutt (Smartha / Advaita)',
    badgeClass: 'badge-shankara',
    description: 'Following Sringeri, Kanchi, or Kudli Shankara Mutt traditions & Apastamba/Ashvalayana Sutram.',
    icon: '☸️'
  },
  secular: {
    id: 'secular',
    name: 'Secular / Modern Purohit',
    badgeClass: 'badge-secular',
    description: 'Approachable, multi-lingual explanations (English/Hindi/Telugu/Tamil/Kannada) for modern homes.',
    icon: '🌿'
  },
  orthodox: {
    id: 'orthodox',
    name: 'High-Level Orthodox Acharyas',
    badgeClass: 'badge-orthodox',
    description: 'Senior Mahamahopadhyayas & Veda Bhashya Rathnas for complex Yagnas, Somayagam & strict Apara Karyam.',
    icon: '👑'
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
  },
  {
    id: 'dev-2',
    name: 'Sriman Soundararajan Iyengar',
    gotram: 'Bharadwaja',
    vedaShakha: 'Yajurveda (Krishna)',
    sutram: 'Apastamba Sutram',
    sampradaya: 'vadagalai',
    mutt: 'Ahobila Mutt',
    kulaDaivam: 'Oppiliappan Swamy',
    location: 'Chennai, Tamil Nadu',
    ancestors: [
      { id: 'anc-3', relation: 'Father', name: 'Late Ananthachariar', month: 'Ashwayuja', paksha: 'Shukla', tithi: 'Panchami', passingYear: 2019 }
    ]
  },
  {
    id: 'dev-3',
    name: 'Dr. Subramanya Shastri',
    gotram: 'Vasishta',
    vedaShakha: 'Yajurveda (Shukla)',
    sutram: 'Katyayana Sutram',
    sampradaya: 'shankara',
    mutt: 'Sringeri Sharada Peetham',
    kulaDaivam: 'Sharadamba',
    location: 'Hyderabad, Telangana',
    ancestors: [
      { id: 'anc-4', relation: 'Mother', name: 'Late Gayatri Devi', month: 'Magha', paksha: 'Krishna', tithi: 'Thritheeya', passingYear: 2020 }
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
    rating: 4.9,
    reviewsCount: 142,
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
    rating: 4.85,
    reviewsCount: 98,
    languages: ['Kannada', 'Tulu', 'Sanskrit'],
    specialties: ['Madrhva Devara Pooja', 'Koti Gayatri Parayanam', 'Vastu Shanti'],
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
    rating: 4.95,
    reviewsCount: 210,
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
    rating: 4.92,
    reviewsCount: 175,
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
    devoteeName: 'Sriman Soundararajan Iyengar',
    devoteeId: 'dev-2',
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

export const INITIAL_USERS = [
  {
    id: 'user-admin',
    username: 'admin',
    email: 'admin@real-purohit.org',
    password: 'admin',
    name: 'Chief Administrator',
    role: 'admin',
    avatar: '👑'
  },
  {
    id: 'user-devotee-1',
    username: 'venkatesh',
    email: 'venkatesh@real-purohit.org',
    password: 'user123',
    name: 'Sri Venkatesh Rao',
    role: 'devotee',
    gotram: 'Kashyapa',
    sampradaya: 'uttaradhi',
    avatar: '🕉️'
  },
  {
    id: 'user-purohit-1',
    username: 'acharyar',
    email: 'acharyar@real-purohit.org',
    password: 'user123',
    name: 'Vidwan Raghavendra Acharya',
    role: 'purohit',
    sampradaya: 'uttaradhi',
    avatar: '🪔'
  }
];

