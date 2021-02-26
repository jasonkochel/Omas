import {
  Backspace,
  BackspaceOutlined,
  InfoOutlined,
  NewReleases,
  NewReleasesOutlined,
  Star,
  StarBorderOutlined,
} from '@material-ui/icons';
import React from 'react';
import { useQuery, useQueryClient } from 'react-query';
import api from '../../api';
import EditableTable from '../shared/EditableTable';
import EditItemModal from './EditItemModal';

const CatalogItems = () => {
  const queryClient = useQueryClient();

  const { data: categories } = useQuery(`Categories`, () => api.getCategories(false, false), {
    cacheTime: 0, // re-fetch every time the screen loads, so latest savedOrder is respected
    staleTime: Infinity, // never re-fetch after initial fetch (per screen load)
  });

  const handleMarkNew = (e, data) =>
    api
      .markNew(data.catalogId, !data.new)
      .then(() => queryClient.invalidateQueries(`CatalogItems-${data.categoryId}`));

  const handleMarkFeatured = (e, data) =>
    api
      .markFeatured(data.catalogId, !data.featured)
      .then(() => queryClient.invalidateQueries(`CatalogItems-${data.categoryId}`));

  const handleMarkDiscontinued = (e, data) =>
    api
      .markDiscontinued(data.catalogId, !data.discontinued)
      .then(() => queryClient.invalidateQueries(`CatalogItems-${data.categoryId}`));

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
            {
              title: 'Name',
              field: 'name',
              render: rowData => (
                <span>
                  {rowData.name}{' '}
                  {!!rowData.description && (
                    <InfoOutlined
                      color="primary"
                      fontSize="small"
                      style={{ marginLeft: '10px' }}
                      titleAccess="Has Additional Description"
                    />
                  )}
                </span>
              ),
              width: '40%',
            },
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
