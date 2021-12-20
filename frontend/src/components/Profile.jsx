import React, {Component} from "react";
import './Profile.css';
import './Register.css';
import '../config.js';
import './DropdownOptions.js';
import avatar from "../images/profile.png";
import {Auth, API} from "aws-amplify";
import ReactSpinner from 'react-bootstrap-spinner';

const daysOptions = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id:"",
            fname:"",
            lname:"",
            email:"",
            school:"",
            degree:"",
            year_in_school:"",
            department:"",
            major:"",
            available_date:"",
            loading: true
        };
        this.state.options = this.getDropdownBoxOptions();
        this.url = global.constants.api_root_url + "/profiles/"
    }

    async retrieveInfo() {
        console.log("In profile")
        if (!this.props.loggedIn) {
            alert("Please login fisrt!");
            this.props.history.push("/");
        }

        let query_profile_id = this.props.match.params.id;
        if(query_profile_id === null) {
            alert("Profile Not Found")
            // TODO route to 404
            this.props.history.push("/error404")
        }
        console.log('Query Id :' + query_profile_id);
        
        // query the server
        const currentSession = await Auth.currentSession();
        const token = currentSession.getIdToken().getJwtToken();

        API.get("mentorme", "/profile/" + query_profile_id, {
            headers: {
                "Authorization": token
            }
        }).then((res) => {
            let profile = JSON.parse(res.body);
            console.log(profile);
            this.setState({
                id: profile.id,
                fname:profile.first_name,
                lname:profile.last_name,
                email:profile.email,
                school:profile.school,
                degree:profile.degree,
                year_in_school:profile.year_in_school,
                department:profile.department,
                major:profile.major,
                available_date: profile.available_date,
                loading: false
            });
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

    componentWillReceiveProps(newProps) {
        console.log("new props:" , newProps);
        this.props = newProps;
        this.retrieveInfo();
    }

    componentDidMount() {
        this.retrieveInfo(); 
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
            <section className="hero-section smallPadding">
                <div className="container-fluid" >
                    <div className="row">
                        <div className="col-xl-10 offset-xl-1">
                            <div className="hero-text">
                                <h1>{this.state.fname} {this.state.lname}</h1>
                            </div>
                            <div className="row">
                                <div className="col-lg-8">
                                    <div className="hero-info">
                                        <h2>Profile Info</h2>
                                        <ul>
                                            <li><span>E-mail</span>{this.state.email}</li>
                                            <li>
                                                <span>School</span>
                                                {this.state.options.school.map((option, index) => {
                                                    if (option.value == this.state.school) { return option.text;} 
                                                    else { return null;}}).filter((ele) => {return ele != null;})
                                                }
                                            </li>
                                            <li><span>Degree</span>{this.state.degree}</li>
                                            <li><span>Years at School</span>{this.state.year_in_school}</li>
                                            <li>
                                                <span>Department</span>
                                                {this.state.options.department.map((option, index) => {
                                                    if (option.value == this.state.department) { return option.text;} 
                                                    else { return null;}}).filter((ele) => {return ele != null;})
                                                }
                                            </li>
                                            <li>
                                                <span>Major</span>
                                                {this.state.options.major.map((option, index) => {
                                                    if (option.value == this.state.major) { return option.text;} 
                                                    else { return null;}}).filter((ele) => {return ele != null;})
                                                }
                                            </li>
                                            <li><span>Available Date</span>{this.state.available_date}</li>    
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                <figure className="hero-image">
                                    <img src={avatar} alt="Profile Image"/>
                                </figure>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    getDropdownBoxOptions = () => {
        return global.dropdown_options; 
    }
}

class ProfileCreation extends Component {
    
    constructor(props) {
        super(props);
        this.state = this.getDropdownBoxOptions()
        this.url = global.constants.api_root_url + "/profiles/"
    }

    componentDidMount() {
        if (!this.props.loggedIn) {
            alert("Please login fisrt!")
            this.props.history.push("/");
        }
    }

    createProfile = async e => {
        console.log("Create Profile")
        e.preventDefault();

        const currentSession = await Auth.currentSession();
        const token = currentSession.getIdToken().getJwtToken();
        const user_name = sessionStorage.getItem("user_name");

        const form = document.getElementById('create-profile-form');
        let available_dates = daysOptions
            .map((cur, ind) => form['available_date_' + ind].checked ? 
                                form['available_date_' + ind].value : false)
            .filter(Boolean);
        let data = {
            'user_name': user_name,
            'first_name': form.first_name.value,
            'last_name': form.last_name.value,
            'email': form.email.value,
            'school': form.school.value,
            'degree': form.degree.value,
            'year_in_school': form.year_in_school.value,
            'department': form.department.value,
            'major': form.major.value,
            'available_date': available_dates.join(','),
        }

        await API.post("mentorme", "/profile", {
            body: data,
            headers: {
                "Authorization": token
            }
        }).then(() => {
            console.log("Create Profile Succeed")
            this.props.onProfileChange();
            this.props.history.push("/");
        }).catch(error => {
            if (error.response && error.response.data) {
                console.log(error.response.data.errorMessage)
                alert(error.response.data.errorMessage)
            } else {
                console.log(error)
                alert(error)
            }
        })
    }

    render() {
        let availableDateCheckBoxes = daysOptions.map((cur, ind) => {
            return (
                <div key={ind} className="checks" >
                    <label>
                        <input id={"available_date_" + ind} name="available_date" type="checkbox" name={cur} value={cur}/>{cur}
                    </label>
                </div>
            )
        });
        return (
            <div className="login">
                <h1 className="hero-text">Create Profile</h1>
                <section className="hero-section smallPadding">
                <form id="create-profile-form" className="login__form" >
                    <div className="login__group">
                        <label className="field login__field">
                            <input id="first_name" name="fname" type="text" className="r-text-input field__input"
                                    placeholder="First Name" required/>  
                            <span className="field__label-wrap">
                                <span className="field__label login__label">First Name</span>
                            </span>
                            <span className="field__hint login__hint">e.g. Marshall</span>
                        </label>
                    </div>

                    <div className="login__group">
                        <label className="field login__field">
                            <input id="last_name" name="lname" type="text" className="r-text-input field__input" placeholder="Last Name" required/>
                        <span className="field__label-wrap">
                            <span className="field__label login__label">Last Name</span>
                        </span>
                            <span className="field__hint login__hint">e.g. Mathers</span>
                        </label>
                    </div>

                    <div className="login__group">
                        <label className="field login__field">
                            <input id="email" name="email" type="email" className="r-text-input field__input" placeholder="E-mail" required/>
                            <span className="field__label-wrap">
                                <span className="field__label login__label">E-mail</span>
                            </span>
                            <span className="field__hint login__hint">e.g. abcd@sfu.ca</span>
                        </label>
                    </div>
                    <div className="col-md-6">
                    <div className="login__group">
                        <label className="field login__field mt-4"> 
                            <span className="mr-3 login__label">School</span> 
                            <select id="school"  className="mt-2" name="school">
                                {this.state.options.school.map((option, index) => {
                                        return (
                                            <option value={option.value}>{option.text}</option> 
                                        )       
                                    })}
                            </select>
                        </label>
                    </div>

                    <div className="login__group">
                        <label className="field login__field"> 
                            <span className="mr-3 login__label">Degree</span>
                            <select id="degree"  className="mt-2" name="degree">
                                {this.state.options.degree.map((option, index) => {
                                        return (
                                            <option value={option.value}>{option.text}</option> 
                                        )       
                                    })}
                            </select>
                        </label>
                    </div>

                    <div className="login__group">
                        <label className="field login__field"> 
                            <span className="mr-3 login__label">Year In School</span>
                            <select id="year_in_school"  className="mt-2" name="year_in_school">
                                {this.state.options.year_in_school.map((option, index) => {
                                        return (
                                            <option value={option.value}>{option.text}</option> 
                                        )       
                                    })}
                            </select>  
                        </label>
                    </div>

                    <div className="login__group">
                        <label className="field login__field">
                            <span className="mr-3 login__label">Department</span>
                            <select  id="department" className="mt-2" name="department">
                                {this.state.options.department.map((option, index) => {
                                        return (
                                            <option value={option.value}>{option.text}</option> 
                                        )       
                                    })}
                            </select> 
                        </label>
                    </div>

                    <div className="login__group">
                        <label className="field login__field">
                            <span className="mr-3 login__label">Major</span>
                            <select id="major" className="mt-2" name="major">
                                {this.state.options.major.map((option, index) => {
                                        return (
                                            <option value={option.value}>{option.text}</option> 
                                        )       
                                    })}
                            </select> 
                        </label>
                    </div>

                    <div className="login__group">
                        <label className="field login__field">
                            <span className="field_label-wrap">
                                <span className="mr-3 login__label">Available Date</span>
                            </span>
                            <div className="mt-2">
                                {availableDateCheckBoxes}
                            </div>
                        </label>
                    </div>
                    </div>
                    <div className="login__group">
                        <button className="btn-primary login__button" onClick={this.createProfile}>Create a profile</button>
                    </div>
                </form>
                </section>
            </div>
        );
    }

    getDropdownBoxOptions = () => {
        return {
            options: global.dropdown_options
        }
    }

}

export {Profile, ProfileCreation};
