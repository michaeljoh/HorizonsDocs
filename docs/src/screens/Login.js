import React, { Component } from "react";
import "../styles/register.css";

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: null,
            password: null,
        };
    }

    handleSubmit = async e => {
        e.preventDefault();


        console.log(`
        --Logging in--
        First Name: ${this.state.firstName}
        Last Name: ${this.state.lastName}
        Email: ${this.state.email}
        Password: ${this.state.password}
      `);
        let data = {
            email: this.state.email,
            password: this.state.password,
        }

        const response = await fetch(process.env.CONNECTION_URL + "/login", {
            method: "POST",
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })

        console.log("FETCHED!!", await response.text())
    };

    handleChange = e => {
        e.preventDefault();
        const { name, value } = e.target;
        this.setState({ [name]: value }, () => console.log(this.state));
    };

    render() {
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
                            <small>Dont Have an Account?</small>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default Login;