const API_BASE = 'http://localhost:5500/api/v1';

// Helper function for API requests
const apiRequest = async (endpoint, method = 'GET', data = null, token = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || 'Something went wrong');
  }

  return responseData;
};

// Auth functions
export const register = async (userData) => {
  return await apiRequest('/auth/register', 'POST', userData);
};

export const login = async (credentials) => {
  return await apiRequest('/auth/login', 'POST', credentials);
};

export const getMe = async (token) => {
  return await apiRequest('/auth/me', 'GET', null, token);
};

// Product functions
export const fetchProducts = async (query = '') => {
  return await apiRequest(`/products${query}`);
};

export const fetchProduct = async (id) => {
  return await apiRequest(`/products/${id}`);
};

// Cart functions
export const getCart = async (token) => {
  return await apiRequest('/cart', 'GET', null, token);
};

export const addToCart = async (productData, token) => {
  return await apiRequest('/cart', 'POST', productData, token);
};

export const updateCartItem = async (itemId, quantity, token) => {
  return await apiRequest(`/cart/${itemId}`, 'PUT', { quantity }, token);
};

export const removeCartItem = async (itemId, token) => {
  return await apiRequest(`/cart/${itemId}`, 'DELETE', null, token);
};

export const clearCart = async (token) => {
  return await apiRequest('/cart', 'DELETE', null, token);
};

// Order functions
export const createOrder = async (orderData, token) => {
  return await apiRequest('/orders', 'POST', orderData, token);
};

export const getOrder = async (orderId, token) => {
  return await apiRequest(`/orders/${orderId}`, 'GET', null, token);
};

export const getMyOrders = async (token) => {
  return await apiRequest('/orders/myorders', 'GET', null, token);
};