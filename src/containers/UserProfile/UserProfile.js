import React, { Component, Fragment, Suspense, lazy } from 'react';
import { connect } from "react-redux";
import './UserProfile.scss';
import HomeFooter from '../HomePage/HomeFooter/HomeFooter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faCaretLeft, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { LANGUAGES } from '../../utils';
import CustomScrollbars from '../../components/CustomScrollbars';
import _ from 'lodash';
import { withRouter } from 'react-router';
import * as actions from "../../store/actions";
import { MoonLoader } from 'react-spinners';
import UserBackgroundContainer from './UserBackgroundContainer/UserBackgroundContainer';
import { getAllRelativeInforsOfCurrentSystemUserService } from '../../services/userService';

const PersonalProfile = lazy(() => import('./PersonalProfile/PersonalProfile'));
const AppointmentInProfilePage = lazy(() => import('./Appointment/AppointmentInProfilePage'));

class UserProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            personalProfileOpened: true,
            appointmentOpened: false,
            commentAboutDoctorsOpended: false,
            returnToHomePage: false,
            currentUser: {},
        }
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.email) {
            let userEmail = this.props.match.params.email;
            let res = await getAllRelativeInforsOfCurrentSystemUserService(userEmail);
            if (res && res.errCode === 0 && !_.isEqual(res.data, this.state.currentUser)) {
                this.setState({
                    currentUser: res.data,
                })
            }
        }
    }

    handleProfileTabClicked = (whichClicked) => {
        const stateMapping = {
            personalProfileOpen: { personalProfileOpened: true, appointmentOpened: false, commentAboutDoctorsOpended: false, returnToHomePage: false },
            appointmentOpen: { personalProfileOpened: false, appointmentOpened: true, commentAboutDoctorsOpended: false, returnToHomePage: false },
            commentAboutDoctorsOpen: { personalProfileOpened: false, appointmentOpened: false, commentAboutDoctorsOpended: true, returnToHomePage: false },
            returnToHomePage: { personalProfileOpened: false, appointmentOpened: false, commentAboutDoctorsOpended: false, returnToHomePage: true }
        };
        this.setState(stateMapping[whichClicked] || {});
        if (whichClicked === 'returnToHomePage') {
            this.props.history.push(`/home`);
        }
    };

    handleLoginForUser = () => {
        this.props.processLogout();
        this.props.history.push(`/login`);
    };

    renderProfileSection = () => {
        const { personalProfileOpened, currentUser } = this.state;
        if (personalProfileOpened) {
            return (
                <Suspense fallback={<div className="loading-circle">
                    <MoonLoader
                        color='#123abc'
                        size='25'
                        aria-label="Loading Spinner"
                    /></div>}>
                    <div className="personal-profile">
                        <PersonalProfile currentUser={currentUser} />
                    </div>
                </Suspense>
            );
        }
        return null;
    };

    renderAppointmentSection = () => {
        const { appointmentOpened, currentUser } = this.state;
        if (appointmentOpened) {
            const combinedAppointments = {
                doctorAppointments: currentUser.doctorHasAppointmentWithPatients,
                patientAppointments: currentUser.patientHasAppointmentWithDoctors
            };
            return (
                <Suspense fallback={<div className="loading-circle">
                    <MoonLoader
                        color='#123abc'
                        size='25'
                        aria-label="Loading Spinner"
                    /></div>}>
                    <div className="appointment-of-current-user">
                        <AppointmentInProfilePage
                            combinedAppointments={combinedAppointments}
                            userRole={currentUser.roleId}
                        />
                    </div>
                </Suspense>
            );
        }
        return null;
    };

    renderCommentSection = () => {
        const { commentAboutDoctorsOpended } = this.state;
        if (commentAboutDoctorsOpended) {
            return <div className="personal-profile">Your comments about doctors</div>;
        }
        return null;
    };

    render() {
        const { currentUser } = this.state;

        return (
            <div className="user-profile-container">
                <CustomScrollbars style={{ height: '100vh', width: '100%' }}>
                    <UserBackgroundContainer
                        currentUserAvatar={currentUser.image}
                        currentUserEmail={currentUser.email}
                        currentUserName={currentUser.lastName && currentUser.firstName ? `${currentUser.lastName} ${currentUser.firstName}` : 'Đang tải...'}
                    />

                    <div className="content-container">
                        <div className="nav-bar">
                            <a onClick={() => this.handleProfileTabClicked('personalProfileOpen')} className={this.state.personalProfileOpened ? "active" : ""}>
                                Trang cá nhân
                            </a>
                            <a onClick={() => this.handleProfileTabClicked('appointmentOpen')} className={this.state.appointmentOpened ? "active" : ""}>
                                Lịch hẹn bác sĩ
                            </a>
                            <a onClick={() => this.handleProfileTabClicked('commentAboutDoctorsOpen')} className={this.state.commentAboutDoctorsOpended ? "active" : ""}>
                                Nhận xét về bác sĩ
                            </a>
                            <a onClick={() => this.handleProfileTabClicked('returnToHomePage')} className={this.state.returnToHomePage ? "active" : ""}>
                                <FontAwesomeIcon icon={faCaretLeft} /> Trang chủ
                            </a>
                        </div>
                        {this.renderProfileSection()}
                        {this.renderAppointmentSection()}
                        {this.renderCommentSection()}
                        <div className="logout-button-container">
                            <button onClick={this.handleLoginForUser} className="log-out-button-of-profile-page">
                                Log out <FontAwesomeIcon icon={faRightFromBracket} />
                            </button>
                        </div>
                    </div>
                    <HomeFooter />
                </CustomScrollbars>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserProfile));
