import { Grid, Typography } from '@material-ui/core';
import { useConfirm } from 'material-ui-confirm';
import React, { useEffect, useState } from 'react';
import api from '../api/api';
import fns from '../fns';
import ActionCard from './ActionCard';
import EditBatchDatesModal from './EditBatchDatesModal';

/*
If one is open:
- see summary (# orders, total $)
- close it
- edit its dates
- add an order on someone's behalf
- view/print orders
- email reminders

If none is open:
- create one

If selecting an old one:
- see summary (# orders, total $)
- view/print orders
*/

const BatchActions = ({ batchId, isLatest }) => {
  const [batch, setBatch] = useState();
  const [editingDates, setEditingDates] = useState(false);
  const confirm = useConfirm();

  useEffect(() => {
    api
      .getBatch(batchId)
      .then(data => setBatch(data))
      .catch(() => setBatch(null));
  }, [batchId]);

  const handleCloseOrdering = () =>
    confirm({ description: 'Are you sure you want to close ordering?' }).then(() =>
      api.updateBatch({ ...batch, isOpen: false })
    );

  const handleEditDates = data => {
    setEditingDates(false);
    api.updateBatch(data);
  };

  if (!batch) return null;

  return (
    <>
      <Grid item xs={12}>
        <Typography variant="h5">
          Manage Delivery for {fns.formatDateLong(batch.deliveryDate)}
        </Typography>
        <Typography variant="h6">
          {batch.customerCount} customers have ordered, totaling {fns.formatCurrency(batch.total)}
        </Typography>
      </Grid>

      {batch.isOpen && (
        <>
          <Grid item xs={4}>
            <ActionCard
              buttonText="Close Ordering"
              caption="Close the system to new orders"
              onClick={handleCloseOrdering}
            />
          </Grid>
          <Grid item xs={4}>
            <ActionCard
              buttonText="Edit Dates"
              caption="Edit the Order-By and Delivery dates"
              onClick={() => setEditingDates(true)}
            />
          </Grid>
          <Grid item xs={4}>
            <ActionCard
              buttonText="Add or Modify Order"
              caption="Enter or change an order on a customer's behalf"
              onClick={() => alert('edit order')}
            />
          </Grid>
        </>
      )}

      <Grid item xs={4}>
        <ActionCard
          buttonText="View Orders"
          caption="View or print each customer's order"
          onClick={() => alert('view orders')}
        />
      </Grid>

      {isLatest && (
        <Grid item xs={4}>
          <ActionCard
            buttonText="Send Reminders"
            caption="Email each customer a reminder message and their order total"
            onClick={() => alert('send reminders')}
          />
        </Grid>
      )}
      <EditBatchDatesModal
        open={editingDates}
        data={batch}
        onSave={handleEditDates}
        onCancel={() => setEditingDates(false)}
      />
    </>
  );
};

export default BatchActions;
