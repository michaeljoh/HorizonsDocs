import React from "react";
import CreateForm from "../components/create";
<<<<<<< HEAD
import { Link, BrowserRouter as Router, withRouter } from "react-router-dom";

class Portal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      docs: null
    }
  }

  async componentDidMount() {
    let docs = await fetch(process.env.REACT_APP_CONNECTION_URL + "/documents", {
      method: "GET",
      credentials: 'include',
      redirect: "follow",
    })
    let response = await docs.json();
    console.log("MY DOCS: ", response)

    this.setState({ docs: response });
  }


  async createNewDoc(title) {
    const data = await fetch(process.env.REACT_APP_CONNECTION_URL + "/newDoc", {
      method: "POST",
      credentials: 'include',
      redirect: "follow",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title
      })
    })

    const response = await data.json();
    return response;
  }

  render() {
    return (
      <div>
        <div> Welcome to the Portal </div>
        <div> Create a document </div>
        <CreateForm clickHandler={this.createNewDoc} label="Create Document: " buttonLabel="Create" />
        <div> My Documents </div>
        <ul>
          {!this.state.docs ? "LOADING" : this.state.docs.map(doc => (
            <li>
              <Link to={`/document/${doc._id}`}>{doc.title}</Link>
            </li>
          ))}
        </ul>
        <div> Add Shared Documents </div>
        <CreateForm label="Shared Link: " buttonLabel="Add" />
=======
import "../styles/portal.css";

import { Link, BrowserRouter as Router } from "react-router-dom";

function Portal() {
  // TEST dummy data
  let data = [
    { title: "Hello" },
    { title: "My" },
    { title: "Name" },
    { title: "Jeff" },
    { title: "Gotti" }
  ];
  return (
    <Router>
      <h1> My Documents </h1>
      <div class="container">
        <div id="createDoc">
          <h2> Create a document </h2>
          <CreateForm label="Create Document: " buttonLabel="Create" />
        </div>
        <div>
          <h2> My Documents </h2>
          <ul>
            {data.map(doc => (
              <li>
                <Link to={`/${doc.title}`}>{doc.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div id="createDoc">
          <h2> Add Shared Documents </h2>
          <CreateForm label="Shared Link: " buttonLabel="Add" />
        </div>
>>>>>>> 3456a75342357b718225cce4f7bfee2b18e3c9fd
      </div>
    );
  }
}

export default withRouter(Portal);
