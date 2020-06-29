import axios from './axiosConfig';

// the "body" of this post is just the JWT which Axios puts in the Auth header,
// but which the caller expects to be returned by the promise
const createUser = async idToken => axios.post('/users').then(() => idToken);

// CATEGORIES

const getCategories = async (includeItems = false) =>
  axios.get(`/categories?includeItems=${includeItems}`).then(res => res.data);

const getItemsByCategoryId = async categoryId => {
  const qs = categoryId ? `?categoryId=${categoryId}` : '';
  return axios.get('/catalog' + qs).then(res => res.data);
};

const addCategory = async category => axios.post('/categories', category).then(res => res.data);

const updateCategory = async category =>
  axios.put(`/categories/${category.categoryId}`, category).then(res => res.data);

const deleteCategory = async id => axios.delete(`/categories/${id}`);

const moveCategoryUp = async id => axios.patch(`/categories/${id}/up`);

const moveCategoryDown = async id => axios.patch(`/categories/${id}/down`);

// ITEMS

const addItem = async (categoryId, item) => {
  const data = { categoryId, ...item };
  return axios.post('/catalog', data).then(res => res.data);
};

const updateItem = async item =>
  axios.put(`/catalog/${item.catalogId}`, item).then(res => res.data);

const deleteItem = async id => axios.delete(`/catalog/${id}`);

const moveItemUp = async id => axios.patch(`/catalog/${id}/up`);

const moveItemDown = async id => axios.patch(`/catalog/${id}/down`);

// ORDERS

const getCurrentOrder = () => axios.get('/orders/current').then(res => res.data);

const getOrderHistory = () => axios.get('/orders').then(res => res.data);

const getOrder = batchId => axios.get(`/orders/${batchId}`).then(res => res.data);

const updateOrder = (catalogId, quantity) =>
  axios.put(`/orders?catalogId=${catalogId}&quantity=${quantity}`).then(res => res.data);

// BATCHES

const getBatches = () => axios.get('/orderBatches').then(res => res.data);

const getBatch = id => axios.get(`/orderBatches/${id}`).then(res => res.data);

const updateBatch = async data =>
  axios.put(`/orderBatches/${data.batchId}`, data).then(res => res.data);

export default {
  addCategory,
  addItem,
  createUser,
  deleteCategory,
  deleteItem,
  getBatch,
  getBatches,
  getCategories,
  getCurrentOrder,
  getItemsByCategoryId,
  getOrder,
  getOrderHistory,
  moveCategoryDown,
  moveCategoryUp,
  moveItemDown,
  moveItemUp,
  updateBatch,
  updateCategory,
  updateItem,
  updateOrder,
};
