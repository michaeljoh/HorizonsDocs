import {Portal, Document, Signup} from "./screens";
import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <Route path="/" render={() => <Signup></Signup>}></Route>
      </Router>
    );
  }
}

export default App;
