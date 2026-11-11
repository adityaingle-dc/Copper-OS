
const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const TOKEN_KEY = "copper_os_token";

// Store the JWT for the current browser session.
export const saveToken = (token) => {
  sessionStorage.setItem(TOKEN_KEY, token);
};

// Retrieve the stored JWT.
export const getToken = () => {
  return sessionStorage.getItem(TOKEN_KEY);
};

// Remove the JWT during logout.
export const removeToken = () => {
  sessionStorage.removeItem(TOKEN_KEY);
};

// Common authenticated API request.
const request = async (path, options = {}) => {
  const token = getToken();

  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      payload.message || `Request failed (${response.status})`
    );

    error.status = response.status;
    error.details = payload.details;

    throw error;
  }

  return payload;
};

export const authApi = {
  // Login with email and password.
  login: async (email, password) => {
    const result = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (result.token) {
      saveToken(result.token);
    }

    return result;
  },

  // Get the currently authenticated user.
  me: () => request("/auth/me"),

  // Clear the local session.
  logout: () => {
    removeToken();
  },

  // Check whether a token exists.
  isAuthenticated: () => Boolean(getToken()),
};

export default authApi;
