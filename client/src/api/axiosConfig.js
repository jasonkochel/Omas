import { Auth } from 'aws-amplify';
import axios from 'axios';
import { toast } from 'react-toastify';

const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

// This allows Amplify to handle refresh tokens
// (from https://github.com/aws-amplify/amplify-js/issues/446#issuecomment-389384338)
instance.interceptors.request.use(config =>
  Auth.currentSession()
    .then(session => {
      //console.log(session);
      config.headers.Authorization = 'Bearer ' + session.idToken.jwtToken;
      return Promise.resolve(config);
    })
    .catch(error => {
      return Promise.reject(error);
    })
);

instance.interceptors.response.use(
  // Any 2xx
  response => response,
  // Any non-2xx
  error => {
    const data = error.response.data;
    const message = data?.title ?? 'Unknown Error'; // TODO: for model validation errors, loop over "errors" property to display details

    toast.error(message);
    return Promise.reject({ ...error });
  }
);

export default instance;
