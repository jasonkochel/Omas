import { TextField } from '@material-ui/core';
import MaterialTable from 'material-table';
import React, { useCallback, useEffect, useState } from 'react';

const noop = () => {};

const EditableTable = ({
  title,
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

  const WideTextField = props => (
    <TextField
      value={props.value}
      fullWidth={true}
      onChange={e => props.onChange(e.target.value)}
    />
  );

  return (
    <MaterialTable
      title={title}
      isLoading={loading}
      data={tableData}
      columns={columns.map(c => {
        return { ...c, editComponent: props => WideTextField(props) };
      })}
      options={{
        paging: false,
        search: false,
        addRowPosition: 'first',
        actionsColumnIndex: columns.length,
      }}
      editable={{
        onRowAdd: data => handleAdd(data),
        onRowUpdate: data => handleUpdate(data),
        onRowDelete: data => handleDelete(data[idField]),
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
