import '@aws-amplify/ui/dist/style.css';
import Amplify from 'aws-amplify';
import React from 'react';
import ReactDOM from 'react-dom';
import AuthenticatedApp from './components/app/AuthenticatedApp';
import './index.css';

const config = {
  aws_project_region: 'us-east-1',
  aws_cognito_region: 'us-east-1',
  aws_user_pools_id: process.env.REACT_APP_COGNITO_USER_POOL_ID,
  aws_user_pools_web_client_id: process.env.REACT_APP_COGNITO_WEB_CLIENT_ID,
  oauth: {
    domain: process.env.REACT_APP_COGNITO_OAUTH_DOMAIN,
    scope: ['phone', 'email', 'openid', 'profile', 'aws.cognito.signin.user.admin'],
    redirectSignIn: process.env.REACT_APP_CLIENT_URL,
    redirectSignOut: process.env.REACT_APP_CLIENT_URL,
    responseType: 'code',
  },
  federationTarget: 'COGNITO_USER_POOLS',
};

Amplify.configure(config);

ReactDOM.render(<AuthenticatedApp />, document.getElementById('root'));
