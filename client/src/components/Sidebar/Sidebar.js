import { Drawer, List } from "@material-ui/core";
import {
  FormatSize as TypographyIcon,
  Home as HomeIcon
} from "@material-ui/icons";
import classNames from "classnames";
import React from "react";
import { withRouter } from "react-router-dom";
import SidebarLink from "./components/SidebarLink/SidebarLink";
import useStyles from "./styles";

const structure = [
  { id: 0, label: "Categories", link: "/app/categories", icon: <HomeIcon /> },
  {
    id: 1,
    label: "Catalog",
    link: "/app/catalog",
    icon: <TypographyIcon />
  }
];

function Sidebar({ location }) {
  var classes = useStyles();

  return (
    <Drawer
      variant="permanent"
      className={classNames(classes.drawer, classes.drawerOpen)}
      classes={{
        paper: classNames(classes.drawerOpen)
      }}
      open={true}
    >
      <div className={classes.toolbar} />
      <List className={classes.sidebarList}>
        {structure.map(link => (
          <SidebarLink
            key={link.id}
            location={location}
            isSidebarOpened={true}
            {...link}
          />
        ))}
      </List>
    </Drawer>
  );
}

export default withRouter(Sidebar);
