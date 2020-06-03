import { Chip } from '@material-ui/core';
import { format, parseISO } from 'date-fns';
import MaterialTable from 'material-table';
import React from 'react';

const BatchHistory = ({ loading, data, selectedId, onSelect }) => (
  <MaterialTable
    title="Last 10 Order Cycles"
    isLoading={loading}
    data={data}
    columns={[
      {
        title: 'Order Date',
        field: 'orderDate',
        render: rowData => format(parseISO(rowData.orderDate), 'P'),
      },
      {
        title: 'Delivery Date',
        field: 'deliveryDate',
        render: rowData => format(parseISO(rowData.deliveryDate), 'P'),
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
    onRowClick={(_, data) => onSelect(data)}
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
