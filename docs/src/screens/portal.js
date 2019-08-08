  import React from "react";
import  CreateForm  from "../components/create";
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
      <div class="portalContainer">
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
      </div>
    </Router>
  );
}

export default Portal;
