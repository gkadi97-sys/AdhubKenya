// API base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Auth helpers
export const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('adhub_token');
};

export const getUser = () => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('adhub_user');
  return user ? JSON.parse(user) : null;
};

export const setAuth = (token, user) => {
  localStorage.setItem('adhub_token', token);
  localStorage.setItem('adhub_user', JSON.stringify(user));
};

export const clearAuth = () => {
  localStorage.removeItem('adhub_token');
  localStorage.removeItem('adhub_user');
};

// Generic fetch wrapper
const apiFetch = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = { ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'API Error');
  return data;
};

// Auth & Verification API
export const register = (body) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(body) });
export const login = (body) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(body) });
export const getMe = () => apiFetch('/auth/me');
export const verifyPhone = (phoneCode) => apiFetch('/auth/verify-phone', { method: 'POST', body: JSON.stringify({ code: phoneCode }) });
export const verifyEmail = (emailCode) => apiFetch('/auth/verify-email', { method: 'POST', body: JSON.stringify({ code: emailCode }) });
export const submitBusinessVerification = (data) => apiFetch('/auth/verify-business', { method: 'POST', body: JSON.stringify(data) });

// Listings API
export const getListings = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return apiFetch(`/listings?${qs}`);
};
export const getFeaturedListings = () => apiFetch('/listings/featured');
export const getListing = (id) => apiFetch(`/listings/${id}`);
export const getSellerListings = (sellerId) => apiFetch(`/listings/seller/${sellerId}`);
export const createListing = (formData) => apiFetch('/listings', { method: 'POST', body: formData });
export const updateListing = (id, formData) => apiFetch(`/listings/${id}`, { method: 'PUT', body: formData });
export const deleteListing = (id) => apiFetch(`/listings/${id}`, { method: 'DELETE' });

// Categories API
export const getCategories = () => apiFetch('/categories');

// Retention & Analytics API (Phase 1)
export const saveSearch = (query, filters, isAlertEnabled) => apiFetch('/saved-searches', { method: 'POST', body: JSON.stringify({ query, filters, isAlertEnabled }) });
export const getSavedSearches = () => apiFetch('/saved-searches');
export const logListingEvent = (listingId, eventType) => apiFetch('/analytics/events', { method: 'POST', body: JSON.stringify({ listingId, eventType }) });
export const getListingAnalytics = (listingId) => apiFetch(`/analytics/listings/${listingId}`);

// Image URL helper
export const imageUrl = (path) => {
  if (!path) return '/placeholder.jpg';
  if (path.startsWith('http')) return path;
  return `http://localhost:5000${path}`;
};

// Format price in KES
export const formatPrice = (price) => {
  if (price === 0) return 'Free';
  return `KES ${Number(price).toLocaleString('en-KE')}`;
};

// Time ago
export const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });
};
