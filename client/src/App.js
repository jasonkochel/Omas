import { CssBaseline, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    marginTop: 64,
  },
}));

const Order = () => <div>Place an Order</div>;
const History = () => <div>Order History</div>;
const Admin = () => <div>Admin Section</div>;

const App = ({ authState, authData }) => {
  const classes = useStyles();
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    setAuth(authData);
  }, [authState, authData]);

  return (
    <div className={classes.root}>
      <Router>
        <CssBaseline />
        <Header auth={auth} />
        <Sidebar />
        <main className={classes.content}>
          <Switch>
            <Route path="/order">
              <Order />
            </Route>
            <Route path="/history">
              <History />
            </Route>
            <Route path="/admin">
              <Admin />
            </Route>
            <Route path="*">
              <Typography paragraph>Make a selection on the left</Typography>
            </Route>
          </Switch>
        </main>
      </Router>
    </div>
  );
};

export default App;
