import React from 'react';
import { Route, Switch } from 'react-router-dom';
import BatchAdmin from '../batches/BatchAdmin';
import BatchOrderList from '../batches/BatchOrderList';
import ConsolidatedOrder from '../batches/ConsolidatedOrder';
import ImpersonationList from '../batches/ImpersonationList';
import CatalogItems from '../catalog/CatalogItems';
import Categories from '../categories/Categories';
import Order from '../orders/Order';
import OrderHistory from '../orders/OrderHistory';
import OrderView from '../orders/OrderView';
import Settings from '../settings/Settings';
import Welcome from './Welcome';

const Routes = ({ onImpersonate }) => (
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
      <ImpersonationList onImpersonate={onImpersonate} />
    </Route>
    <Route path="/catalog">
      <CatalogItems />
    </Route>
    <Route path="/categories">
      <Categories />
    </Route>
    <Route path="/settings">
      <Settings />
    </Route>
    <Route path="*">
      <Welcome />
    </Route>
  </Switch>
);

export default Routes;
