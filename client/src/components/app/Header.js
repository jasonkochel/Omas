import { AppBar, Button, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Auth } from 'aws-amplify';
import React from 'react';

const useStyles = makeStyles(theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  title: {
    flexGrow: 1,
  },
}));

const Header = ({ authData }) => {
  const classes = useStyles();
  const name = authData?.payload?.name ?? authData?.payload?.email;
  const impersonatingName = authData?.impersonation?.name ?? authData?.impersonation?.email;

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          Omas Pride Raw Food Ordering
        </Typography>
        {name && (
          <Typography variant="h6" className={classes.title}>
            Welcome, {name}
            {impersonatingName && ` (On Behalf of ${impersonatingName})`}
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
