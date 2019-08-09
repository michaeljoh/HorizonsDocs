import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import "../styles/register.css";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: null,
      password: null,
      loggedIn: false
    };
  }

  handleSubmit = async e => {
    e.preventDefault();

    console.log(`
        --Logging in--
        Email: ${this.state.email}
        Password: ${this.state.password}
      `);
    let data = {
      email: this.state.email,
      password: this.state.password
    };

    // HANDLE LOGIN FETCH
    console.log(process.env);
    const response = await fetch(
      process.env.REACT_APP_CONNECTION_URL + "/login",
      {
        method: "POST",
        credentials: "include",
        redirect: "follow",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      }
    );
    const responseJSON = await response.json();
    if (responseJSON.success) this.setState({ loggedIn: true });
  };

  handleChange = e => {
    e.preventDefault();
    const { name, value } = e.target;
    this.setState({ [name]: value }, () => console.log(this.state));
  };

  render() {
    if (this.state.loggedIn) return <Redirect to="/portal" />;
    return (
      <div className="wrapper">
        <div className="form-wrapper">
          <h1>Login</h1>
          <form onSubmit={this.handleSubmit}>
            <div className="email">
              <label htmlFor="email">Email</label>
              <input
                placeholder="Email"
                type="email"
                name="email"
                onChange={this.handleChange}
              />
            </div>
            <div className="password">
              <label htmlFor="password">Password</label>
              <input
                placeholder="Password"
                type="password"
                name="password"
                onChange={this.handleChange}
              />
            </div>
            <div className="createAccount">
              <button type="submit">Login</button>
              <a href="/signup">Dont Have an Account?</a>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
