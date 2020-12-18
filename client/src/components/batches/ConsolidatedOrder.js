import { Button, makeStyles, Typography } from '@material-ui/core';
import { ArrowBack, Redo, SaveAlt } from '@material-ui/icons';
import clsx from 'clsx';
import React from 'react';
import { useQuery } from 'react-query';
import { useHistory } from 'react-router-dom';
import api from '../../api';
import fns from '../../fns';
import StyledTable from '../shared/StyledTable';

const useStyles = makeStyles(theme => ({
  paddedParagraph: {
    marginBottom: '15px',
  },
  paddedIcon: {
    margin: '0 5px 0 5px',
  },
  paddedButton: {
    marginRight: '15px',
  },
  rightAlignText: {
    textAlign: 'right',
  },
}));

const totalConsolidatedOrder = order => {
  return !!order && Array.isArray(order) && order.reduce((acc, i) => (acc += i.price), 0);
};

const ConsolidatedOrder = ({ batchId }) => {
  const classes = useStyles();
  const history = useHistory();

  const { isLoading, data } = useQuery(['ConsolidatedOrder', batchId], () =>
    api.getConsolidatedOrder(batchId)
  );

  return (
    <>
      <Typography variant="body1" className={clsx(classes.paddedParagraph, 'print-hidden')}>
        <Button
          variant="contained"
          color="primary"
          className={classes.paddedButton}
          startIcon={<ArrowBack />}
          onClick={() => history.goBack()}
        >
          Back
        </Button>
        This shows the total quantity and price of each item, across all of your customers, for this
        ordering cycle. You can download this data into Excel by clicking the
        <SaveAlt className={classes.paddedIcon} />
        icon on the right below <Redo className={classes.paddedIcon} />
      </Typography>
      <StyledTable
        title="Consolidated Order Form"
        isLoading={isLoading}
        data={data}
        columns={[
          { title: 'SKU', field: 'sku', width: '15%' },
          { title: 'Name', field: 'name', width: '40%' },
          {
            title: 'Quantity',
            field: 'quantity',
            type: 'numeric',
            width: '15%',
          },
          {
            title: 'Total Price',
            field: 'price',
            type: 'numeric',
            render: rowData => fns.formatCurrency(rowData.price),
            width: '15%',
          },
        ]}
        options={{
          exportButton: true,
        }}
      />
      <Typography variant="h6" className={classes.rightAlignText}>
        Total: {fns.formatCurrency(totalConsolidatedOrder(data))}
      </Typography>
    </>
  );
};

export default ConsolidatedOrder;
