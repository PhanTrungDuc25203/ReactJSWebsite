import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import './AppointmentItemForPatientInfterface.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { LANGUAGES } from '../../../utils';
import _ from 'lodash';
import { withRouter } from 'react-router';
import * as actions from "../../../store/actions";
import { MoonLoader } from 'react-spinners';
import { getInforAndArticleForADoctor } from '../../../services/userService';
import moment from 'moment';

class AppointmentItemForPatientInfterface extends Component {

    constructor(props) {
        super(props);
        this.state = {
            appointmentId: '',
            meetDoctorId: '',
            doctorInfor: {},
            appointmentDate: '',
            appointmentTimeFrame: '',
        }
    }

    async componentDidMount() {
        if (this.props && this.props.meetDoctorId && this.props.appointmentDate && this.props.appointmentTimeFrame && this.props.appointmentId) {
            // console.log("check props: ", this.props);
            let doctorInfor = await getInforAndArticleForADoctor(this.props.meetDoctorId);
            if (doctorInfor && doctorInfor.errCode === 0) {
                this.setState({
                    appointmentId: this.props.appointmentId,
                    meetDoctorId: this.props.meetDoctorId,
                    appointmentDate: this.props.appointmentDate,
                    appointmentTimeFrame: this.props.appointmentTimeFrame,
                    doctorInfor: doctorInfor.data
                })
            }
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.meetDoctorId !== this.props.meetDoctorId &&
            prevProps.appointmentDate !== this.props.appointmentDate &&
            prevProps.appointmentTimeFrame !== this.props.appointmentTimeFrame &&
            prevProps.appointmentId !== this.props.appointmentId
        ) {
            let doctorInfor = await getInforAndArticleForADoctor(this.props.meetDoctorId);
            if (doctorInfor && doctorInfor.errCode === 0) {
                this.setState({
                    appointmentId: this.props.appointmentId,
                    meetDoctorId: this.props.meetDoctorId,
                    appointmentDate: this.props.appointmentDate,
                    appointmentTimeFrame: this.props.appointmentTimeFrame,
                    doctorInfor: doctorInfor.data
                })
            }
        }
    }

    handleProfileTabClicked(whichClicked) {

    }

    render() {
        let { appointmentId, doctorInfor, appointmentDate, appointmentTimeFrame } = this.state;
        // console.log("check state: ", this.state);
        return (
            <div className="appointment-item-for-patient-interface">
                <div className="appointment-id">
                    <label>Mã số cuộc hẹn:</label> {' '}
                    {appointmentId && appointmentId}
                </div>
                <div className="doctor-name">
                    <label>Bác sĩ: </label>{' '}{doctorInfor && doctorInfor.lastName && doctorInfor.lastName}{' '}
                    {doctorInfor && doctorInfor.firstName && doctorInfor.firstName}
                </div>
                <div className="doctor-phone-number">
                    <label>Số điện thoại của bác sĩ: </label>{' '}{doctorInfor && doctorInfor.phoneNumber && doctorInfor.phoneNumber}
                </div>
                <div className="doctor-email">
                    <label>Địa chỉ email của bác sĩ: </label>{' '}{doctorInfor && doctorInfor.email && doctorInfor.email}
                </div>
                <div className="doctor-specialty">
                    <label>Chuyên ngành bác sĩ: </label>{' '}{doctorInfor.Doctor_infor && doctorInfor.Doctor_infor.belongToSpecialty
                        && doctorInfor.Doctor_infor.belongToSpecialty.name}
                </div>
                <div className="appointment-date">
                    <label>Ngày hẹn: </label>{' '}{appointmentDate && appointmentDate}
                </div>
                <div className="appointment-timeframe">
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppointmentItemForPatientInfterface));
