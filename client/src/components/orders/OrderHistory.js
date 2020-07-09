import { Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import api from '../../api';
import fns from '../../fns';
import StyledTable from '../shared/StyledTable';
import OrderView from './OrderView';

const OrderHistory = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBatchId, setSelectedBatchId] = useState();

  const handleHistoryRowClick = (_, rowData) => {
    setSelectedBatchId(rowData.batchId);
  };

  useEffect(() => {
    api
      .getOrderHistory()
      // 10 most recent, by date
      .then(data => data.sort((a, b) => (a.deliveryDate < b.deliveryDate ? 1 : -1)).slice(0, 10))
      .then(data => {
        setTableData(data);
        // pseudo-click the first row to auto-show detail of most recent order
        if (data && data.length > 0) {
          handleHistoryRowClick(null, data[0]);
        }
      })
      .catch(() => setTableData([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={2}>
        <StyledTable
          title="Last 10 Orders"
          isLoading={loading}
          data={tableData}
          onRowClick={handleHistoryRowClick}
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
      <Grid item xs={10}>
        {selectedBatchId && <OrderView batchId={selectedBatchId} />}
      </Grid>
    </Grid>
  );
};

export default OrderHistory;
