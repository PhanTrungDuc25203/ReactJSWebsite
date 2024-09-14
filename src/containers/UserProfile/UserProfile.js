import React, { Component, Fragment, Suspense, lazy } from 'react';
import { connect } from "react-redux";
import './UserProfile.scss';
import HomeFooter from '../HomePage/HomeFooter/HomeFooter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { LANGUAGES } from '../../utils';
import CustomScrollbars from '../../components/CustomScrollbars';
import _ from 'lodash';
import { withRouter } from 'react-router';
import * as actions from "../../store/actions";
import { MoonLoader } from 'react-spinners';
import UserBackgroundContainer from './UserBackgroundContainer/UserBackgroundContainer';

const PersonalProfile = lazy(() => import('./PersonalProfile/PersonalProfile'));

class UserProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            personalProfileOpened: true,
            appointmentOpened: false,
            commentAboutDoctorsOpended: false,
            returnToHomePage: false,
        }
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.email) {
            let userEmail = this.props.match.params.email;

        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    handleLoginForUser = (loginState) => {
        this.props.processLogout();
        this.props.history.push(`/login`);
    }

    handleProfileTabClicked(whichClicked) {
        if (whichClicked === 'personalProfileOpen') {
            this.setState({
                personalProfileOpened: true,
                appointmentOpened: false,
                commentAboutDoctorsOpended: false,
                returnToHomePage: false,
            })
        }
        if (whichClicked === 'appointmentOpen') {
            this.setState({
                personalProfileOpened: false,
                appointmentOpened: true,
                commentAboutDoctorsOpended: false,
                returnToHomePage: false,
            })
        }
        if (whichClicked === 'commentAboutDoctorsOpen') {
            this.setState({
                personalProfileOpened: false,
                appointmentOpened: false,
                commentAboutDoctorsOpended: true,
                returnToHomePage: false,
            })
        }
        if (whichClicked === 'returnToHomePage') {
            this.setState({
                personalProfileOpened: false,
                appointmentOpened: false,
                commentAboutDoctorsOpended: false,
                returnToHomePage: true,
            }, this.props.history.push(`/home`));
        }
    }

    render() {
        let { personalProfileOpened, appointmentOpened, commentAboutDoctorsOpended, returnToHomePage } = this.state;
        return (
            <div className="user-profile-container">
                <CustomScrollbars style={{ height: '100vh', width: '100%' }}>
                    <UserBackgroundContainer />
                    <div className="content-container">
                        <div className="nav-bar">
                            <a href="#" onClick={() => this.handleProfileTabClicked('personalProfileOpen')} className={personalProfileOpened === true ? "active" : ""} >Trang cá nhân</a>
                            <a href="#" onClick={() => this.handleProfileTabClicked('appointmentOpen')} className={appointmentOpened === true ? "active" : ""} >Lịch hẹn bác sĩ</a>
                            <a href="#" onClick={() => this.handleProfileTabClicked('commentAboutDoctorsOpen')} className={commentAboutDoctorsOpended === true ? "active" : ""} >Nhận xét về bác sĩ</a>
                            <a href="#" onClick={() => this.handleProfileTabClicked('returnToHomePage')} className={returnToHomePage === true ? "active" : ""} >Trang chủ</a>
                        </div>
                        {
                            personalProfileOpened === true &&
                            <Suspense fallback={<div>Loading profile...</div>}>
                                <div className="personal-profile">
                                    <PersonalProfile />
                                </div>
                            </Suspense>
                        }
                        {
                            appointmentOpened === true &&
                            <div className="personal-profile">
                                Appoitment with doctor
                            </div>
                        }
                        {
                            commentAboutDoctorsOpended === true &&
                            <div className="personal-profile">
                                Your comments about doctors
                            </div>
                        }
                        <button onClick={() => this.handleLoginForUser()}>Log out </button>
                    </div>
                    <HomeFooter />
                </CustomScrollbars>
            </div >

        );
    }
}

const mapStateToProps = state => {
    return {
        // systemMenuPath: state.app.systemMenuPath,
        // isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserProfile));
