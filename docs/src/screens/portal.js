import React from "react";
import  CreateForm  from "../components/create";
import { Link, BrowserRouter as Router } from "react-router-dom";

function Portal() {
  // TEST dummy data
  let data = [{ title: "Hello" }, { title: "My" }, { title: "Name" }, { title: "Jeff" }, { title: "Gotti" }];
  return (
    <Router>
      <div>
        <div> Welcome to the Portal </div>
        <div> Create a document </div>
        <CreateForm label="Create Document: " buttonLabel="Create" />
        <div> My Documents </div>
        <ul>
          {data.map(doc => (
            <li>
              <Link to={`/${doc.title}`}>{doc.title}</Link>
            </li>
          ))}
        </ul>
        {/* {data.map(doc => <div>{doc.title}</div>)} */}
        <div> Add Shared Documents </div>
        <CreateForm label="Shared Link: " buttonLabel="Add" />
      </div>
    </Router>
  );
}

export default Portal;
