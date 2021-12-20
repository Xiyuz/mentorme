import '../css/Login.css';
import React, { Component } from "react";
import {Auth, API} from "aws-amplify";
import { Link } from "react-router-dom";

class Login extends Component {
  constructor(props) {
    super(props);
    this.url = global.constants.api_root_url + "/api/token/"
  }

  loginPressed = async e => {
    e.preventDefault();
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value

    try {
      const user = await Auth.signIn(username, password);
      console.log("Login Succeeded");
      this.props.onAuthChange(true);
      console.log(user);
      sessionStorage.clear();
      sessionStorage.setItem('user_name', user.username);

      this.props.onAuthChange(true);
    } catch (e) {
      this.props.onAuthChange(false);
      alert(e.message);
    }
  };

  render() {

    return (
      <div className="container mt-1 pt-1">
        <div className="card mx-auto border-0">
          <div className="card-header border-bottom-0 bg-transparent"></div>
          <div className="card-body pb-4">
            <form id="login-form">
              <div className="form-group">
                <input
                  type="text"
                  name="username"
                  className="form-control"
                  id="username"
                  placeholder="Username"
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  id="password"
                  placeholder="Password"
                  required
                />
              </div>

              <div className="text-center pt-4">
                <button type="submit" className="btn btn-primary btn-login" onClick={this.loginPressed}>
                  Login
                </button>
              </div>

              <div className="text-center pt-2">
                <Link to='/forgotPassword'>
                  <div className="btn btn-link text-primary">
                    Forgot Your Password
                </div>
                </Link>
              </div>

              <div className="text-center pt-2">
                <Link to='/register'>
                  <div className="btn btn-link text-primary">
                    Register
                </div>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
