const BASE = ""; // vazio de propósito (proxy do Vite cuida)

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || `Erro HTTP ${res.status}`);
  }

  // Se não tiver body, evita erro
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return res.json();
  return res.text();
}

export function fetchRecords() {
  return request("/health/");
}

export function createRecord(data) {
  return request("/health/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateRecord(id, data) {
  return request(`/health/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteRecord(id) {
  return request(`/health/${id}`, {
    method: "DELETE",
  });
}