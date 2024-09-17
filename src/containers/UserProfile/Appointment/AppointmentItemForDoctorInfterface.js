import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import './AppointmentItemForDoctorInfterface.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { LANGUAGES } from '../../../utils';
import _ from 'lodash';
import { withRouter } from 'react-router';
import * as actions from "../../../store/actions";
import { MoonLoader } from 'react-spinners';
import { getAllUsersToDisplayInReact } from '../../../services/userService';
import moment from 'moment';

class AppointmentItemForDoctorInfterface extends Component {

    constructor(props) {
        super(props);
        this.state = {
            scheduleStatus: '',
            appointmentId: '',
            meetPatientId: '',
            appointmentDate: '',
            appointmentTimeFrame: '',
            patientBirthday: '',
            patientInfor: {},
        }
    }

    async componentDidMount() {
        if (this.props && this.props.meetPatientId && this.props.appointmentDate && this.props.appointmentTimeFrame && this.props.appointmentId && this.props.scheduleStatus) {
            // console.log("check props: ", this.props);
            let patientInfor = await getAllUsersToDisplayInReact(this.props.meetPatientId);
            if (patientInfor && patientInfor.errCode === 0) {
                this.setState({
                    scheduleStatus: this.props.scheduleStatus,
                    appointmentId: this.props.appointmentId,
                    meetPatientId: this.props.meetPatientId,
                    appointmentDate: this.props.appointmentDate,
                    appointmentTimeFrame: this.props.appointmentTimeFrame,
                    patientBirthday: this.props.patientBirthday,
                    patientInfor: patientInfor.users
                })
            }
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.meetPatientId !== this.props.meetPatientId &&
            prevProps.appointmentDate !== this.props.appointmentDate &&
            prevProps.appointmentTimeFrame !== this.props.appointmentTimeFrame &&
            prevProps.appointmentId !== this.props.appointmentId &&
            prevProps.scheduleStatus !== this.props.scheduleStatus
        ) {
            let patientInfor = await getAllUsersToDisplayInReact(this.props.meetPatientId);
            if (patientInfor && patientInfor.errCode === 0) {
                this.setState({
                    scheduleStatus: this.props.scheduleStatus,
                    appointmentId: this.props.appointmentId,
                    meetPatientId: this.props.meetPatientId,
                    appointmentDate: this.props.appointmentDate,
                    appointmentTimeFrame: this.props.appointmentTimeFrame,
                    patientBirthday: this.props.patientBirthday,
                    patientInfor: patientInfor.users
                })
            }
        }
    }

    handleProfileTabClicked(whichClicked) {

    }

    render() {
        let { scheduleStatus, appointmentId, meetPatientId, patientInfor, appointmentDate, appointmentTimeFrame, patientBirthday } = this.state;
        console.log("check state: ", this.state);
        return (
            <div className="appointment-item-for-doctor-interface">
                <div className="appointment-id">
                    <label>Mã số cuộc hẹn:</label> {' '}
                    {appointmentId && appointmentId}
                </div>
                <div className="patient-name">
                    <label>Bệnh nhân: </label>{' '}{patientInfor && patientInfor.lastName ? patientInfor.lastName : ''}
                    {patientInfor && patientInfor.firstName ? ' ' + patientInfor.firstName : ''}
                    {'. '}<label>ID:</label>{' '}
                    {meetPatientId && meetPatientId}
                </div>
                <div className="patient-phone-number">
                    <label>Số điện thoại của bệnh nhân: </label>{' '}{patientInfor && patientInfor.phoneNumber && patientInfor.phoneNumber}
                </div>
                <div className="patient-email">
                    <label>Địa chỉ email của bệnh nhân: </label>{' '}{patientInfor && patientInfor.email && patientInfor.email}
                </div>
                <div className="patient-birthday">
                    <label>Ngày sinh của bệnh nhân: </label>{' '}{patientBirthday && patientBirthday}
                </div>
                <div className="patient-date">
                    <label>Ngày hẹn: </label>{' '}{appointmentDate && appointmentDate}
                </div>
                <div className="patient-timeframe">
                    <label>Khung giờ hẹn: </label>{' '}{appointmentTimeFrame && appointmentTimeFrame}
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppointmentItemForDoctorInfterface));
