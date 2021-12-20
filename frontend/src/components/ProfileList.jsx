import React, {Component} from "react";
// import './Profile.css';
// import './Register.css';
import '../css/ProfileList.css';
import '../config.js';
import {Link} from "react-router-dom";

import {Auth, API} from "aws-amplify";
import ReactSpinner from 'react-bootstrap-spinner';

class ProfileList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            profiles: [],
            loading: true
        };
        this.profiles_api_endpoint = global.constants.api_root_url + "/profiles/"
    }

    async retrieveUsers() {
        if (!this.props.loggedIn) {
            alert("Please login fisrt!");
            this.props.history.push("/login");
        }

        const currentSession = await Auth.currentSession();
        const token = currentSession.getIdToken().getJwtToken();

        API.get("mentorme", "/profile", {
            headers: {
                "Authorization": token
            }
        }).then((res) => {
            console.log(res)
            let profiles = [];
            if (res.body !== "[]" && res.errorMessage === undefined){
                profiles = JSON.parse(res.body);
                this.setState({
                    profiles: profiles
                });
            } else {
                this.setState({
                    profiles: profiles
                });
            }
            this.setState({
                loading: false
            })            
        }).catch( error => {
            if (error.response && error.response.data) {
                console.log(error.response.data.errorMessage);
                alert(error.response.data.errorMessage);
            } else {
                console.log(error);
                alert(error);
            }
            
        });
    }

    componentDidMount() {
        this.retrieveUsers();
    }

    render() {
        if (this.state.loading) {
            return (
                <section className="match-profile-section">
                    <div className="loading-spinner">
                        <div className="text-center">
                            <ReactSpinner type="border" color="primary" size="5" />
                            <span className="sr-only">Loading...</span>
                        </div>  
                    </div> 
                </section>
            )
        }
        return (
            <section>
                <h1>All Public Profiles</h1>
                <section className="hero-section">
                    <div className="tbl-header">
                    <table cellPadding="0" cellSpacing="0" border="0">
                        <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>E-mail</th>
                            <th>School</th>
                            <th>Major</th>
                            <th>Link</th>
                        </tr>
                        </thead>
                    </table>
                    </div>
                    <div className="tbl-content">
                    <table cellPadding="0" cellSpacing="0" border="0">
                        <tbody>
                        {
                            this.state.profiles.map((profile, index)=> {
                                return (
                                    <tr key={profile.id}>
                                        <td> {profile.first_name}</td>
                                        <td> {profile.last_name}</td>
                                        <td> {profile.email}</td>
                                        <td> {profile.school}</td>
                                        <td> {profile.major}</td>
                                        <td> <Link to={"/profile/" + profile.id}>Link</Link></td>
                                    </tr>
                                )
                            })
                        }
                        
                        </tbody>
                    </table>
                    </div>
                    </section>
            </section>
        );
    }
}


export default ProfileList;
