import React, { useEffect, useState } from 'react';
import api from '../api/api';
import fns from '../fns';
import JumpLinks from './JumpLinks';
import OrderCategory from './OrderCategory';

const Order = () => {
  const [catalog, setCatalog] = useState([]);
  const [order, setOrder] = useState({});

  useEffect(() => {
    api
      .getCategories(true)
      .then(data => setCatalog(data))
      .catch(() => setCatalog([]));

    api
      .getCurrentOrder()
      .then(data => fns.arrayToObject(data, 'sku'))
      .then(obj => setOrder(obj))
      .catch(() => setOrder({}));
  }, []);

  if (catalog === null) return;

  return (
    <>
      <JumpLinks catalog={catalog} />

      {catalog.map(category => (
        <React.Fragment key={category.categoryId}>
          <div id={`cat-${category.categoryId}`}></div>
          <OrderCategory category={category} order={order} />
        </React.Fragment>
      ))}
    </>
  );
};

export default Order;
