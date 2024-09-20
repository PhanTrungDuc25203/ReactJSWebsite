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
            historyOrHandling: 'handling',
        }
    }

    async componentDidMount() {
        if (this.props && this.props.combinedAppointments && this.props.userRole) {
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

    handleHistoryOrHandlingButtonClicked = () => {
        if (this.state.historyOrHandling === 'history') {
            this.setState({
                historyOrHandling: 'handling',
            })
        }
        if (this.state.historyOrHandling === 'handling') {
            this.setState({
                historyOrHandling: 'history',
            })
        }
    }

    render() {
        let { combinedAppointments, userRole } = this.state;
        return (
            <div className="appointment-in-profile-page">
                <div className="appointment-in-profile-page-header">
                    <div className="appointment-in-profile-page-title">
                        Danh sách lịch hẹn đã đặt
                    </div>
                    <a href="#" className={this.state.historyOrHandling === 'history' ? "btn-flip-backward" : "btn-flip"} data-back={this.state.historyOrHandling === 'history' ? "Sắp tới" : "Lịch sử"} data-front={this.state.historyOrHandling === 'history' ? "Lịch sử" : "Sắp tới"} onClick={this.handleHistoryOrHandlingButtonClicked}></a>
                </div>
                <div className="appointment-container">
                    {combinedAppointments && combinedAppointments.patientAppointments && combinedAppointments.patientAppointments.length > 0 ?
                        combinedAppointments.patientAppointments.map((item, index) => {
                            return (
                                <div className="appointment-item" key={index}>
                                    <AppointmentItemForPatientInfterface
                                        historyOrHandling={this.state.historyOrHandling}
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
                                            historyOrHandling={this.state.historyOrHandling}
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
