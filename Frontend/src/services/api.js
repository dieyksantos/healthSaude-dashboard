const BACKEND = "https://health-dashboard-4qxq.onrender.com";
const TIMEOUT_MS = 12000;

async function fetchWithTimeout(url, options = {}, timeoutMs = TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

async function parseJsonOrThrow(res) {
  const text = await res.text();
  if (!res.ok) throw new Error(text || `HTTP ${res.status}`);
  return text ? JSON.parse(text) : null;
}

export async function fetchRecords() {
  console.log("🌐 fetchRecords ->", `${BACKEND}/health/`);
  const res = await fetchWithTimeout(`${BACKEND}/health/`, { method: "GET" });
  return parseJsonOrThrow(res);
}

export async function createRecord(payload) {
  const res = await fetchWithTimeout(`${BACKEND}/health/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseJsonOrThrow(res);
}

export async function updateRecord(id, payload) {
  const res = await fetchWithTimeout(`${BACKEND}/health/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseJsonOrThrow(res);
}

export async function deleteRecord(id) {
  const res = await fetchWithTimeout(`${BACKEND}/health/${id}`, {
    method: "DELETE",
  });
  return parseJsonOrThrow(res);
}