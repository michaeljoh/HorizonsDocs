import { Portal, Document, Signup, Login } from "./screens";
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
        <Route exact path="/signup" render={() => <Signup></Signup>}></Route>
        <Route path="/login" render={() => <Login></Login>}></Route>
        <Route path="/document" render={() => <Document></Document>}></Route>
      </Router>
    );
  }
}

export default App;
