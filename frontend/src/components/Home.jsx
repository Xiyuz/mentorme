import React, { Component } from 'react';
import {Link} from "react-router-dom";
import Login from './Login.jsx';
import "./Profile.css";
import "../config";
import "./DropdownOptions.js";
import avatar from "../images/profile.png";
import connect from "../images/connect.png";

import {Auth, API} from "aws-amplify";

const daysOptions = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export default class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: "",
      first_name: "",
      last_name: "",
      email: "",
      school: "",
      degree: "",
      year_in_school: "",
      department: "", 
      major: "",
      available_date: "",
      readonly: true
    };
    this.state.options = this.getDropdownBoxOptions();
    this.forwardToMatchMentorPage.bind(this);
    this.reloadProfile.bind(this);
    this.updateProfile.bind(this);
    this.setAvailableDate.bind(this);
  }

  reloadProfileFromProps() {
    if (this.props.currentProfiles != null && this.props.currentProfiles.length > 0) {
      let currentProfile = this.props.currentProfiles[0];
      this.setState({
        id: currentProfile.id,
        first_name: currentProfile.first_name,
        last_name: currentProfile.last_name,
        email: currentProfile.email,
        school: currentProfile.school,
        degree: currentProfile.degree,
        year_in_school: currentProfile.year_in_school,
        department: currentProfile.department,
        major: currentProfile.major,
        available_date: currentProfile.available_date,
      });
    } else if (this.props.currentProfiles != null) {
      this.setState({
        id: "",
        first_name: "",
        last_name: "",
        email: "",
        school: "",
        degree: "",
        year_in_school: "",
        department: "", 
        major: "",
        available_date: "",
      });
    }
  }
  
  componentDidMount() {
    console.log("Home Page Mount")
    this.setState({readonly: true});
    this.reloadProfileFromProps();
  }

  componentWillReceiveProps(newProps) {
    this.props = newProps;
    this.reloadProfileFromProps();
  }

  render() {
    return (
      <main>
        <section>
          <aside>{this.props.loggedIn === true ? this.loggedInView() : this.loggedOutView()}</aside>
        </section>
      </main>
    );
  }

  loggedOutView() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-6 col-md-6">
            <div className="hero-text" >
              <h4 className="h4-welcome">Welcome to MentorMe</h4>
            </div>
            <div className="hero-text intro-text">
              <p>MentorMe is a peer-to-peer mentorship platform for students. Join us today to connect, meet and learn from your peers.
              </p>
            </div>
            <Login {...this.props} {...this.appProps} />
          </div>
          <div className="col-xs-6 col-md-6">
            <img src={connect} alt="Connect Image"/>
          </div>
        </div>
      </div>
    );
  }

  loggedInView() {
    return (
      <div>
        <div className="hero-text">
          <h1>Welcome back {this.state.first_name}</h1>
        </div>
        <section className="hero-section smallPadding">
          <div className="container-fluid" >
            <div className="row">
              {this.getProfileSection()}
            </div>
          </div>
        </section>
      </div>
    );
  }

  getProfileSection() {
    if (this.state.id === "") {
      // create profile button
      return (
        <div key="create_profile" className="col-xl-10 offset-xl-1">
          <Link to={"/profile/create"}>
            <button className="btn btn-primary r-button match__button">Create Your Profile</button>
          </Link>
        </div>
      );
    } else {
      // display profile
      return (
        <div className="col-xl-10 offset-xl-1">
          <figure className="hero-avatar">
              <img src={avatar} alt="Profile Image"/>
          </figure>
          <div className="hero-text">
              <h4>Profile Info</h4>
          </div>
          <div className="hero-info">
            <div className="row">
              <ul>
                <li>
                  <span><b>First Name</b></span>
                  {this.MyInput("first_name", this.state.first_name)}
                </li>
                <li>
                  <span><b>Last Name</b></span>
                  {this.MyInput("last_name", this.state.last_name)}
                </li>
                <li>
                  <span>E-mail</span>
                  {this.MyInput("email", this.state.email)}
                </li>
                <li>
                  <span>School</span>
                  {this.MySelector("school", this.state.options.school.map((option, index) => {
                    if (option.value == this.state.school) { return option.text;} 
                    else { return null;}}).filter((ele) => {return ele != null;}
                  ))}
                </li>
                <li>
                  <span>Degree</span>
                  {this.MySelector("degree", this.state.degree)}
                </li>
                <li>
                  <span>Years at School</span>
                  {this.MySelector("year_in_school", this.state.year_in_school)}
                </li>
                <li>
                  <span>Department</span>
                  {this.MySelector("department", this.state.options.department.map((option, index) => {
                    if (option.value == this.state.department) { return option.text;} 
                    else { return null;}}).filter((ele) => {return ele != null;}
                  ))}
                </li>
                <li>
                  <span>Major</span>
                  {this.MySelector("major", this.state.options.major.map((option, index) => {
                    if (option.value == this.state.major) { return option.text;} 
                    else { return null;}}).filter((ele) => {return ele != null;}
                  ))}
                </li>
                <li>
                  <span>Available Date</span>
                  {this.AvailableDateCheckBox("available_date", this.state.available_date)}                          
                </li>
                <li>
                  {this.getModifyButton()}
                </li>
                <li>
                  <button className="btn-primary match__button" onClick={this.deleteProfile}>Delete Profile</button>
                </li>
                <li>
                  <button className="btn-primary match__button" onClick={this.forwardToMatchMentorPage}>Find Mentors</button>
                </li>
              </ul>
            </div>    
          </div>
        </div>
      );
    }
  }
  
  /* Helping Functions */
  getModifyButton() {
    if (this.state.readonly === true) {
      return (
        <button className="btn-primary match__button" onClick={this.modifyProfile}>Modify</button>
      );
    } else {
      return (
        <div className="row">
          <div className="col-lg-6">
            <button className="btn-primary match__button" onClick={this.updateProfile}>Submit</button>
          </div>
          <div className="col-lg-6">
            <button className="btn-secondary match__button" onClick={this.reloadProfile}>Cancel</button>
          </div>
        </div>
      );
    }
  }

  updateProfile = async (event) => {
    console.log("Updating Profile")
    this.setState({readonly: true})
    event.preventDefault();
    
    const currentSession = await Auth.currentSession();
    const token = currentSession.getIdToken().getJwtToken();
    let data = {
        'first_name': this.state.first_name,
        'last_name': this.state.last_name,
        'email': this.state.email,
        'school': this.state.school,
        'degree': this.state.degree,
        'year_in_school': this.state.year_in_school,
        'department': this.state.department,
        'major': this.state.major,
        'available_date': this.state.available_date
    }

    await API.put("mentorme", "/profile/" + this.state.id + "/", {
        body: data,
        headers: {
            "Authorization": token
        }
    }).then(() => {
      console.log("Update Profile Succeed")
      this.props.onProfileChange();
    }).catch(error => {
        if (error.response && error.response.data) {
            console.log(error.response.data.message)
            alert(error.response.data.message)
        } else {
            console.log(error)
            alert(error)
        }
        this.reloadProfileFromProps()
    })
  }

  deleteProfile = async (event) => {
    console.log("Deleting Profile")
    event.preventDefault();
    
    const currentSession = await Auth.currentSession();
    const token = currentSession.getIdToken().getJwtToken();

    await API.del("mentorme", "/profile/" + this.state.id + "/", {
        headers: {
            "Authorization": token
        }
    }).then(() => {
      console.log("Delete Profile Succeed")
      alert("Delete Profile Succeed")
      this.props.onProfileChange();
    }).catch(error => {
        if (error.response && error.response.data) {
            console.log(error.response.data.errorMessage)
            alert(error.response.data.errorMessage)
        } else {
            console.log(error)
            alert(error)
        }
        this.reloadProfileFromProps()
    })
  }


  reloadProfile = (event) => {
    this.setState({readonly: true});
    this.reloadProfileFromProps()
  }

  MySelector = ( id, value ) => {
    if (this.state.readonly === true) {
      return (
        <input readOnly id={id} value={value} size="40" />
      );
    } else {
      let field = this.state.options[id]
      return (
        <div>
          <select id={id} placeholder={value} onChange={this.setProfile}>
            <option key="placeholder" selected disabled value="">unchange</option> 
            {field.map((option, index) => {
                return (
                    <option key={option.value} value={option.value}>{option.text}</option> 
                )
            })}
          </select>
        </div>
      );
    }   
  };
  
  MyInput = ( id, value ) => {
    if (this.state.readonly === true) {
      return (
        <input readOnly id={id} value={value} size="40" />
      );
    } else {
      return (
        <input id={id} placeholder={value} onChange={this.setProfile} size="40"/>
      );
    }
  };

  AvailableDateCheckBox = ( id, value ) => {
    let availableDateCheckBoxes = daysOptions.map((cur, ind) => {
      let is_checked = false;
      if (this.state.available_date != null) {
        is_checked = this.state.available_date.includes(cur);
      }
      return (
          <div key={ind} className="checks" >
              <label>
                  <input id={"available_date_" + ind} name="available_date" type="checkbox" checked={is_checked} onClick={() => this.setAvailableDate(cur, is_checked)} name={cur} value={cur}/>{cur}
              </label>
          </div>
      );
    });
    if (this.state.readonly === true) {
      return (
        <input readOnly id={id} value={value} size="40" />
      );
    } else {
      return (
        <div>
          {availableDateCheckBoxes}
        </div>
      );
    }
  };

  setAvailableDate = (value, is_checked) => {
    let available_date_arr = [];
    console.log('available date length');
    console.log(this.state.available_date.length);
    if (this.state.available_date.length != 0) {
      available_date_arr = this.state.available_date.split(',');
    }
    if (!is_checked) {
      available_date_arr.push(value);
    } else {
      available_date_arr.splice(available_date_arr.indexOf(value), 1);
    }
    console.log(available_date_arr);
    available_date_arr.sort(function(date1, date2) {
      return daysOptions.indexOf(date1) - daysOptions.indexOf(date2);
    });
    let new_available_date = available_date_arr.join(',');
    console.log(new_available_date);
    this.setState({available_date : new_available_date});
  };

  setProfile = (event) => {
    this.setState({[event.target.id]: event.target.value});
  }

  modifyProfile = (event) => {
    this.setState({readonly: false});
  }

  forwardToMatchMentorPage = (event) => {
    event.preventDefault();
    this.props.history.push("/all-match-mentors");
  }

  getDropdownBoxOptions = () => {
    return global.dropdown_options; 
  }
}