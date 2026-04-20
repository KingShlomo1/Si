export function load(key, fallback = []) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}

export function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadObj(key, fallback = {}) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}
