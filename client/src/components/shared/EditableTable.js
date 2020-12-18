import { makeStyles, TextField, useTheme } from '@material-ui/core';
import MaterialTable, { MTableToolbar } from 'material-table';
import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

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
  <TextField
    value={props.value || ''}
    fullWidth={true}
    onChange={e => props.onChange(e.target.value)}
  />
);

const EditableTable = ({
  queryKey,
  title,
  EditComponent,
  columns,
  actions,
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
  const queryClient = useQueryClient();

  const { isLoading, data: tableData } = useQuery(queryKey, getData, {
    cacheTime: 0, // re-fetch every time the screen loads, so latest savedOrder is respected
    staleTime: Infinity, // never re-fetch after initial fetch (per screen load)
  });

  const { mutateAsync: handleAdd } = useMutation(onAdd, {
    onSuccess: res => queryClient.setQueryData(queryKey, oldData => [res, ...oldData]),
  });

  const { mutateAsync: handleUpdate } = useMutation(onUpdate, {
    onSuccess: res =>
      queryClient.setQueryData(queryKey, oldData =>
        oldData.map(row => (row[idField] === res[idField] ? res : row))
      ),
  });

  const { mutateAsync: handleDelete } = useMutation(onDelete, {
    onSuccess: (_, id) =>
      queryClient.setQueryData(queryKey, oldData => oldData.filter(row => row[idField] !== id)),
  });

  const handleMoveUp = data => {
    return onMoveUp(data[idField]).then(() => queryClient.invalidateQueries(queryKey));
  };

  const handleMoveDown = data => {
    return onMoveDown(data[idField]).then(() => queryClient.invalidateQueries(queryKey));
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

  const allActions = actions ? [...actions] : [];

  allActions.push(rowData => ({
    icon: 'keyboard_arrow_up',
    tooltip: 'Move Up',
    onClick: (_, data) => handleMoveUp(data),
    disabled: rowData.tableData.id === 0,
  }));

  allActions.push(rowData => ({
    icon: 'keyboard_arrow_down',
    tooltip: 'Move Down',
    onClick: (_, data) => handleMoveDown(data),
    disabled: rowData.tableData.id === tableData.length - 1,
  }));

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
      actions={allActions}
    />
  );
};

export default EditableTable;
