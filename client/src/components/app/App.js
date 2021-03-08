import { CssBaseline } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Auth } from 'aws-amplify';
import { ConfirmProvider } from 'material-ui-confirm';
import React, { useCallback, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { HashRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import api from '../../api';
import Header from './Header';
import Login from './Login';
import Routes from './Routes';
import Sidebar from './Sidebar';

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

const queryClient = new QueryClient();

const App = () => {
  const classes = useStyles();

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
    Auth.signOut().then(() => setAuthData({ authenticated: false }));
  };

  const handleImpersonate = async (userId, impersonate) => {
    const localUser = await api.setImpersonation(userId, impersonate);
    setAuthData(state => {
      return { ...state, ...localUser };
    });
  };

  // Controls for responsive sidebar with toggle in header

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleToggleSidebar = () => setSidebarOpen(!sidebarOpen);

  if (!authData) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <ConfirmProvider
        defaultOptions={{ title: '', confirmationButtonProps: { variant: 'contained' } }}
      >
        <div className={classes.root}>
          <Router>
            <CssBaseline />
            <Header
              authData={authData}
              onImpersonate={handleImpersonate}
              onSignOut={handleSignOut}
              onToggleSidebar={handleToggleSidebar}
            />

            {authData.authenticated && (
              <Sidebar
                admin={authData.isAdmin}
                sidebarOpen={sidebarOpen}
                onToggleSidebar={handleToggleSidebar}
              />
            )}

            <main className={classes.content}>
              {authData.authenticated ? (
                <Routes onImpersonate={handleImpersonate} />
              ) : (
                <Login onSignIn={handleSignIn} />
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
    </QueryClientProvider>
  );
};

export default App;
