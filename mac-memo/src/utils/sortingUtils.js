export function sortByLatestTime(list) {
  return [...list].sort((a, b) => new Date(b.time) - new Date(a.time));
}

export function sortByLatestId(list) {
  return [...list].sort((a, b) => parseInt(a.id) - parseInt(b.id));
}
