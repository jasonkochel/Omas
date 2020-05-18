import axios from './axiosConfig';

const getCategories = async () => axios.get('/categories').then(res => res.data);

const getCatalog = async categoryId => {
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

export default {
  addCategory,
  addItem,
  deleteCategory,
  deleteItem,
  getCatalog,
  getCategories,
  moveCategoryDown,
  moveCategoryUp,
  moveItemDown,
  moveItemUp,
  updateCategory,
  updateItem,
};
