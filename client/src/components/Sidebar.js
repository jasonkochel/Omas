import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AddShoppingCart, Category, DateRange, History, LocalOffer } from '@material-ui/icons';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

// TODO: make responsive (https://material-ui.com/components/drawers/#responsive-drawer)

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
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
          <ListItemLink to="/batches" primary="Manage Ordering" icon={<DateRange />} />
          <ListItemLink to="/catalog" primary="Manage Catalog" icon={<LocalOffer />} />
          <ListItemLink to="/categories" primary="Manage Categories" icon={<Category />} />
        </List>
      </div>
    </Drawer>
  );
};

export default Sidebar;
