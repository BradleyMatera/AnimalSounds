const STORAGE_KEY = "animal-sounds-analytics-v1";
const MAX_EVENTS = 750;

function safeWindow() {
  return typeof window !== "undefined" ? window : undefined;
}

export function loadEvents() {
  try {
    const store = safeWindow();
    if (!store) return [];

    const raw = store.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (error) {
    console.warn("[analytics] Failed to load events", error);
    return [];
  }
}

export function saveEvents(events) {
  try {
    const store = safeWindow();
    if (!store) return;

    store.localStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(-MAX_EVENTS)));
  } catch (error) {
    console.warn("[analytics] Failed to save events", error);
  }
}

export function recordEvent(name, data = {}) {
  const timestamp = Date.now();
  const events = loadEvents();
  events.push({ name, data, timestamp });
  saveEvents(events);
  return events;
}

export function summarize(events) {
  if (!events.length) {
    return {
      totalSessions: 0,
      totalInteractions: 0,
      favoriteCount: 0,
      lastPlayed: null
    };
  }

  const totals = events.reduce(
    (acc, event) => {
      if (event.name === "session_start") {
        acc.totalSessions += 1;
      }
      if (event.name === "sound_played") {
        acc.totalInteractions += 1;
        acc.lastPlayed = event.data?.animal ?? acc.lastPlayed;
      }
      if (event.name === "favorite_toggled" && event.data?.isFavorite) {
        acc.favoriteCount += 1;
      }
      if (event.name === "favorite_toggled" && event.data?.isFavorite === false) {
        acc.favoriteCount = Math.max(acc.favoriteCount - 1, 0);
      }
      return acc;
    },
    {
      totalSessions: 0,
      totalInteractions: 0,
      favoriteCount: 0,
      lastPlayed: null
    }
  );

  return totals;
}
