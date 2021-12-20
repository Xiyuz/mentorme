import React, {Component} from 'react';
import './MatchedProfiles.css';
import '../config.js'
import { Link } from 'react-router-dom';
import {Auth, API} from "aws-amplify";
import ReactSpinner from 'react-bootstrap-spinner';

const email_subj = 'I found you on MentorMe';
const email_body_msg = encodeURI(',\n\nWould you like to become my mentor? Checkout my profile at');

class MatchedProfiles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profile_id:"",
            profile_fname:"",
            profile_lname:"",
            available_date:"",
            match_profiles:[],
            loading: true
        };
        this.url = global.constants.api_root_url + "/all-match-mentors/"
        this.profile_url = global.constants.api_root_url + "/profiles/"
    }

    async retrieveInfo() {
        const currentSession = await Auth.currentSession();
        const token = currentSession.getIdToken().getJwtToken();
        const user_name = sessionStorage.getItem("user_name");

        if (user_name == null) {
            alert("Please login fisrt!")
            this.props.history.push("login");
        }
        
        //Get Profile Info
        const res = await API.get("mentorme", "/profile", {
            headers: {
                "Authorization": token
            },
            queryStringParameters: {
                "user_name": user_name
            }
        });

        let profiles = [];
        if (res.body !== "[]"){
            profiles = JSON.parse(res.body);
        }
        
        if (profiles.length === 0) {
            alert("You need to create a profile first");
            this.props.history.push("/profile/create");
        } else {
            const profile = profiles[0];
            this.setState({
                profile_id: profile.id,
                profile_fname: profile.first_name,
                profile_lname: profile.last_name,
                available_date: profile.available_date
            });
    
            
            // Get Matched Profile Info
            const match_res = await API.get("mentorme", "/all-match-mentors/" + this.state.profile_id, {
                headers: {
                    "Authorization": token
                }
            });
            console.log("matchin response:", match_res)
            console.log(match_res.body)
            const match_data = JSON.parse(match_res.body);
            
            if (match_data === null || match_data === undefined) {
                alert("ERROR: retrieving matched profiles failed.");
                this.prop.history.push("/profile");
            }
    
            const all_profiles = match_data.suggested_profiles;
            
            this.setState({
                match_profiles: all_profiles,
                loading: false
            });
        }
                 
        
    }

    componentDidMount() {
        this.retrieveInfo();    
    }

    render() {
        let render_profile = this.state.match_profiles.map((cur, ind) => {
            let link_to_profile = encodeURI(`\n\n${window.location.protocol}//${window.location.hostname}/profile/${this.state.profile_id}`);
            let email_signature = encodeURI(`\n\n${this.state.profile_fname} ${this.state.profile_lname}`);
            let mail_to_link = `mailto:${cur.email}?subject=${email_subj}&body=Hello ${cur.full_name}${email_body_msg}${link_to_profile}${email_signature}`;
            return (
                <div key={ind} className="col-sm-6 py-2 match-profile-info">
                    <div className="card card-body h-30 hero-section">
                        <h3 className="card-title">
                            <Link to={"/profile/" + cur.id}>
                                <div className="mentor-profile-link"> {cur.full_name}</div>
                            </Link>
                        </h3>
                        <ul>
                            <li><span>School: </span>{cur.school}</li>
                            <li><span>Major:</span>{cur.major}</li>
                            <li><span>Email: </span>{cur.email}</li>
                        </ul>
                        <div className="row">
                            <div className="col-lg-6">
                                <a className="btn btn-primary notify__button" href={mail_to_link}>Notify</a>
                            </div>
                            <div className="col-lg-6">
                                <button className="btn btn-secondary appointment__button" href="" disabled="disabled">Schedule</button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        });
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

        if (this.state.match_profiles.length === 0) {
            return (
                <section className="match-profile-section">
                    <div className="match-profile-title">
                        <h1>No matched mentors</h1>
                    </div>
                <div className="match-profile-container">
                    <p>
                        Sorry, we haven't found any matched mentors. Select more available dates to increase your matching chance.&nbsp;
                        <Link to='/profile_list'>View all profiles</Link>
                    </p>
                </div>
            </section>
            )
        }
        return (
            <section className="match-profile-section">
                <div className="match-profile-title">
                    <h1>We found your mentors</h1>
                </div>
                <div className="container match-profile-container">
                    <div className="row">
                        {render_profile}
                    </div>            
                </div>
            </section>
    );
    }
}
export {MatchedProfiles};
