import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/cart';

const getCartByUserId = async (userId) => {
  await axios.get(`${API_BASE}/${userId}`);
}

const createNewCart = (userId) => axios.post(`${API_BASE}/`, { userId });

const addItemToCart = (data) => axios.post(`${API_BASE}/add-item`, data);

const updateCartItem = (data) =>  axios.put(`${API_BASE}/update-item`, data);

const deleteCartItem = (data) => axios.delete(`${API_BASE}/remove-item`, { data });

const clearCart = (userId) => axios.delete(`${API_BASE}/clear/${userId}`);