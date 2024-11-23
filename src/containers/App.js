import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter as Router } from 'connected-react-router';
import { history } from '../redux'
import { ToastContainer } from 'react-toastify';
import { userIsAuthenticated, userIsNotAuthenticated, userIsNotPatient, userIsNotPatientAndDoctor } from '../hoc/authentication';
import { path } from '../utils'
import Home from '../routes/Home';
// import Login from '../routes/Login';
import Login from './Authenticate/Login.js';
import Register from './Authenticate/Register.js';
// import Header from './Header/Header';
import System from '../routes/System';
import { CustomToastCloseButton } from '../components/CustomToast';
import ConfirmModal from '../components/ConfirmModal';
import HomePage from './HomePage/HomePage.js';
import CustomScrollbars from '../components/CustomScrollbars.js';
import DetailArticleForADoctor from './ForPatient/DetailDoctor/DetailArticleForADoctor.js';
import Doctor from '../routes/Doctor.js';
import MakeAppointmentPage from './ForPatient/DetailDoctor/MakeAppointmentPage/MakeAppointmentPage.js';
import ConfirmBookingAppointment from './ForPatient/ConfirmBookingAppointment/ConfirmBookingAppointment.js';
import DetailSpecialty from './ForPatient/DetailSpecialty/DetailSpecialty.js';
import UserProfile from './UserProfile/UserProfile.js';
import DefaultRegister from './Authenticate/DefaultRegister.js';
import DetailMedicalFacility from './ForPatient/DetailMedicalFacility/DetailMedicalFacility.js';
import AllSpecialties from './ForPatient/DetailSpecialty/AllSpecialties/AllSpecialties.js';
import BookingAExamPackagePage from './ForPatient/DetailMedicalFacility/BookingAExamPackagePage/BookingAExamPackagePage.js';

class App extends Component {

    handlePersistorState = () => {
        const { persistor } = this.props;
        let { bootstrapped } = persistor.getState();
        if (bootstrapped) {
            if (this.props.onBeforeLift) {
                Promise.resolve(this.props.onBeforeLift())
                    .then(() => this.setState({ bootstrapped: true }))
                    .catch(() => this.setState({ bootstrapped: true }));
            } else {
                this.setState({ bootstrapped: true });
            }
        }
    };

    componentDidMount() {
        this.handlePersistorState();
    }

    render() {
        return (
            <Fragment>
                <Router history={history}>
                    <div className="main-container">
                        <ConfirmModal />
                        {/* {this.props.isLoggedIn && <Header />} */}

                        <div className="content-container">
                            {/* <CustomScrollbars style={{ height: '100vh', width: '100%' }}> */}
                            <Switch>
                                <Route path={path.HOME} exact component={(Home)} />
                                <Route path={path.LOGIN} component={userIsNotAuthenticated(Login)} />
                                <Route path={path.REGISTER} component={userIsNotAuthenticated(DefaultRegister)} />
                                {/* dành cho admin  */}
                                <Route path={path.SYSTEM} component={userIsNotPatientAndDoctor(userIsNotPatient(userIsAuthenticated(System)))} />
                                {/* booking care cho bác sĩ và bệnh nhân*/}
                                <Route path={path.HOMEPAGE} component={(HomePage)} />
                                <Route path={path.DETAIL_DOCTOR_ARTICLE} component={DetailArticleForADoctor} />
                                {/* trang dăng kí khám bệnh theo khung giờ của từng bác sĩ cho bệnh nhân */}
                                <Route path={path.MAKE_APPOINTMENT_WITH_DOCTOR} component={MakeAppointmentPage} />
                                {/* trang dăng kí Gói khám cho bệnh nhân */}
                                <Route path={path.BOOKING_A_EXAM_PACKAGE} component={BookingAExamPackagePage} />
                                {/* route xác nhận đặt hẹn với bác sĩ */}
                                <Route path={path.CONFIRM_BOOKING_APPOINTMENT} component={ConfirmBookingAppointment} />
                                {/* route trang chi tiết một chuyên khoa và các bac sĩ thuộc chuyên khoa đó */}
                                <Route path={path.SPECIALTY_ARTICLE} component={DetailSpecialty} />
                                {/* trang xem thông tin của một cơ sở y tế */}
                                <Route path={path.MEDICAL_FACILITY_ARTICLE} component={DetailMedicalFacility} />
                                {/* trang hồ sơ người dùng */}
                                <Route path={path.USER_PROFILE} component={UserProfile} />
                                {/* trang xem chi tiết tất cả các chuyên khoa */}
                                <Route path={path.ALL_SPECIALTIES} component={AllSpecialties} />
                                {/* path for doctor*/}
                                <Route path={'/doctor'} component={userIsNotPatient(userIsAuthenticated(Doctor))} />
                            </Switch>
                            {/* </CustomScrollbars> */}
                        </div>

                        <ToastContainer
                            position="top-right"
                            autoClose={5000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            theme="light"
                        />

                    </div>
                </Router>
            </Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        started: state.app.started,
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);