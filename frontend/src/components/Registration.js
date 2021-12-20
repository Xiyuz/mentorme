import React, { Component } from "react";

export class Registration extends Component {
    render() {
        return (
            <div className="login">
                <span className="login__name">Create an account</span>
                <form className="login__form">
                    <div className="login__group">
                        <label className="field login__field">
                            <input type="text" className="r-text-input field__input" placeholder="Username" required/>
                            <span className="field__label-wrap">
                                <span className="field__label login__label">Username</span>
                            </span>
                            <span className="field__hint login__hint">e.g. FatXiyu999</span>
                        </label>
                    </div>
                    <div className="login__group">
                        <label className="field login__field">
                            <input type="email" className="r-text-input field__input" placeholder="E-mail" required/>
                            <span className="field__label-wrap">
                                <span className="field__label login__label">E-mail</span>
                            </span>
                            <span className="field__hint login__hint">e.g. XiyuZhang@sfu.gg</span>
                        </label>
                    </div>
                    <div className="login__group">
                        <label className="field login__field">
                            <input type="password" className="r-text-input field__input" placeholder="Password" required/>
                            <span className="field__label-wrap">
                                <span className="field__label login__label">Password</span>
                            </span>
                            <span className="field__hint login__hint">e.g. GoodPass1234!@#$</span>
                        </label>
                        <div className="login__group">
                            <button className="r-button login__button">Create an account</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default Registration;