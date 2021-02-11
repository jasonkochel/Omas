import { Grid } from '@material-ui/core';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import api from '../../api';
import fns from '../../fns';
import StyledTable from '../shared/StyledTable';
import OrderView from './OrderView';

const OrderHistory = () => {
  const [selectedBatchId, setSelectedBatchId] = useState();

  const getOrderHistory = async () => {
    const data = await api.getOrderHistory();
    return fns.sortArray(data, 'deliveryDate', fns.sortDir.DESC).slice(0, 10);
  };

  const { isLoading, data: orderHistoryData } = useQuery('OrderHistory', getOrderHistory);

  if (selectedBatchId == null && !isLoading && orderHistoryData && orderHistoryData.length > 0) {
    setSelectedBatchId(orderHistoryData[0].batchId);
  }

  return (
    <Grid container spacing={3} direction="row-reverse">
      <Grid item xs={12} md={9}>
        {selectedBatchId && <OrderView batchId={selectedBatchId} />}
      </Grid>
      <Grid item xs={12} md={3}>
        <StyledTable
          title="Last 10 Orders"
          isLoading={isLoading}
          data={orderHistoryData}
          onRowClick={(_, rowData) => setSelectedBatchId(rowData.batchId)}
          columns={[
            {
              title: 'Date',
              field: 'deliveryDate',
              render: rowData => fns.formatDate(rowData.deliveryDate),
            },
            {
              title: 'Total',
              field: 'total',
              type: 'currency',
              headerStyle: {
                textAlign: 'right',
              },
            },
          ]}
          options={{
            sorting: false,
            rowStyle: data => ({
              backgroundColor:
                selectedBatchId && data.batchId === selectedBatchId ? 'aliceblue' : 'white',
            }),
          }}
        />
      </Grid>
    </Grid>
  );
};

export default OrderHistory;
