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
    return onUpdate(data)
      .then(res => setTableData(tableData.map(c => (c[idField] === res[idField] ? res : c))))
      .catch(noop);
  };

  const handleDelete = id => {
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

  const components = {
    EditField: props => WideTextField(props),
  };

  if (EditComponent) {
    components.EditRow = props => <EditComponent {...props} />;
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
      editable={{
        onRowUpdate: data => handleUpdate(data),
        onRowDelete: data => handleDelete(data[idField]),
        onRowAdd: data => handleAdd(data),
      }}
      actions={[
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
      ]}
    />
  );
};

export default EditableTable;
