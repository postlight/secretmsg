export function formatDate(timestamp: number): string {
  const d = new Date(timestamp);
  return d.toLocaleString("en-gb", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

export function formatExpiration(timestamp: number): string {
  if (timestamp === 0) return "Never expires";
  const secDiff = (timestamp - Date.now()) / 1000;
  if (secDiff < 7200) {
    return `${Math.round(secDiff / 60)} minutes until message expires`;
  } else if (secDiff / 3600 < 48) {
    return `${Math.round(secDiff / 3600)} hours until message expires`;
  }
  return `${Math.round(secDiff / 86400)} days until message expires`;
}
