import { Portal, Document, Signup, Login } from "./screens";
import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect, Link} from "react-router-dom";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route path="/signup" render={() => <Signup></Signup>}></Route>
          <Route path="/login" component={Login}></Route>
          <Route path="/portal" component={Portal}/>
          <Route path="/document/:id" component={Document}/>
          <Route path="/"><Redirect to="/portal"/></Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
