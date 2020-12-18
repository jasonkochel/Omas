import { CircularProgress, Fab, makeStyles } from '@material-ui/core';
import { ShoppingCart } from '@material-ui/icons';
import { useConfirm } from 'material-ui-confirm';
import React, { useCallback, useState } from 'react';
import { useQuery } from 'react-query';
import { useHistory } from 'react-router-dom';
import api from '../../api';
import fns from '../../fns';
import JumpLinks from './JumpLinks';
import OrderCategory from './OrderCategory';

const queryConfig = {
  cacheTime: 0, // re-fetch every time the screen loads, so latest savedOrder is respected
  staleTime: Infinity, // never re-fetch after initial fetch (per screen load)
};

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

const cartToArray = cart => Object.keys(cart).map(sku => ({ sku, quantity: cart[sku].quantity }));

const useStyles = makeStyles(theme => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  centeredDiv: {
    width: '100%',
    textAlign: 'center',
  },
}));

const Order = () => {
  const classes = useStyles();
  const history = useHistory();
  const confirm = useConfirm();

  const [cart, setCart] = useState({});

  const getSavedOrder = async () => {
    const data = await api.getCurrentOrder();
    const savedOrderObj = makeCart(fns.arrayToObject(data?.lineItems ?? [], 'sku'));
    setCart(savedOrderObj);
    return savedOrderObj;
  };

  const { data: batchId } = useQuery('CurrentBatchId', () => api.getCurrentBatchId(), queryConfig);

  const { isSuccess: savedOrderLoaded, data: savedCart } = useQuery(
    'SavedOrder',
    getSavedOrder,
    queryConfig
  );

  const { isSuccess: categoriesLoaded, data: catalog } = useQuery(
    'Catalog',
    () => api.getCategories(true, true),
    {
      ...queryConfig,
      enabled: !!savedOrderLoaded, // wait until cart has been fetched and built
    }
  );

  const handleChangeQuantity = useCallback((item, quantity) => {
    setCart(c => {
      return {
        ...c,
        [item.sku]: {
          price: item.price,
          quantity,
          multiplier: item.multiplier,
        },
      };
    });
  }, []);

  const handleConfirmOrder = () => {
    confirm({
      description: 'By clicking "Place Order" you are committing to ordering this food.  Continue?',
      confirmationText: 'Place Order',
    })
      .then(async () => {
        api.replaceOrderLines(cartToArray(cart)).then(() => history.push(`/order/${batchId}`));
      })
      .catch(() => fns.noop);
  };

  if (!categoriesLoaded)
    return (
      <div className={classes.centeredDiv}>
        <CircularProgress disableShrink />
      </div>
    );

  return (
    categoriesLoaded &&
    !!catalog && (
      <div>
        <JumpLinks catalog={catalog} />

        {catalog.map(category => (
          <React.Fragment key={category.categoryId}>
            <div id={`cat-${category.categoryId}`}></div>
            <OrderCategory
              category={category}
              cart={savedCart}
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
