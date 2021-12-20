import React, {Component} from "react";
import {Auth} from "aws-amplify";

import './Register.css';

class ForgotPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
        }
    }

    handleGetCode = async e => {
        e.preventDefault();
        let username = document.getElementById('username').value;

        Auth.forgotPassword(username)
            .then(data => {
                console.log(data);
                this.setState({username: username});
            }).catch(err => {
                alert(err.message);
            });
        
    }

    handleConfirmationSubmit = async e => {
        e.preventDefault();
        let code = document.getElementById('code').value;
        let new_password = document.getElementById('password').value;

        Auth.forgotPasswordSubmit(this.state.username, code, new_password)
            .then(data => {
                console.log(data);
                alert("Change Password Successful")
                this.props.history.push("/");
            }).catch(err => {
                alert(err.message);
            });
    }

    render() {
        return (
            <div className="SignUp">
                {this.state.username === "" ? this.renderForm() : this.renderConfirmationForm()}
            </div>
        )
    }

    renderConfirmationForm() {
        return (
            <div className="login">
                <span className="login__name">Email Confirmation Code</span>
                <form id="confirmation-form" className="login__form" method="POST">
                    <div className="login__group">
                        <label className="field login__field">
                            Confirmation Code
                            <input id="code" name="code" type="text" className="r-text-input field__input" required/>
                        </label>
                    </div>

                    <div className="login__group">
                        <label className="field login__field">
                            <input id="password" name="password" type="password" className="r-text-input field__input" placeholder="Password" required/>
                            <span className="field__label-wrap">
                      <span className="field__label login__label">New Password</span>
                    </span>
                            <span className="field__hint login__hint">e.g. SecurePassword9!!</span>
                        </label>
                    </div>

                    <div className="login__group">
                        <button className="r-button login__button" onClick={this.handleConfirmationSubmit}>Change Password</button>
                    </div>
                </form>
            </div>
        );
    }

    renderForm() {
        return (
            <div className="login">
                <span className="hero-text login__name">Forgot Password</span>
                <section className="hero-section smallPadding">
                    <form id="register-form" className="login__form" method="POST">
                        <div className="login__group">
                            <label className="field login__field">
                                <input id="username" name="username" type="text" className="r-text-input field__input" placeholder="Username" required/>
                                <span className="field__label-wrap">
                                    <span className="field__label login__label">Username</span>
                                </span>
                                <span className="field__hint login__hint">e.g. testuser</span>
                            </label>
                        </div>
                        <div className="login__group">
                            <button className="btn-primary login__button" onClick={this.handleGetCode}>Get Email Confirmation Code</button>
                        </div>
                    </form>
                </section>
            </div>
        );
    }
}

export default ForgotPassword;
