import { Button, Grid, makeStyles } from '@material-ui/core';
import React from 'react';
import { useQuery } from 'react-query';
import { useHistory } from 'react-router-dom';
import api from '../../api';
import fns from '../../fns';
import StyledTable from '../shared/StyledTable';
import OrderTotals from './OrderTotals';

const useStyles = makeStyles(theme => ({
  rightAlign: {
    textAlign: 'right',
  },
  rightMargin: {
    marginRight: '1em',
  },
  totalTable: {
    width: 'fit-content',
    position: 'relative',
    float: 'right',
  },
  totalHeaderCol: {
    backgroundColor: theme.palette.grey['200'],
    fontWeight: 'bold',
  },
}));

const OrderView = ({ batchId }) => {
  const classes = useStyles();
  const history = useHistory();

  const { isLoading, data: order } = useQuery(['OrderHistory', batchId], api.getOrder);

  const handleReOrder = () => {
    api.cloneOrder(batchId).then(() => history.push('/order'));
  };

  if (isLoading) return null;

  const { isOpen, deliveryDate } = order?.orderBatch ?? {};

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <StyledTable
          title={
            isOpen
              ? `Your Current Order (Delivery on ${fns.formatDate(deliveryDate, 'PPP')})`
              : `Your Order from ${fns.formatDate(deliveryDate, 'PPP')}`
          }
          loading={isLoading}
          data={order.lineItems}
          columns={[
            { title: 'SKU', field: 'sku', width: '15%' },
            { title: 'Name', field: 'name', width: '40%' },
            {
              title: 'Unit Price',
              field: 'price',
              type: 'currency',
              width: '15%',
              headerStyle: {
                textAlign: 'right',
              },
            },
            {
              title: 'Quantity',
              field: 'quantity',
              type: 'numeric',
              width: '15%',
            },
            {
              title: 'Extended Price',
              type: 'numeric',
              width: '15%',
              render: rowData => fns.formatCurrency(rowData.price * rowData.quantity),
            },
          ]}
        />
      </Grid>
      <Grid item xs={6}>
        {isOpen ? (
          <Button variant="contained" color="primary" onClick={() => history.push('/order')}>
            Modify Order
          </Button>
        ) : (
          <Button variant="contained" color="primary" onClick={handleReOrder}>
            Re-Order These Items
          </Button>
        )}
      </Grid>
      <Grid item xs={6} className={classes.rightAlign}>
        <OrderTotals order={order} />
      </Grid>
    </Grid>
  );
};

export default OrderView;
