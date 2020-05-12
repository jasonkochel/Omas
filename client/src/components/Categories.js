import React from 'react';
import api from '../api/api';
import EditableTable from './EditableTable';

const Categories = () => (
  <EditableTable
    title="Categories"
    columns={[
      { title: 'Name', field: 'name' },
      {
        title: 'Description',
        field: 'description',
      },
    ]}
    idField="categoryId"
    getData={api.getCategories}
    onAdd={api.addCategory}
    onUpdate={api.updateCategory}
    onDelete={api.deleteCategory}
    onMoveUp={api.moveCategoryUp}
    onMoveDown={api.moveCategoryDown}
  />
);

export default Categories;
