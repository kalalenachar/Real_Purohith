/**
 * AI Next Time Allotment & Solar-Lunar Tithi Calculation Engine
 * Calculates upcoming Gregorian dates for Hindu Lunar Tithis (Shraaddha, Vratams)
 * and pre-allots matched Mutt Acharyas.
 */

export function calculateNextTithiAllotments(devotee) {
  const { sampradaya, mutt, sutram, ancestors = [] } = devotee;

  const currentYear = new Date().getFullYear();

  // Mock Solar-Lunar calendar conversion matrix for standard Tithis
  const monthMap = {
    'Bhadrapada': { monthOffset: 8, dayOffset: 12 },
    'Kartika': { monthOffset: 10, dayOffset: 5 },
    'Ashwayuja': { monthOffset: 9, dayOffset: 20 },
    'Magha': { monthOffset: 1, dayOffset: 15 }
  };

  const allotments = ancestors.map(anc => {
    const monthData = monthMap[anc.month] || { monthOffset: 8, dayOffset: 18 };
    // Project next occurrence date
    const targetDate = new Date(currentYear, monthData.monthOffset, monthData.dayOffset);
    const dateFormatted = targetDate.toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    // Time window calculation based on traditional midday (Aparahna Kaala for Shraaddha)
    const aparahnaStart = '11:45 AM';
    const aparahnaEnd = '02:15 PM';

    return {
      ancestorId: anc.id,
      ancestorName: anc.name,
      relation: anc.relation,
      tithiDetails: `${anc.month} ${anc.paksha} ${anc.tithi}`,
      gregorianDate: dateFormatted,
      recommendedWindow: `${aparahnaStart} - ${aparahnaEnd}`,
      sampradayaMatch: sampradaya,
      recommendedMuttLineage: mutt || 'Uttaradhi Mutt / Standard Sampradaya',
      sutramMatch: sutram,
      fcmPushPayload: {
        title: `🪔 Tithi Allotment Reminder: ${anc.relation} Shraaddha`,
        body: `Upcoming ${anc.month} ${anc.tithi} on ${dateFormatted}. Pre-allotted ${mutt} Acharya slot available.`,
        data: {
          ancestorId: anc.id,
          date: dateFormatted,
          sampradaya
        }
      },
      apnsPushPayload: {
        aps: {
          alert: {
            title: `Sacred Tithi Reminder`,
            subtitle: `${anc.name} (${anc.relation})`,
            body: `Auspicious window ${aparahnaStart} on ${dateFormatted}. Tap to confirm Acharya.`
          },
          sound: 'default'
        }
      }
    };
  });

  return {
    calculatedAt: new Date().toISOString(),
    devoteeName: devotee.name,
    totalAllotments: allotments.length,
    allotments
  };
}
