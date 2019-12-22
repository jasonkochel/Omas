import classnames from "classnames";
import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import Typography from "../Typography/Typography";
import useStyles from "./styles";

function Layout(props) {
  var classes = useStyles();

  return (
    <div className={classes.root}>
      <Header history={props.history} />
      <Sidebar />
      <div className={classnames(classes.content, classes.contentShift)}>
        <div className={classes.fakeToolbar} />
        <Switch>
          <Route path="/app/categories" component={Typography} />
        </Switch>
      </div>
    </div>
  );
}

export default withRouter(Layout);
