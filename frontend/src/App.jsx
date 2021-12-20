import React, { Component } from 'react';
import { Header } from './components/Header.jsx'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Register from './components/Register.jsx';
import ForgotPassword from './components/ForgetPassword';
import ProfileList from './components/ProfileList.jsx';
import { Profile, ProfileCreation } from './components/Profile';
import Home from './components/Home';
import { MatchedProfiles } from './components/MatchedProfiles';
import ErrorPage from "./components/ErrorPage";
import ReactSpinner from 'react-bootstrap-spinner';

import {Auth, API} from "aws-amplify";

import './css/App.css';

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {loading: true};
    this.url = global.constants.api_root_url;
  }

  render() {
    if (this.state === null) {
      return null;
    }
    /* appProps are properties that child components need. It also contains things like callbacks so child components
       can update the state of the parent app.
    */
    this.appProps = {
      currentProfiles: this.state.currentProfiles,
      onProfileChange: this.handleProfileChange.bind(this),
      loggedIn: this.state.loggedIn,
      onAuthChange: this.handleLogin.bind(this)
    };
    console.log("Rendering App");
    console.log(this.state);
    /* Put any other routes (pages) we have in the switch below!
    If your page relies on being logged in or having a profile, ect (it probably does) then you also need to
    pass in the props. 
    
    Q: Why do we need to do `{...props} {...this.appProps}`?
    A: {...props} makes sure that the child components can access the properties set by the Router.
    Without those, the child component can't even do things like redirect to another page!
    */
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
      <Router>
        <header>
          <Header {...this.props} {...this.appProps} />
        </header>
        <Switch>
          <Route path="/register" exact render={(props) => <Register {...props} {...this.appProps} />} />
          <Route path="/forgotPassword" exact render={(props) => <ForgotPassword {...props} {...this.appProps} />} />
          <Route path="/profile/create" exact render={(props) => <ProfileCreation {...props} {...this.appProps} />} />
          <Route path="/profile/:id" exact render={(props) => <Profile {...props} {...this.appProps}  />} />
          <Route path="/profile_list" exact render={(props) => <ProfileList {...props} {...this.appProps} />} />

          <Route path="/" exact render={(props) => <Home {...props} {...this.appProps} />} />}
          <Route path="/all-match-mentors" exact render={(props) => <MatchedProfiles {...props} {...this.appProps} />} />
          {/*TODO this is just a temp error page, will focus on error page later*/}
          <Route path="/error404" exact render={(props) => <ErrorPage {...props} {...this.appProps} />} />}
        </Switch>
      </Router>
    )
  }

  // Callback functions
  async handleLogin(loggedIn) {
    this.setState({ loggedIn: loggedIn });
    if (!loggedIn) {
      sessionStorage.clear();
      this.setState({currentProfiles: []});
    } else {
        this.setState({loading: true});
        let profiles = await this.getProfiles();
        this.setState({
          currentProfiles: profiles,
          loading: false
        });
        console.log("Handle Login")
        console.log(this.state);
    }
  }

  componentDidMount() {
    let user_name = sessionStorage.getItem("user_name")
    this.setState({ loggedIn: user_name != null });
    this.handleProfileChange().then(e => this.setState({loading: false}));
  }

  async handleProfileChange() {
    let profiles = await this.getProfiles();
    console.log("Get Profiles of Current User");
    console.log(profiles);
    this.setState({currentProfiles: profiles});
  }

  async getProfiles() {
    let currentSession = null;
    try {
      currentSession = await Auth.currentSession();
    } catch (error) {
      if (error === 'No current user') {
        return;
      } else {
        alert(error);
      }
    }
    
    const token = currentSession.getIdToken().getJwtToken();
    const user_name = sessionStorage.getItem("user_name");

    if (user_name === null || user_name === "") {
      return [];
    } else {
      let ret = null;
      while (ret === null) {
        ret = await API.get("mentorme", "/profile", {
          headers: {
            "Authorization": token
          },
          queryStringParameters: {
            "user_name": user_name
          }
        }).then(res => {
          if (res.body != null && res.body != "[]") {
            return JSON.parse(res.body);
          }
          return [];
        }).catch(error => {
          if (error.response) {
            if(error.response.status === 504) {
              return null;
            } else {
              console.log(error.response);
              // alert(error.response.data.message);
            }   
          } else {
            console.log(error);
            // alert(error);
          }
          return [];
        });
      }
      return ret;
    }
  }
}

export default App;
