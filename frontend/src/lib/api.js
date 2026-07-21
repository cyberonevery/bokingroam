const API_URL = "http://localhost:3000/api";

async function fetchWithAuth(endpoint, options = {}) {
  const token = localStorage.getItem("token");
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Auto logout on unauthorized
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
    return { success: false, message: "Sesi telah berakhir, silakan login kembali." };
  }

  return response.json();
}

export const api = {
  get: (endpoint) => fetchWithAuth(endpoint, { method: "GET" }),
  post: (endpoint, body) => fetchWithAuth(endpoint, { method: "POST", body: JSON.stringify(body) }),
  put: (endpoint, body) => fetchWithAuth(endpoint, { method: "PUT", body: JSON.stringify(body) }),
  patch: (endpoint, body) => fetchWithAuth(endpoint, { method: "PATCH", body: JSON.stringify(body) }),
  delete: (endpoint) => fetchWithAuth(endpoint, { method: "DELETE" }),
};
