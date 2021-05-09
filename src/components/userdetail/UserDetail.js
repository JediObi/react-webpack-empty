import React, { Component } from "react";
import "./UserDetail.css";

class UserDetail extends Component {
  constructor(props) {
      super(props);
  }

  render() {
    return (
      <div>
        <img src="/images/user.png" width="20" height="20" alt="" />
        <p className="self-text">this is user{this.props.match.params.userId}</p>
      </div>
    );
  }
}

export default UserDetail;
