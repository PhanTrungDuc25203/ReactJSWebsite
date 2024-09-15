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
            meetDoctorId: '',
            doctorInfor: {},
            appointmentDate: '',
            appointmentTimeFrame: '',
        }
    }

    async componentDidMount() {
        if (this.props && this.props.meetDoctorId && this.props.appointmentDate && this.props.appointmentTimeFrame) {
            // console.log("check props: ", this.props);
            let doctorInfor = await getInforAndArticleForADoctor(this.props.meetDoctorId);
            if (doctorInfor && doctorInfor.errCode === 0) {
                this.setState({
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
            prevProps.appointmentTimeFrame !== this.props.appointmentTimeFrame
        ) {
            let doctorInfor = await getInforAndArticleForADoctor(this.props.meetDoctorId);
            if (doctorInfor && doctorInfor.errCode === 0) {
                this.setState({
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
        let { meetDoctorId, doctorInfor, appointmentDate, appointmentTimeFrame } = this.state;
        console.log("check state: ", this.state);
        return (
            <div className="appointment-item-for-patient-interface">
                <div className="doctor-name">
                    Bác sĩ: {doctorInfor.lastName + ' ' + doctorInfor.firstName}
                </div>
                <div className="doctor-phone-number">
                    Số điện thoại của bác sĩ: {doctorInfor.phoneNumber}
                </div>
                <div className="doctor-email">
                    Địa chỉ email của bác sĩ: {doctorInfor.email}
                </div>
                <div className="doctor-specialty">
                    Chuyên ngành bác sĩ: {doctorInfor.Doctor_infor && doctorInfor.Doctor_infor.belongToSpecialty
                        && doctorInfor.Doctor_infor.belongToSpecialty.name}
                </div>
                <div className="appointment-date">
                    Ngày hẹn: {appointmentDate && appointmentDate}
                </div>
                <div className="appointment-timeframe">
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppointmentItemForPatientInfterface));
