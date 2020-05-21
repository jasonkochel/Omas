import { Grid, Typography } from '@material-ui/core';
import { format, parseISO } from 'date-fns';
import MaterialTable from 'material-table';
import React, { useEffect, useState } from 'react';
import api from '../api/api';

const OrderHistory = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState();
  const [detailLoading, setDetailLoading] = useState(false);

  const handleHistoryRowClick = (_, rowData) => {
    setDetailLoading(true);
    api
      .getOrder(rowData.batchId)
      .then(data => setSelectedOrder({ ...rowData, lineItems: data }))
      .catch(() => setSelectedOrder(null))
      .finally(() => setDetailLoading(false));
  };

  useEffect(() => {
    api
      .getOrderHistory()
      // 10 most recent, by date
      .then(data => data.sort((a, b) => (a.deliveryDate < b.deliveryDate ? 1 : -1)).slice(0, 10))
      .then(data => {
        setTableData(data);
        // pseudo-click the first row to auto-show detail of most recent order
        handleHistoryRowClick(null, data[0]);
      })
      .catch(() => setTableData([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={2}>
        <MaterialTable
          title="Last 10 Orders"
          isLoading={loading}
          data={tableData}
          onRowClick={handleHistoryRowClick}
          columns={[
            {
              title: 'Delivery Date',
              field: 'deliveryDate',
              render: rowData => format(parseISO(rowData.deliveryDate), 'P'),
            },
            {
              title: 'Order Total',
              field: 'total',
              type: 'currency',
              headerStyle: {
                textAlign: 'right',
              },
            },
          ]}
          options={{
            paging: false,
            search: false,
            sorting: false,
          }}
        />
      </Grid>
      <Grid item xs={10}>
        {selectedOrder ? (
          <MaterialTable
            title={`Your Order from ${format(parseISO(selectedOrder.deliveryDate), 'PP')}`}
            isLoading={detailLoading}
            data={selectedOrder.lineItems}
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
                render: rowData => '$' + (rowData.price * rowData.quantity).toFixed(2),
              },
            ]}
            options={{
              paging: false,
              search: false,
              sorting: false,
            }}
          />
        ) : (
          <Typography variant="body1">Click an order on the left to see the details</Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default OrderHistory;
