const API_BASE_URL = "http://localhost:5000/api";

async function apiRequest(endpoint, method = "GET", data = null) {
  const token = localStorage.getItem("accessToken");

  const options = {
    method,
    headers: {
      "Content-Type": "application/json"
    }
  };

  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Request failed");
  }

  return result;
}