import { Grid, Typography } from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import fns from '../../fns';
import ActionCard from './ActionCard';

const headerString = num => `${num} ${num === 1 ? ' customer has ' : ' customers have '} ordered`;

const BatchActions = ({
  batch,
  isLatest,
  onCloseOrdering,
  onOpenOrdering,
  onStartEditingDates,
  onEmailBatch,
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
              buttonText="Impersonate User"
              caption="Create, change, or view an order on a customer's behalf"
              onClick={() => history.push('/impersonate')}
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
            caption="Email each customer a reminder message with their order details and total due"
            onClick={onEmailBatch}
          />
        </Grid>
      )}
    </>
  );
};

export default BatchActions;
