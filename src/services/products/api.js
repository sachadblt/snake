const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const API = async (endpoint, { method = 'GET', body, headers = {}, ...options } = {}) => {
  try {
    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      ...options,
    };

    if (body && typeof body === 'object') {
      config.body = JSON.stringify(body);
    } else if (body) {
      config.body = body;
    }

    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      return await response.text();
    }
  } catch (error) {
    console.error("Erreur API:", error);
    throw error;
  }
};
