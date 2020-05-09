import React, { useEffect, useState } from 'react';
import api from '../api';

const Categories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api
      .getCategories()
      .then(data => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  return (
    <>
      Categories:
      <ul>
        {categories.map(c => (
          <li key={c.categoryId}>{c.name}</li>
        ))}
      </ul>
    </>
  );
};

export default Categories;
