import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Layout } from "antd";
import createRoutes from "./routes";
import { BrowserRouter as Router } from "react-router-dom";

const { Header, Content, Footer } = Layout;
const routes = createRoutes();

class App extends Component {
  render() {
    return (
      <Router>
        <Layout>
          <Header></Header>
          <Content>
            <div>
              <Link to="/">用户列表</Link>
            </div>
            {routes}
          </Content>
          <Footer></Footer>
        </Layout>
      </Router>
    );
  }
}

export default App;
