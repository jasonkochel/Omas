import { TextField } from '@material-ui/core';
import MaterialTable from 'material-table';
import React, { useEffect, useState } from 'react';
import api from '../api';

const noop = () => {};

const Categories = () => {
  const [categories, setCategories] = useState([]);

  const addCategory = data => {
    return api
      .addCategory(data)
      .then(res => setCategories([...categories, res])) // TODO sort
      .catch(noop);
  };

  const updateCategory = data => {
    return api
      .updateCategory(data)
      .then(res => setCategories([...categories.filter(c => c.categoryId !== data.categoryId), res])) // TODO sort
      .catch(noop);
  };

  const deleteCategory = id => {
    return api
      .deleteCategory(id)
      .then(() => setCategories(categories.filter(c => c.categoryId !== id)))
      .catch(noop);
  };

  useEffect(() => {
    api
      .getCategories()
      .then(data => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  const WideTextField = props => (
    <TextField value={props.value} fullWidth={true} onChange={e => props.onChange(e.target.value)} />
  );

  return (
    <MaterialTable
      title="Categories"
      data={categories}
      columns={[
        { title: 'Name', field: 'name', editComponent: props => WideTextField(props) },
        { title: 'Description', field: 'description', editComponent: props => WideTextField(props) },
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
          onClick: (event, rowData) => {
            console.log('up', event, rowData);
          },
          disabled: rowData.tableData.id === 0,
        }),
        rowData => ({
          icon: 'keyboard_arrow_down',
          tooltip: 'Move Down',
          onClick: (e, data) => {
            console.log('down', data);
          },
          disabled: rowData.tableData.id === categories.length - 1,
        }),
      ]}
    />
  );
};

export default Categories;
