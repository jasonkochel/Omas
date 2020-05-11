import axios from './axiosConfig';

const catalogQueryType = {
  BASE: 'Base',
  CURRENT: 'Current',
};

const getCategories = async () => axios.get('/categories').then(res => res.data);

const getCatalog = async queryType =>
  axios.get(`/catalog?queryType=${queryType}`).then(res => res.data);

const addCategory = async category => axios.post('/categories', category).then(res => res.data);

const updateCategory = async category =>
  axios.put(`/categories/${category.categoryId}`, category).then(res => res.data);

const deleteCategory = async id => axios.delete(`/categories/${id}`);

const moveCategoryUp = async id => axios.patch(`/categories/${id}/up`);

const moveCategoryDown = async id => axios.patch(`/categories/${id}/down`);

export default {
  addCategory,
  catalogQueryType,
  deleteCategory,
  getCatalog,
  getCategories,
  moveCategoryDown,
  moveCategoryUp,
  updateCategory,
};
