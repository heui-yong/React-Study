export function sortByLatestTime(list) {
  return [...list].sort((a, b) => new Date(b.time) - new Date(a.time));
}
