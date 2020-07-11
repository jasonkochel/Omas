import { makeStyles, TextField, useTheme } from '@material-ui/core';
import MaterialTable, { MTableToolbar } from 'material-table';
import React, { useCallback, useEffect, useState } from 'react';
import fns from '../../fns';
//import {useQuery, queryCache} from 'react-query'

const useStyles = makeStyles(theme => ({
  toolbarWrapper: {
    '& .MuiToolbar-root': {
      backgroundColor: theme.palette.primary.main,
      color: 'white',
    },
    '& .MuiIconButton-root': {
      color: 'white',
    },
  },
}));

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
  const classes = useStyles();
  const theme = useTheme();

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  //const { isLoading, isError, data, error } = useQuery('data', getData);

  const _getData = useCallback(() => {
    getData()
      .then(data => setTableData(data))
      .catch(() => setTableData([]))
      .finally(() => setLoading(false));
  }, [getData]);

  const handleAdd = data => {
    return onAdd(data)
      .then(res => setTableData([res, ...tableData]))
      .catch(fns.noop);
  };

  const handleUpdate = data => {
    return onUpdate(data)
      .then(res => setTableData(tableData.map(c => (c[idField] === res[idField] ? res : c))))
      .catch(fns.noop);
  };

  const handleDelete = id => {
    return onDelete(id)
      .then(() => setTableData(tableData.filter(c => c[idField] !== id)))
      .catch(fns.noop);
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
    Toolbar: props => (
      <div className={classes.toolbarWrapper}>
        <MTableToolbar {...props} />
      </div>
    ),
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
        headerStyle: {
          backgroundColor: theme.palette.grey['200'],
        },
      }}
      style={{ margin: '0 0 20px 0' }}
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
