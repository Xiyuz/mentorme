import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

export class Header extends Component {
    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-sm bg-dark navbar-dark">
                    <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false"
                        aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                        <Link to='/'>
                            <div className="navbar-brand">MentorMe</div>
                        </Link>
                        <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                            {this.getProfileListItems()}
                            {this.getProfileList()}
                            <li className="nav-item">
                                {this.getAuthNavLink()}
                            </li>
                        </ul>
                        {this.getUserID()}
                    </div>
                </nav>
            </div>
        );
    }

    getProfileListItems() {
        if (!this.props.loggedIn) {
            return null;
        }
        if (this.props.currentProfiles !== undefined && this.props.currentProfiles.length > 0) {
           let currentProfileId = this.props.currentProfiles[0].id;
            return (
                // TODO: this route is disabled
                <li className="nav-item active">
                    <Link to={'/profile/'+currentProfileId}>
                        <div className="nav-link">My Profile<span className="sr-only">(current)</span></div>
                    </Link>
                </li>);
        } else {
            return (
                <li className="nav-item active">
                    <Link to='/profile/create'>
                        <div className="nav-link">Create Profile</div>
                    </Link>
                </li>);
        }
    }

    logoutClicked = () => {
        console.log('logout clickd');
        sessionStorage.clear();
        this.props.onAuthChange(false);
    }

    getAuthNavLink() {
        if (this.props.loggedIn) {
            return <NavLink to="/">
                <div onClick={this.logoutClicked} className="nav-link">Logout</div>
            </NavLink>;
        } else {
            return null;
        }
    }

    getUserID() {
        if (this.props.loggedIn) {
            let user_name = sessionStorage.getItem("user_name")
            return (
                <div className="navbar-text">
                    Username: {user_name}
                </div>
            );
        } else {
            return <></>;
        }
    }

    getProfileList() {
        if (this.props.loggedIn) {
                return (<li className="nav-item active">
                    <Link to='/profile_list'>
                        <div className="nav-link">Profile List</div>
                    </Link>
                </li>);
        } else {
            return <></>;
        }
    }
}

export default Header;
