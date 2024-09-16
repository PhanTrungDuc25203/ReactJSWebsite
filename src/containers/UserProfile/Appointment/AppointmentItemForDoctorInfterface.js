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
            meetPatientId: '',
            appointmentDate: '',
            appointmentTimeFrame: '',
            patientBirthday: '',
            patientInfor: {},
        }
    }

    async componentDidMount() {
        if (this.props && this.props.meetPatientId && this.props.appointmentDate && this.props.appointmentTimeFrame) {
            // console.log("check props: ", this.props);
            let patientInfor = await getAllUsersToDisplayInReact(this.props.meetPatientId);
            if (patientInfor && patientInfor.errCode === 0) {
                this.setState({
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
            prevProps.appointmentTimeFrame !== this.props.appointmentTimeFrame
        ) {
            let patientInfor = await getAllUsersToDisplayInReact(this.props.meetPatientId);
            if (patientInfor && patientInfor.errCode === 0) {
                this.setState({
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
        let { meetPatientId, patientInfor, appointmentDate, appointmentTimeFrame, patientBirthday } = this.state;
        // console.log("check state: ", this.state);
        return (
            <div className="appointment-item-for-doctor-interface">
                <div className="patient-name">
                    Bệnh nhân: {patientInfor && patientInfor.lastName ? patientInfor.lastName : ''}
                    {patientInfor && patientInfor.firstName ? ' ' + patientInfor.firstName : ''}
                    .ID:
                    {meetPatientId && meetPatientId}
                </div>
                <div className="patient-phone-number">
                    Số điện thoại của bệnh nhân: {patientInfor.phoneNumber}
                </div>
                <div className="patient-email">
                    Địa chỉ email của bệnh nhân: {patientInfor.email}
                </div>
                <div className="patient-birthday">
                    Ngày sinh của bệnh nhân: {patientBirthday}
                </div>
                <div className="patient-date">
                    Ngày hẹn: {appointmentDate && appointmentDate}
                </div>
                <div className="patient-timeframe">
                    Khung giờ hẹn: {appointmentTimeFrame && appointmentTimeFrame}
                </div>
                <div>~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~</div>
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
