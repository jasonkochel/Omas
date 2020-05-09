import axios from './axiosConfig';

const getCategories = async () => {
  return axios.get('/categories').then((res) => res.data);
};

export default { getCategories };
