import { makeStyles, TextField, useTheme } from '@material-ui/core';
import MaterialTable, { MTableToolbar } from 'material-table';
import React from 'react';
import { queryCache, useMutation, useQuery } from 'react-query';

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
  queryKey,
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

  const { isLoading, data: tableData } = useQuery(queryKey, getData, { staleTime: Infinity });

  const [handleAdd] = useMutation(onAdd, {
    onSuccess: res => queryCache.setQueryData(queryKey, oldData => [res, ...oldData]),
  });

  const [handleUpdate] = useMutation(onUpdate, {
    onSuccess: res =>
      queryCache.setQueryData(queryKey, oldData =>
        oldData.map(row => (row[idField] === res[idField] ? res : row))
      ),
  });

  const [handleDelete] = useMutation(onDelete, {
    onSuccess: (_, id) =>
      queryCache.setQueryData(queryKey, oldData => oldData.filter(row => row[idField] !== id)),
  });

  const handleMoveUp = data => {
    return onMoveUp(data[idField]).then(() => queryCache.invalidateQueries(queryKey));
  };

  const handleMoveDown = data => {
    return onMoveDown(data[idField]).then(() => queryCache.invalidateQueries(queryKey));
  };

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
      isLoading={isLoading}
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
          onClick: (_, data) => handleMoveUp(data),
          disabled: rowData.tableData.id === 0,
        }),
        rowData => ({
          icon: 'keyboard_arrow_down',
          tooltip: 'Move Down',
          onClick: (_, data) => handleMoveDown(data),
          disabled: rowData.tableData.id === tableData.length - 1,
        }),
      ]}
    />
  );
};

export default EditableTable;
