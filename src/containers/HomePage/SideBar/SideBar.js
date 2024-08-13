import React, { Component } from 'react';
import { connect } from 'react-redux';
import './SideBar.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { } from '@fortawesome/free-brands-svg-icons';
import { } from '@fortawesome/fontawesome-free-webfonts';
import { } from '@fortawesome/fontawesome-svg-core';
import { } from '@fortawesome/free-regular-svg-icons';
import { faTooth, faHeartPulse, faSuitcaseMedical, faStethoscope } from '@fortawesome/free-solid-svg-icons';
import { } from '@fortawesome/free-solid-svg-icons';
import { } from '@fortawesome/react-fontawesome';


class SideBar extends Component {

    render() {

        return (
            <React.Fragment>
                <input type="checkbox" id="check" />
                <label htmlFor="check">
                    <i className="fas fa-bars" id="btn"></i>
                    <i className="fas fa-times" id="cancel"></i>
                </label>
                <div className="sidebar">
                    <header>My Menu</header>
                    <a href="#" className="active">
                        <i className="fas fa-qrcode"></i>
                        <span>Dashboard</span>
                    </a>
                    <a href="#">
                        <i className="fas fa-link"></i>
                        <span>Shortcuts</span>
                    </a>
                    <a href="#">
                        <i className="fas fa-stream"></i>
                        <span>Overview</span>
                    </a>
                    <a href="#">
                        <i className="fas fa-calendar"></i>
                        <span>Events</span>
                    </a>
                    <a href="#">
                        <i className="far fa-question-circle"></i>
                        <span>About</span>
                    </a>
                    <a href="#">
                        <i className="fas fa-sliders-h"></i>
                        <span>Services</span>
                    </a>
                    <a href="#">
                        <i className="far fa-envelope"></i>
                        <span>Contact</span>
                    </a>
                </div>
            </React.Fragment>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);
