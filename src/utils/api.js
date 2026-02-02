/**
 * API utility - handles auth headers and token storage
 */

const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  get: (url) => fetch(url, { headers: getAuthHeaders() }),
  post: (url, body) =>
    fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    }),
  put: (url, body) =>
    fetch(url, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: (url) => fetch(url, { method: 'DELETE', headers: getAuthHeaders() }),
};

export const saveAuth = (data) => {
  if (data.accessToken) localStorage.setItem('accessToken', data.accessToken);
  if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
  if (data.email) localStorage.setItem('userEmail', data.email);
  if (data.userId) localStorage.setItem('userId', data.userId);
  if (data.username) localStorage.setItem('username', data.username);
  if (data.name) localStorage.setItem('userName', data.name);
  if (data.isAdmin !== undefined) localStorage.setItem('isAdmin', data.isAdmin);
  if (data.role) localStorage.setItem('userRole', data.role);
  localStorage.setItem('user', JSON.stringify(data));
};

export const clearAuth = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
  localStorage.removeItem('userName');
  localStorage.removeItem('user');
  localStorage.removeItem('isAdmin');
  localStorage.removeItem('userRole');
};

export const isAuthenticated = () => !!localStorage.getItem('accessToken') || !!localStorage.getItem('userEmail');
export const isAdmin = () => localStorage.getItem('isAdmin') === 'true';
