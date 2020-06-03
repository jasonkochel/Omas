import { Grid, Typography } from '@material-ui/core';
import { format, parseISO } from 'date-fns';
import React from 'react';
import ActionCard from './ActionCard';

const BatchActions = ({ batch, isLatest }) => (
  <>
    <Grid item xs={12}>
      <Typography variant="h5">
        Manage Delivery for {format(parseISO(batch.deliveryDate), 'PPPP')}
      </Typography>
    </Grid>

    {batch.isOpen && (
      <>
        <Grid item xs={4}>
          <ActionCard
            buttonText="Close Ordering"
            caption="Close the system to new orders"
            onClick={() => alert('close ordering')}
          />
        </Grid>
        <Grid item xs={4}>
          <ActionCard
            buttonText="Edit Dates"
            caption="Edit the Order-By and Delivery dates"
            onClick={() => alert('edit dates')}
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
  </>
);

export default BatchActions;
