import { AppBar, Button, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Auth } from 'aws-amplify';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  title: {
    flexGrow: 1,
  },
}));

const Header = ({ auth }) => {
  const classes = useStyles();

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          Omas Pride Raw Food Ordering
        </Typography>
        {auth && (
          <Typography variant="h6" className={classes.title}>
            Welcome, {auth.signInUserSession?.idToken?.payload?.name}
          </Typography>
        )}
        <Button type="button" color="inherit" onClick={() => Auth.signOut()}>
          LOG OUT
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
