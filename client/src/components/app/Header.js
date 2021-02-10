import { AppBar, Button, IconButton, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
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
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

const Header = ({ authData, onImpersonate, onSignOut, onToggleSidebar }) => {
  const classes = useStyles();
  const history = useHistory();

  const name = authData?.name || authData?.email;
  const impersonatingName = authData?.impersonatingName || authData?.impersonatingEmail;

  const handleSignOut = () => {
    onSignOut();
    history.push('/');
  };

  const handleStopImpersonating = () => {
    onImpersonate(null, false);
    history.push('/batches');
  };

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        {authData.authenticated && (
          <IconButton
            color="inherit"
            edge="start"
            onClick={onToggleSidebar}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" className={classes.title}>
          Omas Pride Ordering
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
          {authData.authenticated && (
            <Button
              type="button"
              variant="outlined"
              color="inherit"
              className={classes.button}
              onClick={handleSignOut}
            >
              LOG OUT
            </Button>
          )}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
