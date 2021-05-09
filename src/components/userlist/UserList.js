import React, { Component } from "react";
import { Link } from "react-router-dom";

class UserList extends Component {
  render() {
    return (
      <div>
        <ul>
          <li>
            <div>
              <Link to="/detail/1">用户1</Link>
            </div>
          </li>
          <li>
            <div>
              <Link to="/detail/2">用户2</Link>
            </div>
          </li>
        </ul>
      </div>
    );
  }
}

export default UserList;
