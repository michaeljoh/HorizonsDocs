
import React from "react";
import CreateForm from "../components/create";
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
      <div className="wrapper">
        <div className="form-larger">
          <h1> Welcome to the Portal </h1>
          <div> Create a document </div>
          <CreateForm clickHandler={this.createNewDoc} label="Create Document: " buttonLabel="Create" />
          <div> My Documents </div>
          <ul class="nobull">
            {!this.state.docs ? "LOADING" : this.state.docs.map(doc => (
              <li>
                <Link to={`/document/${doc._id}`}>{doc.title}</Link>
              </li>
            ))}
          </ul>
          <div> Add Shared Documents </div>
          <CreateForm label="Shared Link: " buttonLabel="Add" />
        </div>
      </div>
    );
  }
}

export default withRouter(Portal);
