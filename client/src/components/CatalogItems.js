import React, { useEffect, useState } from 'react';
import api from '../api/api';
import EditableTable from './EditableTable';
import EditItemModal from './EditItemModal';

const CatalogItems = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api
      .getCategories()
      .then(data => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  return (
    <>
      {categories.map(cat => (
        <EditableTable
          key={cat.categoryId}
          title={cat.name}
          EditComponent={EditItemModal}
          columns={[
            {
              title: 'SKU',
              field: 'sku',
            },
            { title: 'Name', field: 'name' },
            {
              title: 'Price',
              field: 'price',
              render: rowData => (
                <span>
                  {rowData.price.toFixed(2)} per {rowData.pricePer.toLowerCase()}
                </span>
              ),
            },
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
