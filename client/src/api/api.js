import axios from './axiosConfig';

// the "body" of this post is just the JWT which Axios puts in the Auth header,
// but which the caller expects to be returned by the promise
const createUser = async idToken => axios.post('/users').then(() => idToken);

const getCategories = async () => axios.get('/categories').then(res => res.data);

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

const addItem = data => {
  console.log('addItem API', data);
  return Promise.resolve(data);
};
const updateItem = data => {
  console.log('updateItem API', data);
  return Promise.resolve(data);
};
const deleteItem = data => {
  console.log('deleteItem API', data);
  return Promise.resolve(data);
};
const moveItemUp = data => {
  return Promise.resolve(data);
};
const moveItemDown = data => {
  return Promise.resolve(data);
};

const getOrderHistory = () => axios.get('/orders').then(res => res.data);

const getOrder = batchId => axios.get(`/orders/${batchId}`).then(res => res.data);

const getBatches = () => axios.get('/orderBatches').then(res => res.data);

export default {
  addCategory,
  addItem,
  createUser,
  deleteCategory,
  deleteItem,
  getBatches,
  getCategories,
  getItemsByCategoryId,
  getOrder,
  getOrderHistory,
  moveCategoryDown,
  moveCategoryUp,
  moveItemDown,
  moveItemUp,
  updateCategory,
  updateItem,
};
