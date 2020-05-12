import React, { useEffect, useState } from 'react';
import api from '../api/api';
import EditableTable from './EditableTable';

const CatalogItems = () => {
  const [catalog, setCatalog] = useState([]);

  useEffect(() => {
    api
      .getCatalog()
      .then(data => setCatalog(data))
      .catch(() => setCatalog([]));
  }, []);

  return (
    <>
      {catalog.map(cat => (
        <EditableTable
          key={cat.categoryId}
          title={cat.name}
          columns={[
            {
              title: 'SKU',
              field: 'sku',
              width: '20%',
            },
            { title: 'Name', field: 'name', width: '60%' },
            { title: 'Price', field: 'price', type: 'currency', width: '5%' },
          ]}
          idField="catalogId"
          getData={() => api.getCatalog(cat.categoryId).then(res => res[0].catalogItems)}
          onAdd={api.addItem}
          onUpdate={api.updateItem}
          onDelete={api.deleteItem}
          onMoveUp={api.moveItemUp}
          onMoveDown={api.moveItemDown}
        />
      ))}
    </>
  );
};

export default CatalogItems;
