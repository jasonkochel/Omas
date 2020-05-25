import React, { useEffect, useState } from 'react';
import api from '../api/api';

const Order = () => {
  const [catalog, setCatalog] = useState([]);

  useEffect(() => {
    api
      .getItemsByCategoryId(null)
      .then(data => setCatalog(data))
      .catch(() => setCatalog([]));
  }, []);

  return (
    <>
      Catalog:
      <ul>
        {catalog.map(cat => (
          <li key={cat.categoryId}>
            {cat.name}
            <ul>
              {cat.catalogItems.map(i => (
                <li key={i.catalogId}>
                  {i.name} - {i.price}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Order;
