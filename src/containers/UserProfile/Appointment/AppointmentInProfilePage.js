import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import './AppointmentInProfilePage.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardCheck } from '@fortawesome/free-solid-svg-icons';
import { LANGUAGES } from '../../../utils';
import _ from 'lodash';
import { withRouter } from 'react-router';
import * as actions from "../../../store/actions";
import { MoonLoader } from 'react-spinners';
import moment from 'moment';
import AppointmentItemForPatientInfterface from './AppointmentItemForPatientInfterface';
import AppointmentItemForDoctorInfterface from './AppointmentItemForDoctorInfterface';

class AppointmentInProfilePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            combinedAppointments: {},
            userRole: '',
            historyOrHandling: false,
        }
    }

    async componentDidMount() {
        if (this.props && this.props.combinedAppointments && this.props.userRole) {
            // console.log("check props: ", this.props);
            this.setState({
                combinedAppointments: this.props.combinedAppointments,
                userRole: this.props.userRole,
            })
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.combinedAppointments !== this.props.combinedAppointments && prevProps.userRole !== this.props.userRole) {
            this.setState({
                combinedAppointments: this.props.combinedAppointments,
                userRole: this.props.userRole,
            });
        }
    }

    handleProfileTabClicked(whichClicked) {

    }

    render() {
        let { historyOrHandling, combinedAppointments, userRole } = this.state;
        // console.log("check props: ", combinedAppointments, userRole);
        return (
            <div className="appointment-in-profile-page">
                <div className="appointment-in-profile-page-header">
                    <div className="appointment-in-profile-page-title">
                        Danh sách lịch hẹn đã đặt
                    </div>
                    <a href="#" className="btn-flip" data-back="Lịch sử" data-front="Sắp tới"></a>
                </div>
                <div className="appointment-container">
                    {combinedAppointments && combinedAppointments.patientAppointments && combinedAppointments.patientAppointments.length > 0 ?
                        combinedAppointments.patientAppointments.map((item, index) => {
                            return (
                                <div className="appointment-item" key={index}>
                                    <AppointmentItemForPatientInfterface
                                        scheduleStatus={item.statusId}
                                        appointmentId={item.id}
                                        meetDoctorId={item.doctorId}
                                        appointmentDate={moment(item.date).format('DD-MM-YYYY')}
                                        appointmentTimeFrame={item.appointmentTimeTypeData && item.appointmentTimeTypeData.value_Vie}
                                    />
                                </div>
                            )
                        })
                        :
                        userRole === 'R3' && 'Bạn chưa có lịch hẹn nào với bác sĩ'
                    }

                    {combinedAppointments && combinedAppointments.doctorAppointments && combinedAppointments.doctorAppointments.length > 0 ?
                        combinedAppointments.doctorAppointments.map((item, index) => {
                            return (
                                <div className="appointment-item" key={index}>
                                    <div className="appointment-item" key={index}>
                                        <AppointmentItemForDoctorInfterface
                                            scheduleStatus={item.statusId}
                                            appointmentId={item.id}
                                            meetPatientId={item.patientId}
                                            appointmentDate={moment(item.date).format('DD-MM-YYYY')}
                                            appointmentTimeFrame={item.appointmentTimeTypeData && item.appointmentTimeTypeData.value_Vie}
                                            patientBirthday={moment(item.patientBirthday).format('DD-MM-YYYY')}
                                        />
                                    </div>
                                </div>
                            )
                        })
                        :
                        userRole === 'R2' && 'Bạn chưa có lịch hẹn nào với bệnh nhân'
                    }
                    {userRole === 'R1' && 'Bạn là admin nên không có gì trong này đâu:))'}
                </div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppointmentInProfilePage));
