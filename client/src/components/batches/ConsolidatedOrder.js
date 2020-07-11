import { makeStyles, Typography } from '@material-ui/core';
import { Redo, SaveAlt } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
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
  rightAlignText: {
    textAlign: 'right',
  },
}));

const totalConsolidatedOrder = order => {
  return order.reduce((acc, i) => (acc += i.price), 0);
};

const ConsolidatedOrder = ({ batchId }) => {
  const classes = useStyles();

  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getConsolidatedOrder(batchId)
      .then(data => setOrder(data))
      .then(() => setLoading(false))
      .catch(() => setOrder([]));
  }, [batchId]);

  return (
    <>
      <Typography variant="body1" className={classes.paddedParagraph}>
        This shows the total quantity and price of each item, across all of your customers, for this
        ordering cycle. You can download this data into Excel by clicking the
        <SaveAlt className={classes.paddedIcon} />
        icon on the right below <Redo className={classes.paddedIcon} />
      </Typography>
      <StyledTable
        title="Consolidated Order Form"
        isLoading={loading}
        data={order}
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
        Total: {fns.formatCurrency(totalConsolidatedOrder(order))}
      </Typography>
    </>
  );
};

export default ConsolidatedOrder;
