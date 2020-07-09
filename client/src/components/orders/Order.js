import { Fab, makeStyles } from '@material-ui/core';
import { ShoppingCart } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
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

  const [catalog, setCatalog] = useState([]);
  const [savedOrder, setSavedOrder] = useState({});
  const [cart, setCart] = useState({});

  useEffect(() => {
    const getData = async () => {
      const data = await api.getCurrentOrder();
      const savedOrderObj = fns.arrayToObject(data.lineItems, 'sku');
      setSavedOrder(savedOrderObj);
      setCart(makeCart(savedOrderObj));

      const catData = await api.getCategories(true);
      setCatalog(catData);
    };

    getData();
  }, []);

  const handleChangeQuantity = React.useCallback((item, quantity) => {
    setCart(c => {
      return {
        ...c,
        [item.sku]: { price: item.price, quantity, multiplier: item.multiplier },
      };
    });
  }, []);

  const handleConfirmOrder = () => {
    api.confirmOrder().then(order => history.push(`/order/${order.batchId}`));
  };

  const orderForm = React.useMemo(
    () =>
      catalog.map(category => (
        <React.Fragment key={category.categoryId}>
          <div id={`cat-${category.categoryId}`}></div>
          <OrderCategory
            category={category}
            savedOrder={savedOrder}
            onChangeQuantity={handleChangeQuantity}
          />
        </React.Fragment>
      )),
    [catalog, savedOrder, handleChangeQuantity]
  );

  if (catalog === null) return;

  return (
    <div>
      <JumpLinks catalog={catalog} />

      {orderForm}

      <Fab color="primary" variant="extended" className={classes.fab} onClick={handleConfirmOrder}>
        <ShoppingCart className={classes.extendedIcon} />
        Check Out ({fns.formatCurrency(totalCart(cart))})
      </Fab>
    </div>
  );
};

export default Order;
