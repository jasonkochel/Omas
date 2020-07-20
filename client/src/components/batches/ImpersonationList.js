import { Button, makeStyles } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import React from 'react';
import { useQuery } from 'react-query';
import { useHistory } from 'react-router-dom';
import api from '../../api';
import StyledTable from '../shared/StyledTable';

const useStyles = makeStyles(theme => ({
  paddedButton: {
    marginBottom: '15px',
  },
}));

const ImpersonationList = ({ onImpersonate }) => {
  const history = useHistory();
  const classes = useStyles();

  const { isLoading, data } = useQuery('UserList', api.getUsers);

  const handleImpersonate = async data => {
    await onImpersonate(data.userId, true);
    history.push('/order');
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        className={classes.paddedButton}
        startIcon={<ArrowBack />}
        onClick={() => history.goBack()}
      >
        Back
      </Button>

      <StyledTable
        title="Select a User to Impersonate"
        isLoading={isLoading}
        data={data}
        columns={[
          { title: 'Name', field: 'name' },
          { title: 'Email', field: 'email' },
        ]}
        options={{ actionsColumnIndex: 2 }}
        actions={[
          rowData => ({
            icon: 'person',
            tooltip: 'Impersonate',
            onClick: (_, data) => handleImpersonate(data),
          }),
        ]}
      />
    </>
  );
};

export default ImpersonationList;
