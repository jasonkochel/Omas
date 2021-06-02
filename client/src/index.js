import '@aws-amplify/ui/dist/style.css';
import Amplify from 'aws-amplify';
import React from 'react';
import ReactDOM from 'react-dom';
import 'react-toastify/dist/ReactToastify.css';
import App from './components/app/App';
import './index.css';

const config = {
  aws_project_region: 'us-east-1',
  aws_cognito_region: 'us-east-1',
  aws_user_pools_id: process.env.REACT_APP_COGNITO_USER_POOL_ID,
  aws_user_pools_web_client_id: process.env.REACT_APP_COGNITO_WEB_CLIENT_ID,
  oauth: {
    domain: process.env.REACT_APP_COGNITO_OAUTH_DOMAIN,
    scope: ['phone', 'email', 'openid', 'profile', 'aws.cognito.signin.user.admin'],
    redirectSignIn: window.location.origin,
    redirectSignOut: window.location.origin,
    responseType: 'code',
  },
  federationTarget: 'COGNITO_USER_POOLS',
};

Amplify.configure(config);

ReactDOM.render(<App />, document.getElementById('root'));
