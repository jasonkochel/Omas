import axios from './axiosConfig';

const catalogQueryType = {
  BASE: 'Base',
  CURRENT: 'Current',
};

const getCategories = async () => {
  return axios.get('/categories').then(res => res.data);
};

const getCatalog = async queryType => {
  return axios.get(`/catalog?queryType=${queryType}`).then(res => res.data);
};

const addCategory = async category => {
  console.log('add category', category);
};

const updateCategory = async category => {
  console.log('update category', category);
};

const deleteCategory = async categoryId => {
  return axios.delete(`/categories/${categoryId}`);
};

export default {
  addCategory,
  catalogQueryType,
  deleteCategory,
  getCatalog,
  getCategories,
  updateCategory,
};
