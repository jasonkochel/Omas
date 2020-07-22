import {
  Backspace,
  BackspaceOutlined,
  NewReleases,
  NewReleasesOutlined,
  Star,
  StarBorderOutlined,
} from '@material-ui/icons';
import React from 'react';
import { queryCache, useQuery } from 'react-query';
import api from '../../api';
import EditableTable from '../shared/EditableTable';
import EditItemModal from './EditItemModal';

const CatalogItems = () => {
  const { data: categories } = useQuery(`Categories`, api.getCategories, {
    staleTime: Infinity,
  });

  const handleMarkNew = (e, data) =>
    api
      .markNew(data.catalogId, !data.new)
      .then(() => queryCache.invalidateQueries(`CatalogItems-${data.categoryId}`));

  const handleMarkFeatured = (e, data) =>
    api
      .markFeatured(data.catalogId, !data.featured)
      .then(() => queryCache.invalidateQueries(`CatalogItems-${data.categoryId}`));

  const handleMarkDiscontinued = (e, data) =>
    api
      .markDiscontinued(data.catalogId, !data.discontinued)
      .then(() => queryCache.invalidateQueries(`CatalogItems-${data.categoryId}`));

  if (!categories || !Array.isArray(categories)) return null;

  return (
    <>
      {categories.map(cat => (
        <EditableTable
          key={cat.categoryId}
          queryKey={`CatalogItems-${cat.categoryId}`}
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
          onAdd={data => api.addItem(cat.categoryId, data)}
          onUpdate={api.updateItem}
          onDelete={api.deleteItem}
          onMoveUp={api.moveItemUp}
          onMoveDown={api.moveItemDown}
          actions={[
            rowData => ({
              icon: props =>
                rowData.new ? (
                  <NewReleases color="primary" fontSize="large" />
                ) : (
                  <NewReleasesOutlined />
                ),
              tooltip: 'New',
              onClick: handleMarkNew,
            }),
            rowData => ({
              icon: props =>
                rowData.featured ? (
                  <Star color="primary" fontSize="large" />
                ) : (
                  <StarBorderOutlined />
                ),
              tooltip: 'Featured',
              onClick: handleMarkFeatured,
            }),
            rowData => ({
              icon: props =>
                rowData.discontinued ? (
                  <Backspace color="primary" fontSize="large" />
                ) : (
                  <BackspaceOutlined />
                ),
              tooltip: 'Discontinued',
              onClick: handleMarkDiscontinued,
            }),
          ]}
        />
      ))}
    </>
  );
};

export default CatalogItems;
