import React, { useEffect, useState } from 'react';
import api from '../../api';
import fns from '../../fns';
import StyledTable from '../shared/StyledTable';

const totalOrder = order => {
  return order.reduce((acc, i) => (acc += i.price * i.quantity), 0);
};

const BatchOrderList = ({ batchId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getBatchOrders(batchId)
      .then(data => setOrders(data))
      .then(() => setLoading(false))
      .catch(() => setOrders([]));
  }, [batchId]);

  return (
    <>
      {orders.map((order, i) => (
        <StyledTable
          key={i}
          title={order.user.name}
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
          actions={[
            {
              icon: props => <span>{fns.formatCurrency(totalOrder(order.lineItems))}</span>,
              isFreeAction: true,
              onClick: fns.noop,
            },
          ]}
        />
      ))}
    </>
  );
};

export default BatchOrderList;
