import React, {Component} from "react";
import {Auth} from "aws-amplify";

import './Register.css';

class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            new_user: "",
            username: "",
        }
    }

    handleCreateUser = async e => {
        e.preventDefault();
        let username = document.getElementById('username').value;
        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;

        try {
            const user = await Auth.signUp({
                username: username,
                password: password,
                attributes: {
                    'email': email,
                }
            });
            console.log(user);
            this.setState({new_user: user});
            this.setState({username: username});
        } catch (e) {
            alert(e.message);
        }
        
    }

    handleConfirmationSubmit = async e => {
        e.preventDefault();
        let code = document.getElementById('code').value;

        try {
            await Auth.confirmSignUp(this.state.username, code);

            alert("SignUp Successful")
            this.props.history.push("/");
        } catch (e) {
            alert(e.message);
        }
    }

    render() {
        return (
            <div className="SignUp">
                {this.state.new_user === "" ? this.renderForm() : this.renderConfirmationForm()}
            </div>
        )
    }

    renderConfirmationForm() {
        return (
            <div className="login">
                <h1 className="hero-text">Email Confirmation Code</h1>
                <section className="hero-section smallPadding">
                <form id="confirmation-form" className="login__form" method="POST">
                    <div className="login__group">
                        <label className="field login__field">
                            <input id="code" name="code" type="text" className="r-text-input field__input" required/>
                            <span className="field__label-wrap">
                                <span className="field__label login__label">Confirmation Code</span>
                            </span>
                        </label>
                    </div>

                    <div className="login__group">
                        <button className="btn-primary r-button login__button" onClick={this.handleConfirmationSubmit}>Create an account</button>
                    </div>
                </form>
                </section>
            </div>
        );
    }

    renderForm() {
        return (
            <div className="login">
                <h1 className="hero-text">Create an account</h1>
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
                        <label className="field login__field">
                            <input id="email" name="email" type="email" className="r-text-input field__input" placeholder="Email" required/>
                            <span className="field__label-wrap">
                                <span className="field__label login__label">Email</span>
                            </span>
                            <span className="field__hint login__hint">e.g. testuser@sfu.ca</span>
                        </label>
                    </div>
                    <div className="login__group">
                        <label className="field login__field">
                            <input id="password" name="password" type="password" className="r-text-input field__input" placeholder="Password" required/>
                            <span className="field__label-wrap">
                      <span className="field__label login__label">Password</span>
                    </span>
                            <span className="field__hint login__hint">e.g. SecurePassword9!!</span>
                        </label>
                    </div>

                    <div className="login__group">
                        <button className="btn-primary login__button" onClick={this.handleCreateUser}>Create an account</button>
                    </div>
                </form>
                </section>
            </div>
        );
    }
}

export default Register;
