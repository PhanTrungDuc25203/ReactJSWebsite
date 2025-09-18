import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./AppointmentItemForPatientInfterface.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { LANGUAGES } from "../../../utils";
import _ from "lodash";
import { withRouter } from "react-router";
import * as actions from "../../../store/actions";
import { MoonLoader } from "react-spinners";
import { getInforAndArticleForADoctor } from "../../../services/userService";
import moment from "moment";

class AppointmentItemForPatientInfterface extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scheduleStatus: "",
      appointmentId: "",
      meetDoctorId: "",
      doctorInfor: {},
      appointmentDate: "",
      appointmentTimeFrame: "",
    };
  }

  async componentDidMount() {
    if (
      this.props &&
      this.props.meetDoctorId &&
      this.props.appointmentDate &&
      this.props.appointmentTimeFrame &&
      this.props.appointmentId &&
      this.props.scheduleStatus
    ) {
      // console.log("check props: ", this.props);
      let doctorInfor = await getInforAndArticleForADoctor(
        this.props.meetDoctorId
      );
      if (doctorInfor && doctorInfor.errCode === 0) {
        this.setState({
          scheduleStatus: this.props.scheduleStatus,
          appointmentId: this.props.appointmentId,
          meetDoctorId: this.props.meetDoctorId,
          appointmentDate: this.props.appointmentDate,
          appointmentTimeFrame: this.props.appointmentTimeFrame,
          doctorInfor: doctorInfor.data,
        });
      }
    }
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevProps.meetDoctorId !== this.props.meetDoctorId &&
      prevProps.appointmentDate !== this.props.appointmentDate &&
      prevProps.appointmentTimeFrame !== this.props.appointmentTimeFrame &&
      prevProps.appointmentId !== this.props.appointmentId &&
      prevProps.scheduleStatus !== this.props.scheduleStatus
    ) {
      let doctorInfor = await getInforAndArticleForADoctor(
        this.props.meetDoctorId
      );
      if (doctorInfor && doctorInfor.errCode === 0) {
        this.setState({
          scheduleStatus: this.props.scheduleStatus,
          appointmentId: this.props.appointmentId,
          meetDoctorId: this.props.meetDoctorId,
          appointmentDate: this.props.appointmentDate,
          appointmentTimeFrame: this.props.appointmentTimeFrame,
          doctorInfor: doctorInfor.data,
        });
      }
    }
  }

  handleProfileTabClicked(whichClicked) {}

  render() {
    let {
      scheduleStatus,
      appointmentId,
      doctorInfor,
      appointmentDate,
      appointmentTimeFrame,
    } = this.state;
    // console.log("check state: ", this.state);
    return (
      <div className="appointment-item-for-patient-interface">
        <div className="appointment-id">
          <label className="appointment-item-for-patient-label">
            Mã số cuộc hẹn:
          </label>
          <span className="appointment-item-for-patient-content">
            {appointmentId && appointmentId}
          </span>
        </div>
        <div className="doctor-name">
          <label className="appointment-item-for-patient-label">Bác sĩ: </label>
          <span className="appointment-item-for-patient-content">
            {doctorInfor && doctorInfor.lastName && doctorInfor.lastName}{" "}
            {doctorInfor && doctorInfor.firstName && doctorInfor.firstName}
          </span>
        </div>
        <div className="doctor-phone-number">
          <label className="appointment-item-for-patient-label">
            Số điện thoại của bác sĩ:{" "}
          </label>
          <span className="appointment-item-for-patient-content">
            {doctorInfor && doctorInfor.phoneNumber && doctorInfor.phoneNumber}
          </span>
        </div>
        <div className="doctor-email">
          <label className="appointment-item-for-patient-label">
            Địa chỉ email của bác sĩ:{" "}
          </label>
          <span className="appointment-item-for-patient-content">
            {doctorInfor && doctorInfor.email && doctorInfor.email}
          </span>
        </div>
        <div className="doctor-specialty">
          <label className="appointment-item-for-patient-label">
            Chuyên ngành bác sĩ:{" "}
          </label>
          <span className="appointment-item-for-patient-content">
            {doctorInfor.Doctor_infor &&
              doctorInfor.Doctor_infor.belongToSpecialty &&
              doctorInfor.Doctor_infor.belongToSpecialty.name}
          </span>
        </div>
        <div className="appointment-date">
          <label className="appointment-item-for-patient-label">
            Ngày hẹn:{" "}
          </label>
          <span className="appointment-item-for-patient-content">
            {appointmentDate && appointmentDate}
          </span>
        </div>
        <div className="appointment-timeframe">
          <label className="appointment-item-for-patient-label">
            Khung giờ hẹn:{" "}
          </label>
          <span className="appointment-item-for-patient-content">
            {appointmentTimeFrame && appointmentTimeFrame}
          </span>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    processLogout: () => dispatch(actions.processLogout()),
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AppointmentItemForPatientInfterface)
);
