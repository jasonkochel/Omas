import { Button, makeStyles, Paper } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import clsx from 'clsx';
import React from 'react';
import { useQuery } from 'react-query';
import { useHistory } from 'react-router-dom';
import api from '../../api';
import fns from '../../fns';
import StyledTable from '../shared/StyledTable';

const useStyles = makeStyles(theme => ({
  paddedButton: {
    marginBottom: '15px',
  },
  subTotal: {
    fontSize: '1.0rem',
    marginRight: '15px',
  },
}));

const BatchOrderList = ({ batchId }) => {
  const history = useHistory();
  const classes = useStyles();

  const { isLoading, data } = useQuery(['OrderList', batchId], () => api.getBatchOrders(batchId));

  return (
    !!data && (
      <>
        <Button
          variant="contained"
          color="primary"
          className={clsx(classes.paddedButton, 'print-hidden')}
          startIcon={<ArrowBack />}
          onClick={() => history.goBack()}
        >
          Back
        </Button>

        {data.map((order, i) => (
          <StyledTable
            key={i}
            title={order.user.name || order.user.email}
            isLoading={isLoading}
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
                render: rowData =>
                  fns.formatCurrency(rowData.price * rowData.quantity * rowData.multiplier),
              },
            ]}
            actions={[
              {
                icon: () => (
                  <span>
                    <span className={classes.subTotal}>{`(${fns.formatCurrency(
                      order.subTotal
                    )} + Tax + Shipping)`}</span>
                    {fns.formatCurrency(order.subTotal + order.tax + order.shipping)}
                  </span>
                ),
                isFreeAction: true,
                onClick: fns.noop,
              },
            ]}
            components={{
              Container: props => <Paper elevation={2} className="print-half-page" {...props} />,
            }}
          />
        ))}
      </>
    )
  );
};

export default BatchOrderList;
