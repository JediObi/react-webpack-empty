import React from "react";
import { Route, Switch } from "react-router-dom";
import UserList from "./components/userlist/UserList";
import UserDetail from "./components/userdetail/UserDetail";

export default () => {
  return (
    <Switch>
      <Route exact path="/" component={UserList}></Route>
      <Route path="/detail/:userId" component={UserDetail}></Route>
    </Switch>
  );
};
