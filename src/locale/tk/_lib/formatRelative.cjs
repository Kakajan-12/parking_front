import isSameWeek from "date-fns/isSameWeek";

const accusativeWeekdays = [
  "ýekşenbe",
  "duşenbe",
  "sişenbe",
  "çarşenbe",
  "penşenbe",
  "anna",
  "şenbe",
];

function lastWeek(day) {
  const weekday = accusativeWeekdays[day];

  // In Turkmen, past references for days of the week typically use " geçen" (last) + day name
  // followed by "sagatda" (at time) which corresponds to 'p' token
  return `'geçen ${weekday} güni sagatda' p`;
}

function thisWeek(day) {
  const weekday = accusativeWeekdays[day];

  // For this week, Turkmen usually uses "şu" (this) + day + "günü"
  return `'şu ${weekday} güni sagatda' p`;
}

function nextWeek(day) {
  const weekday = accusativeWeekdays[day];

  // For next week, Turkmen uses "indiki" (next) + day + "günü"
  return `'indiki ${weekday} güni sagatda' p`;
}

const formatRelativeLocale = {
  lastWeek: (date, baseDate, options) => {
    const day = date.getDay();
    if (isSameWeek(date, baseDate, options)) {
      return thisWeek(day);
    } else {
      return lastWeek(day);
    }
  },
  yesterday: "'düýn sagatda' p",
  today: "'şu gün sagatda' p",
  tomorrow: "'ertir sagatda' p",
  nextWeek: (date, baseDate, options) => {
    const day = date.getDay();
    if (isSameWeek(date, baseDate, options)) {
      return thisWeek(day);
    } else {
      return nextWeek(day);
    }
  },
  other: "P",
};

export const formatRelative = (token, date, baseDate, options) => {
  const format = formatRelativeLocale[token];

  if (typeof format === "function") {
    return format(date, baseDate, options);
  }

  return format;
};
