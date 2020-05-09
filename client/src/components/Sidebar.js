import { Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AddShoppingCart, Category, DateRange, History, LocalOffer, PlaylistAddCheck } from '@material-ui/icons';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
    marginTop: 64,
  },
}));

function ListItemLink(props) {
  const { icon, primary, to } = props;

  const renderLink = React.useMemo(
    () => React.forwardRef((itemProps, ref) => <RouterLink to={to} ref={ref} {...itemProps} />),
    [to]
  );

  return (
    <li>
      <ListItem button component={renderLink}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
}

const Sidebar = () => {
  const classes = useStyles();

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.drawerContainer}>
        <List>
          <ListItemLink to="/order" primary="Place an Order" icon={<AddShoppingCart />} />
          <ListItemLink to="/history" primary="View Order History" icon={<History />} />
        </List>
        <Divider />
        <List>
          <ListSubheader>Administration</ListSubheader>
          <ListItemLink to="/admin" primary="Order Cycles" icon={<DateRange />} />
          <ListItemLink to="/admin" primary="View Orders" icon={<PlaylistAddCheck />} />
          <ListItemLink to="/admin" primary="Manage Items" icon={<LocalOffer />} />
          <ListItemLink to="/categories" primary="Manage Categories" icon={<Category />} />
        </List>
      </div>
    </Drawer>
  );
};

export default Sidebar;
