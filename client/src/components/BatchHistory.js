import { Chip } from '@material-ui/core';
import MaterialTable from 'material-table';
import React from 'react';
import fns from '../fns';

const BatchHistory = ({ loading, data, selectedId, onSelect }) => (
  <MaterialTable
    title="Last 10 Order Cycles"
    isLoading={loading}
    data={data}
    columns={[
      {
        title: 'Order Date',
        field: 'orderDate',
        render: rowData => fns.formatDate(rowData.orderDate),
      },
      {
        title: 'Delivery Date',
        field: 'deliveryDate',
        render: rowData => fns.formatDate(rowData.deliveryDate),
      },
      {
        title: '',
        field: 'isOpen',
        render: rowData => (
          <Chip
            label={rowData.isOpen ? 'OPEN' : 'CLOSED'}
            color={rowData.isOpen ? 'primary' : 'secondary'}
          />
        ),
      },
    ]}
    onRowClick={(_, data) => onSelect(data.batchId)}
    options={{
      paging: false,
      search: false,
      sorting: false,
      rowStyle: data => ({
        backgroundColor: data.batchId === selectedId ? 'aliceblue' : 'white',
      }),
    }}
  />
);

export default BatchHistory;
