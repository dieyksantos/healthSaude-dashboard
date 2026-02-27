const BACKEND = "https://health-dashboard-4qxq.onrender.com";
const TIMEOUT_MS = 15000;

async function fetchWithTimeout(url, options = {}, timeoutMs = TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function parseJsonOrText(res) {
  const text = await res.text();
  if (!res.ok) throw new Error(text || `HTTP ${res.status}`);
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function fetchRecords() {
  const res = await fetchWithTimeout(`${BACKEND}/health/`, { method: "GET" });
  return parseJsonOrText(res);
}

export async function createRecord(payload) {
  const res = await fetchWithTimeout(`${BACKEND}/health/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseJsonOrText(res);
}

export async function updateRecord(id, payload) {
  const res = await fetchWithTimeout(`${BACKEND}/health/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseJsonOrText(res);
}

export async function deleteRecord(id) {
  const res = await fetchWithTimeout(`${BACKEND}/health/${id}`, {
    method: "DELETE",
  });
  return parseJsonOrText(res);
}