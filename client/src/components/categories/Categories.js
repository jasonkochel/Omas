import React from 'react';
import api from '../../api';
import EditableTable from '../shared/EditableTable';

const Categories = () => (
  <EditableTable
    queryKey="Categories"
    title="Categories"
    columns={[
      { title: 'Name', field: 'name' },
      {
        title: 'Description',
        field: 'description',
      },
    ]}
    idField="categoryId"
    getData={() => api.getCategories(false, false)}
    onAdd={api.addCategory}
    onUpdate={api.updateCategory}
    onDelete={api.deleteCategory}
    onMoveUp={api.moveCategoryUp}
    onMoveDown={api.moveCategoryDown}
  />
);

export default Categories;
