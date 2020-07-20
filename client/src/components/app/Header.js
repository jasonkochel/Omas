import { AppBar, Button, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Auth } from 'aws-amplify';
import React from 'react';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  title: {
    flexGrow: 1,
  },
  button: {
    marginLeft: '10px',
  },
}));

const Header = ({ authData, onImpersonate }) => {
  const classes = useStyles();
  const history = useHistory();

  const name = authData?.name || authData?.email;
  const impersonatingName = authData?.impersonatingName || authData?.impersonatingEmail;

  const handleStopImpersonating = () => {
    onImpersonate(null, false);
    history.push('/batches');
  };

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
        <Typography variant="h6">
          {impersonatingName && (
            <Button
              type="button"
              variant="outlined"
              color="inherit"
              onClick={handleStopImpersonating}
            >
              STOP IMPERSONATING
            </Button>
          )}
          <Button
            type="button"
            variant="outlined"
            color="inherit"
            className={classes.button}
            onClick={() => Auth.signOut()}
          >
            LOG OUT
          </Button>
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
