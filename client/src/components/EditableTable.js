import { TextField } from '@material-ui/core';
import MaterialTable from 'material-table';
import React, { useCallback, useEffect, useState } from 'react';

const noop = () => {};

const WideTextField = props => (
  <TextField value={props.value} fullWidth={true} onChange={e => props.onChange(e.target.value)} />
);

const EditableTable = ({
  title,
  EditComponent,
  columns,
  idField,
  getData,
  onAdd,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
}) => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  const _getData = useCallback(() => {
    getData()
      .then(data => setTableData(data))
      .catch(() => setTableData([]))
      .finally(() => setLoading(false));
  }, [getData]);

  const handleAdd = data => {
    return onAdd(data)
      .then(res => setTableData([res, ...tableData]))
      .catch(noop);
  };

  const handleUpdate = data => {
    console.log(data);
    return;
    return onUpdate(data)
      .then(res => setTableData(tableData.map(c => (c[idField] === res[idField] ? res : c))))
      .catch(noop);
  };

  const handleDelete = id => {
    console.log('handleDelete', id);
    return;
    return onDelete(id)
      .then(() => setTableData(tableData.filter(c => c[idField] !== id)))
      .catch(noop);
  };

  const handleMoveUp = data => {
    return onMoveUp(data[idField]).then(() => _getData());
  };

  const handleMoveDown = data => {
    return onMoveDown(data[idField]).then(() => _getData());
  };

  useEffect(() => {
    _getData();
  }, [_getData]);

  // Manually control edit behavior per https://github.com/mbrn/material-table/issues/1727

  const [, forceUpdate] = useState(false);

  /**
   * Method that allows us to easily set the table update state by forcing a re-render
   * @param rowData {Object} material-table rowData
   * @param mode {Boolean} true/false whether or not we are updating a row
   */
  const setRowUpdating = (rowData, mode) => {
    rowData.tableData.editing = mode;
    forceUpdate(mode);
  };

  const cancelRowUpdating = rowData => setRowUpdating(rowData, undefined);

  const components = {
    EditField: props => WideTextField(props),
  };

  const editable = {};

  const actions = [
    rowData => ({
      icon: 'keyboard_arrow_up',
      tooltip: 'Move Up',
      onClick: (_, data) => {
        handleMoveUp(data);
      },
      disabled: rowData.tableData.id === 0,
    }),
    rowData => ({
      icon: 'keyboard_arrow_down',
      tooltip: 'Move Down',
      onClick: (_, data) => {
        handleMoveDown(data);
      },
      disabled: rowData.tableData.id === tableData.length - 1,
    }),
  ];

  if (EditComponent) {
    // use custom EditComponent
    components.EditRow = props => (
      <EditComponent
        {...props}
        onAdd={data => {
          cancelRowUpdating(props.data);
          handleAdd(data);
        }}
        onUpdate={data => {
          cancelRowUpdating(props.data);
          handleUpdate(data);
        }}
        onDelete={data => {
          cancelRowUpdating(props.data);
          handleDelete(data[idField]);
        }}
        onCancel={() => {
          cancelRowUpdating(props.data);
        }}
      />
    );

    // use custom action buttons
    actions.push({
      icon: 'add',
      tooltip: 'Add',
      position: 'toolbar',
      onClick: () => {
        // TODO can the 'add' case use the built-in functionality and the onEditingConfirmed prop passed to EditRow?
        console.log('add.onclick');
        setRowUpdating({}, 'add');
      },
    });
    actions.push(() => ({
      icon: 'edit',
      tooltip: 'Edit',
      onClick: (_, data) => {
        setRowUpdating(data, 'update');
      },
    }));
    actions.push(() => ({
      icon: 'delete',
      tooltip: 'Delete',
      onClick: (_, data) => {
        setRowUpdating(data, 'delete');
      },
    }));
  } else {
    // use native edit
    editable.onRowUpdate = data => handleUpdate(data);
    editable.onRowDelete = data => handleDelete(data[idField]);
    editable.onRowAdd = data => handleAdd(data);
  }

  return (
    <MaterialTable
      title={title}
      isLoading={loading}
      data={tableData}
      components={components}
      columns={columns}
      options={{
        paging: false,
        search: false,
        addRowPosition: 'first',
        actionsColumnIndex: columns.length,
      }}
      editable={editable}
      actions={actions}
    />
  );
};

export default EditableTable;
