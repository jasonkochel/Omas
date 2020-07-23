import { Fab, makeStyles } from '@material-ui/core';
import { ShoppingCart } from '@material-ui/icons';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useHistory } from 'react-router-dom';
import api from '../../api';
import fns from '../../fns';
import JumpLinks from './JumpLinks';
import OrderCategory from './OrderCategory';

const makeCart = order => {
  let cart = {};
  for (const sku of Object.keys(order)) {
    const item = order[sku];
    cart[sku] = { price: item.price, quantity: item.quantity, multiplier: item.multiplier };
  }

  return cart;
};

const totalCart = cart => {
  let total = 0;
  for (const item of Object.keys(cart)) {
    if (cart[item].quantity > 0) {
      total += cart[item].price * cart[item].quantity;
    }
  }

  return total;
};

const useStyles = makeStyles(theme => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

const Order = () => {
  const classes = useStyles();
  const history = useHistory();

  const [cart, setCart] = useState({});

  const getSavedOrder = async () => {
    const data = await api.getCurrentOrder();
    const savedOrderObj = fns.arrayToObject(data.lineItems, 'sku');
    setCart(makeCart(savedOrderObj));
    return savedOrderObj;
  };

  const getCategories = () => api.getCategories(null, true, true);

  const { isSuccess } = useQuery('SavedOrder', getSavedOrder, {
    cacheTime: 0, // re-fetch every time the screen loads, so latest savedOrder is respected
    staleTime: Infinity, // never re-fetch after initial fetch (per screen load)
  });

  const { data: catalog } = useQuery('Catalog', getCategories, {
    cacheTime: 0, // re-fetch every time the screen loads, so latest savedOrder is respected
    staleTime: Infinity, // never re-fetch after initial fetch (per screen load)
    enabled: isSuccess, // wait until cart has been fetched and built
  });

  /*
  const handleChangeQuantity = React.useCallback((item, quantity) => {
    setCart(c => {
      return {
        ...c,
        [item.sku]: { price: item.price, quantity, multiplier: item.multiplier },
      };
    });
  }, []);
  */
  const handleChangeQuantity = (item, quantity) => {
    setCart(c => {
      return {
        ...c,
        [item.sku]: { price: item.price, quantity, multiplier: item.multiplier },
      };
    });
  };

  const handleConfirmOrder = () => {
    api.confirmOrder().then(order => history.push(`/order/${order.batchId}`));
  };

  return (
    isSuccess &&
    !!catalog && (
      <div>
        <JumpLinks catalog={catalog} />

        {catalog.map(category => (
          <React.Fragment key={category.categoryId}>
            <div id={`cat-${category.categoryId}`}></div>
            <OrderCategory
              category={category}
              cart={cart}
              onChangeQuantity={handleChangeQuantity}
            />
          </React.Fragment>
        ))}

        <Fab
          color="primary"
          variant="extended"
          className={classes.fab}
          onClick={handleConfirmOrder}
        >
          <ShoppingCart className={classes.extendedIcon} />
          Check Out ({fns.formatCurrency(totalCart(cart))})
        </Fab>
      </div>
    )
  );
};

export default Order;
