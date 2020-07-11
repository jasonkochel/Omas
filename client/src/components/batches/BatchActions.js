import { Grid, Typography } from '@material-ui/core';
import { useConfirm } from 'material-ui-confirm';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../../api';
import fns from '../../fns';
import ActionCard from './ActionCard';
import EditBatchDatesModal from './EditBatchDatesModal';

/*
TODO:
- make presentation-only and move fetchers and handlers to parent
- refresh BatchHistory list when certain actions are taken in individual batch

If one is open:
x see summary (# orders, total $)
x close it
x edit its dates
- add an order on someone's behalf
x view/print orders
x view consolidated order
- email reminders

If none is open:
- create one

If selecting an old one:
x see summary (# orders, total $)
x view/print orders
*/

const headerString = num => `${num} ${num === 1 ? ' customer has ' : ' customers have '} ordered`;

const BatchActions = ({ batchId, isLatest }) => {
  const history = useHistory();

  const [batch, setBatch] = useState();
  const [editingDates, setEditingDates] = useState(false);
  const confirm = useConfirm();

  useEffect(() => {
    api
      .getBatch(batchId)
      .then(data => setBatch(data))
      .catch(() => setBatch(null));
  }, [batchId]);

  const getBatch = async batchId =>
    await api
      .getBatch(batchId)
      .then(data => setBatch(data))
      .catch(() => setBatch(null));

  const handleCloseOrdering = () =>
    confirm({ description: 'Are you sure you want to close ordering?' }).then(() =>
      api.updateBatch({ ...batch, isOpen: false })
    );

  const handleOpenOrdering = () =>
    confirm({ description: 'Are you sure you want to re-open ordering?' }).then(() =>
      api.updateBatch({ ...batch, isOpen: true })
    );

  const handleEditDates = data => {
    setEditingDates(false);
    api.updateBatch(data).then(() => getBatch(batchId));
  };

  if (!batch) return null;

  return (
    <>
      <Grid item xs={12}>
        <Typography variant="h5">
          Manage Delivery for {fns.formatDateLong(batch.deliveryDate)}
        </Typography>
        <Typography variant="h6">
          {headerString(batch.customerCount)}, totaling {fns.formatCurrency(batch.total)}
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

      {isLatest && !batch.isOpen && (
        <Grid item xs={4}>
          <ActionCard
            buttonText="Re-Open Ordering"
            caption="Re-Open system to new orders"
            onClick={handleOpenOrdering}
          />
        </Grid>
      )}

      <Grid item xs={4}>
        <ActionCard
          buttonText="View Orders"
          caption="View or print each customer's order"
          onClick={() => history.push(`/batches/${batchId}/orders`)}
        />
      </Grid>

      <Grid item xs={4}>
        <ActionCard
          buttonText="View Consolidated Order"
          caption="View total orders by SKU"
          onClick={() => history.push(`/batches/${batchId}/consolidated`)}
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
