import { Grid, Typography } from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import fns from '../../fns';
import ActionCard from './ActionCard';

/*
If one is open:
x see summary (# orders, total $)
x close it
x edit its dates
TODO: - add an order on someone's behalf
x view/print orders
x view consolidated order
x email reminders

If none is open:
TODO: - create one

If selecting an old one:
x see summary (# orders, total $)
x view/print orders
*/

const headerString = num => `${num} ${num === 1 ? ' customer has ' : ' customers have '} ordered`;

const BatchActions = ({
  batch,
  isLatest,
  onCloseOrdering,
  onOpenOrdering,
  onStartEditingDates,
  onEmailBatch,
  onStartImpersonation,
  onEndImpersonation,
}) => {
  const history = useHistory();

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
              onClick={onCloseOrdering}
            />
          </Grid>
          <Grid item xs={4}>
            <ActionCard
              buttonText="Edit Dates"
              caption="Edit the Order-By and Delivery dates"
              onClick={onStartEditingDates}
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
            onClick={onOpenOrdering}
          />
        </Grid>
      )}

      <Grid item xs={4}>
        <ActionCard
          buttonText="View Orders"
          caption="View or print each customer's order"
          onClick={() => history.push(`/batches/${batch.batchId}/orders`)}
        />
      </Grid>

      <Grid item xs={4}>
        <ActionCard
          buttonText="View Consolidated Order"
          caption="View or print total orders by SKU"
          onClick={() => history.push(`/batches/${batch.batchId}/consolidated`)}
        />
      </Grid>

      {isLatest && (
        <Grid item xs={4}>
          <ActionCard
            buttonText="Send Reminders"
            caption="Email each customer a reminder message and their order total"
            onClick={onEmailBatch}
          />
        </Grid>
      )}

      <Grid item xs={4}>
        <ActionCard
          buttonText="Start Impersonation"
          caption="TEST - start impersonation"
          onClick={onStartImpersonation}
        />
      </Grid>
      <Grid item xs={4}>
        <ActionCard
          buttonText="End Impersonation"
          caption="TEST - end impersonation"
          onClick={onEndImpersonation}
        />
      </Grid>
    </>
  );
};

export default BatchActions;
