import '@aws-amplify/ui/dist/style.css';
import Amplify from 'aws-amplify';
import React from 'react';
import ReactDOM from 'react-dom';
import AuthenticatedApp from './AuthenticatedApp';
import awsconfig from './aws-exports';
import './index.css';
import * as serviceWorker from './serviceWorker';

Amplify.configure(awsconfig);

ReactDOM.render(
  <React.StrictMode>
    <AuthenticatedApp />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
