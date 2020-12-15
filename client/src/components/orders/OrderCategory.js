import {
  IconButton,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { VerticalAlignTop } from '@material-ui/icons';
import React from 'react';
import OrderQuantity from './OrderQuantity';

const useStyles = makeStyles(theme => ({
  paper: {
    margin: '0 0 20px 0',
  },
  titleBar: {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
  },
  title: {
    flex: '1 1 100%',
  },
  subtitle: {
    fontSize: '1rem',
    marginLeft: '10px',
    opacity: '80%',
  },
  header: {
    backgroundColor: theme.palette.grey['200'],
  },
  scrollToTopIcon: {
    color: 'white',
  },
  colSku: {
    width: '15%',
  },
  colName: {
    width: '35%',
  },
  colPrice: {
    width: '15%',
  },
  colWeight: {
    width: '15%',
  },
  colQty: {
    width: '20%',
  },
}));

const OrderCategory = ({ category, cart, onChangeQuantity }) => {
  const classes = useStyles();

  if (!category?.catalogItems) return;

  return (
    <Paper className={classes.paper}>
      <Toolbar className={classes.titleBar}>
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
          {category.name}
          <span className={classes.subtitle}>{category.description}</span>
        </Typography>
        <Tooltip title="Back to Top">
          <IconButton
            className={classes.scrollToTopIcon}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <VerticalAlignTop />
          </IconButton>
        </Tooltip>
      </Toolbar>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow className={classes.header}>
              <TableCell className={classes.colSku}>SKU</TableCell>
              <TableCell className={classes.colName}>Name</TableCell>
              <TableCell className={classes.colPrice}>Price</TableCell>
              <TableCell className={classes.colWeight}>Weight</TableCell>
              <TableCell className={classes.colQty} align="center">
                Quantity
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {category.catalogItems.map(c => (
              <TableRow key={c.catalogId}>
                <TableCell className={classes.colSku}>{c.sku}</TableCell>
                <TableCell className={classes.colName}>{c.name}</TableCell>
                <TableCell className={classes.colPrice}>
                  {Number(c.price).toFixed(2) + ' per ' + c.pricePer.toLowerCase()}
                </TableCell>
                <TableCell className={classes.colWeight}>
                  {Number(c.weight).toFixed(2) + ' lbs'}
                </TableCell>
                <TableCell className={classes.colQty} align="center">
                  {c.discontinued ? (
                    <i>Discontinued</i>
                  ) : (
                    <OrderQuantity
                      item={c}
                      quantity={cart[c.sku]?.quantity}
                      onChangeQuantity={onChangeQuantity}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default OrderCategory;
