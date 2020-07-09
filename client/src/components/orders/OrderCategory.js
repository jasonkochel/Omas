import { makeStyles, useTheme } from '@material-ui/core';
import { VerticalAlignTop } from '@material-ui/icons';
import MaterialTable, { MTableToolbar } from 'material-table';
import React from 'react';
import OrderQuantity from './OrderQuantity';

const useStyles = makeStyles(theme => ({
  toolbarWrapper: {
    '& .MuiToolbar-root': {
      backgroundColor: theme.palette.primary.main,
      color: 'white',
    },
  },
  scrollToTopIcon: {
    color: 'white',
  },
}));

const OrderCategory = ({ category, onChangeQuantity, savedOrder }) => {
  const classes = useStyles();
  const theme = useTheme();

  if (category === null) return;

  return (
    <MaterialTable
      title={category.name}
      data={category.catalogItems}
      components={{
        Toolbar: props => (
          <div className={classes.toolbarWrapper}>
            <MTableToolbar {...props} />
          </div>
        ),
      }}
      columns={[
        {
          title: 'SKU',
          field: 'sku',
          width: '15%',
        },
        { title: 'Name', field: 'name', width: '35%' },
        {
          title: 'Price',
          render: rowData =>
            Number(rowData.price).toFixed(2) + ' per ' + rowData.pricePer.toLowerCase(),
          width: '15%',
        },
        {
          title: 'Weight',
          render: rowData => Number(rowData.weight).toFixed(2) + ' lbs',
          width: '15%',
        },
        {
          title: 'Quantity',
          render: rowData => (
            <OrderQuantity
              item={rowData}
              onChangeQuantity={onChangeQuantity}
              initialQuantity={savedOrder[rowData.sku]?.quantity}
            />
          ),
          width: '20%',
        },
      ]}
      style={{ margin: '0 0 20px 0' }}
      options={{
        paging: false,
        search: false,
        headerStyle: {
          backgroundColor: theme.palette.grey['200'],
        },
      }}
      actions={[
        {
          icon: props => <VerticalAlignTop {...props} className={classes.scrollToTopIcon} />,
          tooltip: 'Back to Top',
          isFreeAction: true,
          onClick: () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          },
        },
      ]}
    />
  );
};

export default OrderCategory;
