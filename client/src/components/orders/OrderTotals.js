import { makeStyles, Paper, Table, TableBody, TableCell, TableRow } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';
import fns from '../../fns';

const useStyles = makeStyles(theme => ({
  totalTable: {
    width: 'fit-content',
    position: 'relative',
    float: 'right',
  },
  totalHeaderCol: {
    backgroundColor: theme.palette.grey['200'],
    fontWeight: '500',
  },
  totalRow: {
    fontSize: '18px',
    fontWeight: '700',
  },
}));

const OrderTotals = ({ order }) => {
  const classes = useStyles();

  if (!order) return null;

  return (
    <Paper className={classes.totalTable}>
      <Table size="small">
        <TableBody>
          <TableRow>
            <TableCell className={classes.totalHeaderCol} align="right">
              Sub-Total:
            </TableCell>
            <TableCell align="right">{fns.formatCurrency(order.subTotal)}</TableCell>
          </TableRow>
          {Math.round(order.tax * 100) > 0 && (
            <TableRow>
              <TableCell className={classes.totalHeaderCol} align="right">
                Tax:
              </TableCell>
              <TableCell align="right">{fns.formatCurrency(order.tax)}</TableCell>
            </TableRow>
          )}
          <TableRow>
            <TableCell className={classes.totalHeaderCol} align="right">
              Shipping/Handling:
            </TableCell>
            <TableCell align="right">{fns.formatCurrency(order.shipping)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={clsx(classes.totalHeaderCol, classes.totalRow)} align="right">
              Total:
            </TableCell>
            <TableCell className={classes.totalRow} align="right">
              {fns.formatCurrency(order.subTotal + order.tax + order.shipping)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
};

export default OrderTotals;
