import React, { useEffect, useState } from 'react';
import api from '../api/api';
import JumpLinks from './JumpLinks';
import OrderCategory from './OrderCategory';

const Order = () => {
  const [catalog, setCatalog] = useState([]);

  useEffect(() => {
    api
      .getCategories(true)
      .then(data => setCatalog(data))
      .catch(() => setCatalog([]));
  }, []);

  if (catalog === null) return;

  return (
    <>
      <JumpLinks catalog={catalog} />

      {catalog.map(category => (
        <React.Fragment key={category.categoryId}>
          <div id={`cat-${category.categoryId}`}></div>
          <OrderCategory category={category} />
        </React.Fragment>
      ))}
    </>
  );
};

export default Order;
