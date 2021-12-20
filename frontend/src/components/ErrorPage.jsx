import React, {Component} from "react";
import './Profile.css';
import './Register.css';
import '../config.js'


class ErrorPage extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <section className="hero-section spad">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-xl-10 offset-xl-1">
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="hero-info">
                                        <h2>404 Not Found</h2>
                                        <ul>
                                            <li><span>Profile not found</span></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}


export default ErrorPage;
