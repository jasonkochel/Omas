import { Auth } from 'aws-amplify';
import axios from 'axios';
import { toast } from 'react-toastify';

const client = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

// This allows Amplify to handle refresh tokens
// (from https://github.com/aws-amplify/amplify-js/issues/446#issuecomment-389384338)
client.interceptors.request.use(config =>
  Auth.currentSession()
    .then(session => {
      //console.time(`ajax: ${config.method} ${config.baseURL}${config.url}`);
      config.headers.Authorization = 'Bearer ' + session.idToken.jwtToken;
      return Promise.resolve(config);
    })
    .catch(error => {
      return Promise.reject(error);
    })
);

client.interceptors.response.use(
  // Any 2xx
  response => {
    //console.timeEnd(`ajax: ${response.config.method} ${response.config.url}`);
    return response;
  },
  // Any non-2xx
  error => {
    const data = error.response?.data;
    const message = data?.title ?? 'Unknown Error'; // TODO: for model validation errors, loop over "errors" property to display details

    toast.error(message);
    return Promise.reject({ ...error });
  }
);

// IDENTITIES

const getUsers = () => client.get('/users').then(res => res.data);

const getUser = id => client.get(`/users/${id}`).then(res => res.data);

// the "body" of this post is just the JWT which Axios puts in the Auth header,
// but which the caller expects to be returned by the promise
const createUser = idToken => client.post('/users').then(() => idToken);

const setImpersonation = (userId, impersonate) =>
  client
    .post(`/users/admin/impersonation?userId=${userId || ''}&impersonate=${impersonate}`)
    .then(res => res.data);

// CATEGORIES

const getCategories = (queryKey, includeItems = false, includeVirtual = false) =>
  client
    .get(`/categories?includeItems=${includeItems}&includeVirtual=${includeVirtual}`)
    .then(res => res.data);

const getItemsByCategoryId = categoryId => {
  const qs = categoryId ? `?categoryId=${categoryId}` : '';
  return client.get('/catalog' + qs).then(res => res.data);
};

const addCategory = category => client.post('/categories', category).then(res => res.data);

const updateCategory = category =>
  client.put(`/categories/${category.categoryId}`, category).then(res => res.data);

const deleteCategory = id => client.delete(`/categories/${id}`);

const moveCategoryUp = id => client.patch(`/categories/${id}/up`);

const moveCategoryDown = id => client.patch(`/categories/${id}/down`);

// ITEMS

const addItem = (categoryId, item) => {
  const data = { categoryId, ...item };
  return client.post('/catalog', data).then(res => res.data);
};

const updateItem = item => client.put(`/catalog/${item.catalogId}`, item).then(res => res.data);

const deleteItem = id => client.delete(`/catalog/${id}`);

const moveItemUp = id => client.patch(`/catalog/${id}/up`);
const moveItemDown = id => client.patch(`/catalog/${id}/down`);

const markNew = (id, isNew) =>
  client.patch(`/catalog/${id}/new?isNew=${isNew}`).then(res => res.data);

const markFeatured = (id, isFeatured) =>
  client.patch(`/catalog/${id}/featured?isFeatured=${isFeatured}`).then(res => res.data);

const markDiscontinued = (id, isDiscontinued) =>
  client
    .patch(`/catalog/${id}/discontinued?isDiscontinued=${isDiscontinued}`)
    .then(res => res.data);

// ORDERS

const getCurrentOrder = () => client.get('/orders/current').then(res => res.data);

const getOrderHistory = () => client.get('/orders').then(res => res.data);

const getOrder = (queryKey, batchId) => client.get(`/orders/${batchId}`).then(res => res.data);

const updateOrder = (catalogId, quantity) =>
  client.put(`/orders?catalogId=${catalogId}&quantity=${quantity}`);

const confirmOrder = () => client.put('/orders/confirm').then(res => res.data);

const cloneOrder = batchId => client.post(`/orders/${batchId}/clone`);

const emailOrder = batchId => client.post(`/orders/${batchId}/email`);

// BATCHES

const getBatches = () => client.get('/orderBatches').then(res => res.data);

const getBatch = (queryKey, id) => client.get(`/orderBatches/${id}`).then(res => res.data);

const getConsolidatedOrder = (queryKey, id) =>
  client.get(`/orderBatches/${id}/consolidated`).then(res => res.data);

const getBatchOrders = (queryKey, id) =>
  client.get(`/orderBatches/${id}/orders`).then(res => res.data);

const createBatch = data => client.post('/orderBatches', data).then(res => res.data);

const updateBatch = data => client.put(`/orderBatches/${data.batchId}`, data);

const emailBatch = id => client.post(`/orderBatches/${id}/email`);

export default {
  addCategory,
  addItem,
  cloneOrder,
  confirmOrder,
  createBatch,
  createUser,
  deleteCategory,
  deleteItem,
  emailBatch,
  emailOrder,
  getBatch,
  getBatches,
  getBatchOrders,
  getCategories,
  getConsolidatedOrder,
  getCurrentOrder,
  getItemsByCategoryId,
  getOrder,
  getOrderHistory,
  getUser,
  getUsers,
  markNew,
  markFeatured,
  markDiscontinued,
  moveCategoryDown,
  moveCategoryUp,
  moveItemDown,
  moveItemUp,
  setImpersonation,
  updateBatch,
  updateCategory,
  updateItem,
  updateOrder,
};
