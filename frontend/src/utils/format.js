/**
 * Truncate a long string (address, hash, tx) for display.
 * @param {string} str
 * @param {number} start  chars to keep at front
 * @param {number} end    chars to keep at back
 */
export function truncate(str, start = 10, end = 6) {
  if (!str) return "";
  if (str.length <= start + end + 3) return str;
  return `${str.slice(0, start)}…${str.slice(-end)}`;
}

/**
 * Convert a Unix timestamp (seconds) to a human-readable local date/time.
 * @param {number|bigint} unixSeconds
 */
export function formatTimestamp(unixSeconds) {
  return new Date(Number(unixSeconds) * 1000).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}