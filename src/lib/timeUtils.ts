/**
 * Time formatting utility for 12-hour AM/PM presentation
 */

export function formatTimeWithAmPm(timeStr?: string): string {
  if (!timeStr) return "--:--";

  const raw = timeStr.trim();

  // Check for next day indicator like (+1)
  const isNextDay = raw.includes("(+1)") || raw.includes("+1");
  const cleanTime = raw.replace(/\(\+1\)/g, "").replace(/\+1/g, "").trim();

  // If already contains AM or PM
  if (/am|pm/i.test(cleanTime)) {
    return isNextDay ? `${cleanTime} (+1)` : cleanTime;
  }

  // If HH:MM or H:MM format
  const match = cleanTime.match(/^(\d{1,2}):(\d{2})/);
  if (match) {
    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const hoursFormatted = String(hours).padStart(2, "0");
    const result = `${hoursFormatted}:${minutes} ${period}`;
    return isNextDay ? `${result} (+1)` : result;
  }

  // If ISO 8601 string like "2026-10-29T14:05:00+00:00"
  try {
    const d = new Date(raw);
    if (!isNaN(d.getTime())) {
      let hours = d.getUTCHours();
      const minutes = String(d.getUTCMinutes()).padStart(2, "0");
      const period = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      const hoursFormatted = String(hours).padStart(2, "0");
      const result = `${hoursFormatted}:${minutes} ${period}`;
      return isNextDay ? `${result} (+1)` : result;
    }
  } catch {
    // fallback to original string
  }

  return raw;
}
