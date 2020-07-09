import { makeStyles, useTheme } from '@material-ui/core';
import MaterialTable, { MTableToolbar } from 'material-table';
import React from 'react';

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

const StyledTable = props => {
  const classes = useStyles();
  const theme = useTheme();

  const { components: passedComponents, options: passedOptions, ...passedProps } = props;

  const components = {
    ...passedComponents,
    Toolbar: props => (
      <div className={classes.toolbarWrapper}>
        <MTableToolbar {...props} />
      </div>
    ),
  };

  const options = {
    paging: false,
    search: false,
    headerStyle: {
      backgroundColor: theme.palette.grey['200'],
    },
    ...passedOptions,
  };

  return (
    <MaterialTable
      components={components}
      {...passedProps}
      style={{ margin: '0 0 20px 0' }}
      options={options}
    />
  );
};

export default StyledTable;
