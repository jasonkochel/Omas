import { TextField } from '@material-ui/core';
import MaterialTable from 'material-table';
import React, { useEffect, useState } from 'react';
import api from '../api/api';

const noop = () => {};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const getCategories = () => {
    api
      .getCategories()
      .then(data => setCategories(data))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  };

  const addCategory = data => {
    return api
      .addCategory(data)
      .then(res => setCategories([res, ...categories]))
      .catch(noop);
  };

  const updateCategory = data => {
    return api
      .updateCategory(data)
      .then(res => setCategories(categories.map(c => (c.categoryId === res.categoryId ? res : c))))
      .catch(noop);
  };

  const deleteCategory = id => {
    return api
      .deleteCategory(id)
      .then(() => setCategories(categories.filter(c => c.categoryId !== id)))
      .catch(noop);
  };

  const moveUp = data => {
    return api.moveCategoryUp(data.categoryId).then(() => getCategories());
  };

  const moveDown = data => {
    return api.moveCategoryDown(data.categoryId).then(() => getCategories());
  };

  useEffect(() => getCategories(), []);

  const WideTextField = props => (
    <TextField
      value={props.value}
      fullWidth={true}
      onChange={e => props.onChange(e.target.value)}
    />
  );

  return (
    <MaterialTable
      title="Categories"
      isLoading={loading}
      data={categories}
      columns={[
        { title: 'Name', field: 'name', editComponent: props => WideTextField(props) },
        {
          title: 'Description',
          field: 'description',
          editComponent: props => WideTextField(props),
        },
      ]}
      options={{
        paging: false,
        search: false,
        addRowPosition: 'first',
        actionsColumnIndex: 2,
      }}
      editable={{
        onRowAdd: data => addCategory(data),
        onRowUpdate: data => updateCategory(data),
        onRowDelete: data => deleteCategory(data.categoryId),
      }}
      actions={[
        rowData => ({
          icon: 'keyboard_arrow_up',
          tooltip: 'Move Up',
          onClick: (_, data) => {
            moveUp(data);
          },
          disabled: rowData.tableData.id === 0,
        }),
        rowData => ({
          icon: 'keyboard_arrow_down',
          tooltip: 'Move Down',
          onClick: (_, data) => {
            moveDown(data);
          },
          disabled: rowData.tableData.id === categories.length - 1,
        }),
      ]}
    />
  );
};

export default Categories;
