import { Container, makeStyles, Paper, Typography } from '@material-ui/core';
import React from 'react';
import { useQuery } from 'react-query';
import api from '../../api';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: '20px',
  },
  message: {
    '& p': {
      paddingBottom: '10px',
    },
  },
}));

const Welcome = () => {
  const classes = useStyles();

  const { isLoading, data } = useQuery('Settings', api.getSettings);

  if (isLoading) return null;

  return (
    <Container>
      <Paper className={classes.paper}>
        <Typography variant="body1" component="div">
          <div
            className={classes.message}
            dangerouslySetInnerHTML={{ __html: data.welcomeMessageHtml }}
          />
        </Typography>
      </Paper>
    </Container>
  );
};

export default Welcome;
