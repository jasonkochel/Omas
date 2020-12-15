import Authenticator from '@jasonkochel/react-cognito-auth';
import { CssBaseline } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Auth } from 'aws-amplify';
import { ConfirmProvider } from 'material-ui-confirm';
import React, { useCallback, useEffect, useState } from 'react';
import { ReactQueryDevtools } from 'react-query-devtools';
import { HashRouter as Router, useHistory } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import api from '../../api';
import Header from './Header';
import Routes from './Routes';
import Sidebar from './Sidebar';

const signupFields = [
  {
    name: 'name',
    label: 'Name',
    placeholder: 'Enter your full name',
    required: true,
  },
  {
    name: 'phone_number',
    label: 'Phone Number',
    required: true,
  },
];

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    marginTop: 64,
  },
  toast: {
    textAlign: 'center',
  },
}));

const App = () => {
  const classes = useStyles();
  const history = useHistory();

  const [authData, setAuthData] = useState();

  const handleSignIn = useCallback(async cognitoUser => {
    const idToken = cognitoUser?.signInUserSession?.idToken;

    if (idToken) {
      await api.createUser(idToken);
      const localUser = await api.getUser(idToken.payload.sub);
      setAuthData({ authenticated: true, ...idToken, ...localUser });
    }
  }, []);

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(user => handleSignIn(user))
      .catch(() => setAuthData({ authenticated: false }));
  }, [handleSignIn]);

  const handleSignOut = () => {
    Auth.signOut().then(() => {
      setAuthData({ authenticated: false });
      history.push('/');
    });
  };

  const handleImpersonate = async (userId, impersonate) => {
    const localUser = await api.setImpersonation(userId, impersonate);
    setAuthData(state => {
      return { ...state, ...localUser };
    });
  };

  if (!authData) return false;

  return (
    <ConfirmProvider defaultOptions={{ title: '' }}>
      <div className={classes.root}>
        <Router>
          <CssBaseline />
          <Header authData={authData} onImpersonate={handleImpersonate} onSignOut={handleSignOut} />

          {authData.authenticated && <Sidebar admin={authData.isAdmin} />}

          <main className={classes.content}>
            {authData.authenticated ? (
              <Routes onImpersonate={handleImpersonate} />
            ) : (
              <Authenticator
                onSignIn={handleSignIn}
                signupFields={signupFields}
                socialProviders={['Google']}
              />
            )}
          </main>
        </Router>
        <ToastContainer
          position="bottom-right"
          newestOnTop
          toastClassName={classes.toast}
          draggable={false}
          closeButton={false}
        />
        {false && <ReactQueryDevtools />}
      </div>
    </ConfirmProvider>
  );
};

export default App;
