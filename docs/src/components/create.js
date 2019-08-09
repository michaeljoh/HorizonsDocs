import React from "react";
import { withRouter, Link } from "react-router-dom";
import "../styles/portal.css";

class CreateForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: "" };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  async handleSubmit(event) {
    event.preventDefault();

    if (this.state.value !== "") {
      let response = await this.props.clickHandler(this.state.value);
      if (response.success) {
        this.props.history.push(`/document/${response.id}`)
      }
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} class="inputLine">
          <label class="jello">{this.props.label}</label>
          <input
            class="inputBox"
            type="text"
            value={this.state.value}
            onChange={this.handleChange}
          />
          <Link
            onClick={this.handleSubmit}
            value={this.props.buttonLabel}
            to={`/${this.state.value}`}
          >
            Create
          </Link>
      </form>
    );
  }
}

export default withRouter(CreateForm);
