import { Button, Chip, Grid, makeStyles } from '@material-ui/core';
import { format, parseISO } from 'date-fns';
import MaterialTable from 'material-table';
import React, { useEffect, useState } from 'react';
import api from '../api/api';

const useStyles = makeStyles(theme => ({
  button: {
    marginRight: '10px',
  },
}));

const BatchHistory = () => {
  const classes = useStyles();

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getBatches()
      // 10 most recent, by date
      .then(data => data.sort((a, b) => (a.deliveryDate < b.deliveryDate ? 1 : -1)).slice(0, 10))
      .then(data => {
        setTableData(data);
      })
      .catch(() => setTableData([]))
      .finally(() => setLoading(false));
  }, []);

  const BatchActions = ({ batchId, isLatest, isOpen }) => (
    <>
      {isLatest && (
        <Button variant="contained" color="primary" className={classes.button}>
          {isOpen ? 'Close Ordering' : 'Re-Open Ordering'}
        </Button>
      )}

      {isLatest && (
        <Button variant="contained" color="primary" className={classes.button}>
          Edit Dates
        </Button>
      )}

      <Button variant="contained" color="primary" className={classes.button}>
        View Orders
      </Button>

      {isLatest && (
        <Button variant="contained" color="primary" className={classes.button}>
          Send Reminders
        </Button>
      )}
    </>
  );

  return (
    <Grid container spacing={3}>
      <Grid item xs={4}>
        <MaterialTable
          title="Last 10 Order Cycles"
          isLoading={loading}
          data={tableData}
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
              render: rowData =>
                rowData.isOpen &&
                rowData.tableData.id === 0 && (
                  <Chip label={rowData.isOpen && 'OPEN'} color="primary" />
                ),
            },
          ]}
          actions={[
            rowData => ({
              icon: 'search',
              iconProps: { color: 'primary' },
              tooltip: 'View Orders',
              onClick: (_, data) => {
                alert('view orders');
              },
            }),
          ]}
          options={{
            paging: false,
            search: false,
            sorting: false,
            actionsColumnIndex: 3,
          }}
        />
      </Grid>
      <Grid item xs={8}>
        <Button variant="contained" color="primary">
          Open a new ordering cycle
        </Button>
        {tableData.length > 0 && (
          <BatchActions
            batchId={tableData[0].batchId}
            isLatest={true}
            isOpen={tableData[0].isOpen}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default BatchHistory;
