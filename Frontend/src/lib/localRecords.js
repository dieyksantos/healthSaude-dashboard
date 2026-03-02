// src/lib/localRecords.js
const KEY = "health_records_v1";

export function loadRecords() {
  try {
    const raw = localStorage.getItem(KEY);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function saveRecords(records) {
  localStorage.setItem(KEY, JSON.stringify(records));
}

export function addRecord(record) {
  const records = loadRecords();
  records.push(record);
  saveRecords(records);
  return record;
}

export function updateRecord(id, patch) {
  const records = loadRecords().map((r) => (r.id === id ? { ...r, ...patch } : r));
  saveRecords(records);
  return records.find((r) => r.id === id) || null;
}

export function deleteRecord(id) {
  const records = loadRecords().filter((r) => r.id !== id);
  saveRecords(records);
  return true;
}
 