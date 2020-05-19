import React, { useEffect, useState } from 'react';
import api from '../api/api';
import EditableTable from './EditableTable';
import EditItemModal from './EditItemModal';

const CatalogItems = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api
      .getCategories()
      .then(data => setCategories(data.slice(0, 4))) // TODO: this is for dev speed only - remove for prod!
      //.then(data => setCategories(data))
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
              width: '20%',
            },
            { title: 'Name', field: 'name', width: '40%' },
            {
              title: 'Price',
              field: 'price',
              render: rowData =>
                Number(rowData.price).toFixed(2) + ' per ' + rowData.pricePer.toLowerCase(),
              width: '20%',
            },
            {
              title: 'Weight',
              field: 'weight',
              render: rowData => Number(rowData.weight).toFixed(2) + ' lbs',
              width: '20%',
            },
          ]}
          idField="catalogId"
          getData={() => api.getItemsByCategoryId(cat.categoryId)}
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
