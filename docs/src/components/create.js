import React from "react";
import { withRouter, Link } from "react-router-dom";

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

  handleSubmit(event) {
    event.preventDefault();
    this.props.history.push(`/${this.state.value}`);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          {this.props.label}
          <input
            type="text"
            value={this.state.value}
            onChange={this.handleChange}
          />
        </label>
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
