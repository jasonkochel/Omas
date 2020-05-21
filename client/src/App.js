import { CssBaseline, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Auth } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from './api/api';
import CatalogItems from './components/CatalogItems';
import Categories from './components/Categories';
import Header from './components/Header';
import Order from './components/Order';
import OrderHistory from './components/OrderHistory';
import Sidebar from './components/Sidebar';

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

const Admin = () => <div>Admin Section</div>;

const App = ({ authState }) => {
  const classes = useStyles();
  const [authData, setAuthData] = useState();

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(user => user.signInUserSession.idToken)
      .then(idToken => api.createUser(idToken))
      .then(idToken => setAuthData(idToken));
  }, [authState]);

  return (
    <div className={classes.root}>
      <Router>
        <CssBaseline />
        <Header authData={authData} />
        <Sidebar />
        <main className={classes.content}>
          <Switch>
            <Route path="/order">
              <Order />
            </Route>
            <Route path="/history">
              <OrderHistory />
            </Route>
            <Route path="/admin">
              <Admin />
            </Route>
            <Route path="/catalog">
              <CatalogItems />
            </Route>
            <Route path="/categories">
              <Categories />
            </Route>
            <Route path="*">
              <Typography paragraph>Make a selection on the left</Typography>
            </Route>
          </Switch>
        </main>
      </Router>
      <ToastContainer
        position="bottom-right"
        newestOnTop
        autoClose={false}
        toastClassName={classes.toast}
        draggable={false}
        closeButton={false}
      />
    </div>
  );
};

export default App;
