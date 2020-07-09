import '@aws-amplify/ui/dist/style.css';
import Amplify from 'aws-amplify';
import React from 'react';
import ReactDOM from 'react-dom';
import awsconfig from './aws-exports';
import AuthenticatedApp from './components/app/AuthenticatedApp';
import './index.css';

Amplify.configure(awsconfig);

ReactDOM.render(<AuthenticatedApp />, document.getElementById('root'));
