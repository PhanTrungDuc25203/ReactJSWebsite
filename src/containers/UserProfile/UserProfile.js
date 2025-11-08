import React, { Component, Suspense, lazy } from "react";
import { connect } from "react-redux";
import "./UserProfile.scss";
import HomeFooter from "../HomePage/HomeFooter/HomeFooter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import CustomScrollbars from "../../components/CustomScrollbars";
import _ from "lodash";
import { withRouter } from "react-router";
import * as actions from "../../store/actions";
import { MoonLoader } from "react-spinners";
import UserBackgroundContainer from "./UserBackgroundContainer/UserBackgroundContainer";
import { getAllRelativeInforsOfCurrentSystemUserService, getAllRelativeBookingsOfCurrentSystemUserService } from "../../services/userService";
import queryString from "query-string";

const PersonalProfile = lazy(() => import("./PersonalProfile/PersonalProfile"));
const AppointmentInProfilePage = lazy(() => import("./Appointment/AppointmentInProfilePage"));

class UserProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: "personal",
            currentUser: {},
            combinedAppointments: {},
        };
    }

    async componentDidMount() {
        const { location } = this.props;
        const parsed = queryString.parse(location.search);
        const activeTab = parsed.tab || "personal";
        this.setState({ activeTab });

        if (this.props.match?.params?.email) {
            let userEmail = this.props.match.params.email;

            // lấy thông tin user
            let res = await getAllRelativeInforsOfCurrentSystemUserService(userEmail);
            if (res && res.errCode === 0) {
                this.setState({ currentUser: res.data });
            }

            // lấy thông tin appointment
            let bookingRes = await getAllRelativeBookingsOfCurrentSystemUserService(userEmail);
            if (bookingRes && bookingRes.errCode === 0) {
                this.setState({
                    combinedAppointments: {
                        doctorAppointments: bookingRes.data.doctorHasAppointmentWithPatients,
                        patientAppointments: bookingRes.data.patientHasAppointmentWithDoctors,
                    },
                });
            }
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.search !== prevProps.location.search) {
            const parsed = queryString.parse(this.props.location.search);
            const activeTab = parsed.tab || "personal";
            if (activeTab !== this.state.activeTab) {
                this.setState({ activeTab });
            }
        }
    }

    refreshUserAppointments = async () => {
        const { currentUser } = this.state;
        if (!currentUser?.email) return;

        let bookingRes = await getAllRelativeBookingsOfCurrentSystemUserService(currentUser.email);
        if (bookingRes && bookingRes.errCode === 0) {
            this.setState({
                combinedAppointments: {
                    doctorAppointments: bookingRes.data.doctorHasAppointmentWithPatients,
                    patientAppointments: bookingRes.data.patientHasAppointmentWithDoctors,
                },
            });
        }
    };

    handleTabChange = (tab) => {
        this.props.history.push({
            pathname: this.props.location.pathname,
            search: `?tab=${tab}`,
        });
    };

    handleLoginForUser = () => {
        this.props.processLogout();
        this.props.history.push(`/login`);
    };

    renderProfileSection = () => {
        const { activeTab, currentUser } = this.state;
        if (activeTab === "personal") {
            return (
                <Suspense
                    fallback={
                        <div className="loading-circle">
                            <MoonLoader color="#123abc" size={25} />
                        </div>
                    }
                >
                    <div className="personal-profile">
                        <PersonalProfile currentUser={currentUser} />
                    </div>
                </Suspense>
            );
        }
        return null;
    };

    renderAppointmentSection = () => {
        const { activeTab, currentUser, combinedAppointments } = this.state;
        if (activeTab === "appointment") {
            return (
                <Suspense
                    fallback={
                        <div className="loading-circle">
                            <MoonLoader color="#123abc" size={25} />
                        </div>
                    }
                >
                    <div className="appointment-of-current-user">
                        <AppointmentInProfilePage currentUserEmail={currentUser.email} userRole={currentUser.roleId} combinedAppointments={combinedAppointments} onRefreshAppointments={this.refreshUserAppointments}/>
                    </div>
                </Suspense>
            );
        }
        return null;
    };

    renderCommentSection = () => {
        const { activeTab } = this.state;
        if (activeTab === "comment") {
            return <div className="personal-profile">Your comments about doctors</div>;
        }
        return null;
    };

    render() {
        const { currentUser, activeTab } = this.state;

        return (
            <div className="user-profile-container">
                <CustomScrollbars style={{ height: "100vh", width: "100%" }}>
                    <UserBackgroundContainer currentUserAvatar={currentUser.image} currentUserEmail={currentUser.email} currentUserName={currentUser.lastName && currentUser.firstName ? `${currentUser.lastName} ${currentUser.firstName}` : "Đang tải..."} />

                    <div className="content-container">
                        <div className="nav-bar">
                            <a onClick={() => this.handleTabChange("personal")} className={activeTab === "personal" ? "active" : ""}>
                                Trang cá nhân
                            </a>
                            <a onClick={() => this.handleTabChange("appointment")} className={activeTab === "appointment" ? "active" : ""}>
                                Lịch hẹn bác sĩ
                            </a>
                            <a onClick={() => this.handleTabChange("comment")} className={activeTab === "comment" ? "active" : ""}>
                                Nhận xét về bác sĩ
                            </a>
                            <a onClick={() => this.props.history.push(`/home`)} className={activeTab === "return" ? "active" : ""}>
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

const mapStateToProps = (state) => ({
    language: state.app.language,
});

const mapDispatchToProps = (dispatch) => ({
    processLogout: () => dispatch(actions.processLogout()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserProfile));
