import { Container, makeStyles, Paper } from '@material-ui/core';
import MUIRichTextEditor from 'mui-rte';
import React from 'react';
import { useQuery } from 'react-query';
import api from '../../api';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: '20px',
  },
}));

const Welcome = () => {
  const classes = useStyles();

  const { isLoading, data } = useQuery('Settings', api.getSettings);

  if (isLoading) return null;

  return (
    <Container>
      <Paper className={classes.paper}>
        <MUIRichTextEditor
          id="welcomeEditor"
          defaultValue={data.welcomeMessage}
          readOnly={true}
          toolbar={false}
        />
      </Paper>
    </Container>
  );
};

export default Welcome;
