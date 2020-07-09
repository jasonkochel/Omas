import { Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import api from '../../api';
import fns from '../../fns';
import StyledTable from '../shared/StyledTable';

const totalOrder = order => {
  return order.reduce((acc, i) => (acc += i.price * i.quantity), 0);
};

const BatchOrderList = ({ batchId }) => {
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getOrder(batchId)
      .then(data => setOrder({ ...data, total: totalOrder(data.lineItems) }))
      .then(() => setLoading(false))
      .catch(() => setOrder([]));
  }, [batchId]);

  return (
    <>
      <Typography variant="h1">Order List for Batch {batchId}</Typography>
      <StyledTable
        title={`Your Order from ${fns.formatDate(order?.orderBatch?.deliveryDate, 'PPP')}`}
        isLoading={loading}
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
      <Typography variant="h6">Total: {fns.formatCurrency(order.total)}</Typography>
    </>
  );
};

export default BatchOrderList;
