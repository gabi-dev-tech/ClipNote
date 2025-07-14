export function isTitleUnique(title, data) {
  if (!title) return false;
  if (!Array.isArray(data)) return false;
  const normalizedTitle = title.trim().toLowerCase();
  return data.some((note) => {
    const noteTitle = note[1] ? String(note[1]).trim().toLowerCase() : "";
    return noteTitle === normalizedTitle;
  });
}
