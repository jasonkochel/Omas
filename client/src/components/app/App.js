import { CssBaseline, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Auth } from 'aws-amplify';
import { ConfirmProvider } from 'material-ui-confirm';
import React, { useEffect, useState } from 'react';
import { ReactQueryDevtools } from 'react-query-devtools';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../api';
import BatchAdmin from '../batches/BatchAdmin';
import BatchOrderList from '../batches/BatchOrderList';
import ConsolidatedOrder from '../batches/ConsolidatedOrder';
import ImpersonationList from '../batches/ImpersonationList';
import CatalogItems from '../catalog/CatalogItems';
import Categories from '../categories/Categories';
import Order from '../orders/Order';
import OrderHistory from '../orders/OrderHistory';
import OrderView from '../orders/OrderView';
import Header from './Header';
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

const App = ({ authState }) => {
  const classes = useStyles();
  const [authData, setAuthData] = useState();

  useEffect(() => {
    const buildAuthData = async () => {
      const user = await Auth.currentAuthenticatedUser();
      const idToken = user.signInUserSession.idToken;
      await api.createUser(idToken);
      const localUser = await api.getUser(idToken.payload.sub);
      setAuthData({ ...idToken, ...localUser });
    };

    buildAuthData();
  }, [authState]);

  const handleImpersonate = async (userId, impersonate) => {
    const localUser = await api.setImpersonation(userId, impersonate);
    setAuthData(state => {
      return { ...state, ...localUser };
    });
  };

  return (
    <ConfirmProvider defaultOptions={{ title: '' }}>
      <div className={classes.root}>
        <Router>
          <CssBaseline />
          <Header authData={authData} onImpersonate={handleImpersonate} />
          <Sidebar admin={authData?.isAdmin ?? false} />
          <main className={classes.content}>
            <Switch>
              <Route exact path="/order">
                <Order />
              </Route>
              <Route
                path="/order/:batchId"
                render={props => <OrderView batchId={props.match.params.batchId} />}
              />
              <Route path="/history">
                <OrderHistory />
              </Route>
              <Route exact path="/batches">
                <BatchAdmin />
              </Route>
              <Route
                path="/batches/:batchId/orders"
                render={props => <BatchOrderList batchId={props.match.params.batchId} />}
              />
              <Route
                path="/batches/:batchId/consolidated"
                render={props => <ConsolidatedOrder batchId={props.match.params.batchId} />}
              />
              <Route path="/impersonate">
                <ImpersonationList onImpersonate={handleImpersonate} />
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
