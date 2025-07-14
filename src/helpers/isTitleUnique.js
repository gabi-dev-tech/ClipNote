export function isTitleUnique(title, data) {
  if (!title) return true;
  if (!Array.isArray(data)) return true;
  const normalizedTitle = title.trim().toLowerCase();

  return !data.some((note) => {
    const noteTitle = note.Titulo ? String(note.Titulo).trim().toLowerCase() : "";
    return noteTitle === normalizedTitle ? true : false;
  });
}
