import { Portal, Document, Signup, Login } from "./screens";
import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <Route exact path="/signup" render={() => <Signup />}></Route>
        <Route path="/login" render={() => <Login />}></Route>
        <Route path="/portal" render={() => <Portal />}></Route>
        <Route path="/document" render={() => <Document />}></Route>
      </Router>
    );
  }
}

export default App;
