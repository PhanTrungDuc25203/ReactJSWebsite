import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./AppointmentItemForPatientInfterface.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faClock } from "@fortawesome/free-solid-svg-icons";
import { LANGUAGES } from "../../../utils";
import _ from "lodash";
import { withRouter } from "react-router";
import * as actions from "../../../store/actions";
import { MoonLoader } from "react-spinners";
import defaultAvatar from "../../../assets/images/default-avatar-circle.png";
import { getInforAndArticleForADoctor } from "../../../services/userService";
import moment from "moment";
import ReactDOM from "react-dom";

const Portal = ({ children }) => {
    return ReactDOM.createPortal(children, document.body);
};

class AppointmentItemForPatientInfterface extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scheduleStatus: "",
            appointmentId: "",
            meetDoctorId: "",
            doctorInfor: {},
            appointmentDate: "",
            medicalReport: "",
            appointmentTimeFrame: "",
            showReportModal: false,
            reportText: "",
        };
    }

    async componentDidMount() {
        if (this.props && this.props.meetDoctorId && this.props.appointmentDate && this.props.appointmentTimeFrame && this.props.appointmentId && this.props.scheduleStatus) {
            // console.log("check props: ", this.props);
            let doctorInfor = await getInforAndArticleForADoctor(this.props.meetDoctorId);
            if (doctorInfor && doctorInfor.errCode === 0) {
                this.setState({
                    scheduleStatus: this.props.scheduleStatus,
                    paymentStatus: this.props.paymentStatus,
                    appointmentId: this.props.appointmentId,
                    meetDoctorId: this.props.meetDoctorId,
                    appointmentDate: this.props.appointmentDate,
                    appointmentTimeFrame: this.props.appointmentTimeFrame,
                    medicalReport: this.props.medicalReport,
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
            prevProps.scheduleStatus !== this.props.scheduleStatus &&
            prevProps.paymentStatus !== this.props.paymentStatus &&
            prevProps.medicalReport !== this.props.medicalReport
        ) {
            let doctorInfor = await getInforAndArticleForADoctor(this.props.meetDoctorId);
            if (doctorInfor && doctorInfor.errCode === 0) {
                this.setState({
                    scheduleStatus: this.props.scheduleStatus,
                    paymentStatus: this.props.paymentStatus,
                    appointmentId: this.props.appointmentId,
                    meetDoctorId: this.props.meetDoctorId,
                    appointmentDate: this.props.appointmentDate,
                    appointmentTimeFrame: this.props.appointmentTimeFrame,
                    medicalReport: this.props.medicalReport,
                    doctorInfor: doctorInfor.data,
                });
            }
        }
    }

    handleProfileTabClicked(whichClicked) {}

    convertBufferToText = (bufferObj) => {
        if (!bufferObj || !bufferObj.data) {
            return "Không có dữ liệu file";
        }

        try {
            let buffer = Buffer.from(bufferObj.data);
            return buffer.toString("utf-8");
        } catch (err) {
            return "Không thể đọc file. Có thể file không phải dạng text.";
        }
    };

    openReportModal = () => {
        const { medicalReport } = this.state;

        const text = this.convertBufferToText(medicalReport);

        this.setState({
            showReportModal: true,
            reportText: text,
        });
    };

    closeReportModal = () => {
        this.setState({ showReportModal: false });
    };

    render() {
        let { scheduleStatus, appointmentId, doctorInfor, appointmentDate, appointmentTimeFrame } = this.state;
        // console.log("check state: ", this.state);
        return (
            <div className="appointment-item-for-patient-interface">
                <div className="doctor-avatar-and-appointment-time-container">
                    <div
                        className="doctor-avatar-section"
                        style={{
                            backgroundImage: `url(${doctorInfor?.image ? doctorInfor.image : defaultAvatar})`,
                        }}
                    ></div>
                    <div className="appointment-date-and-timeframe">
                        <label className="appointment-item-for-patient-label">Thời gian hẹn: </label>
                        <div className="appointment-date">
                            <FontAwesomeIcon icon={faCalendarDays} className="appointment-time-icon" />
                            <span>{appointmentDate && appointmentDate}</span>
                        </div>
                        <div className="appointment-timeframe">
                            <FontAwesomeIcon icon={faClock} className="appointment-time-icon" />
                            <span className="appointment-item-for-patient-content">{appointmentTimeFrame && appointmentTimeFrame}</span>
                        </div>
                    </div>
                </div>
                <div className="appointment-details-section">
                    <div className="appointment-id">
                        <label className="appointment-item-for-patient-label">Mã số cuộc hẹn:</label>
                        <span className="appointment-item-for-patient-content">{appointmentId && appointmentId}</span>
                    </div>

                    <div className="doctor-name">
                        <label className="appointment-item-for-patient-label">Bác sĩ: </label>
                        <span className="appointment-item-for-patient-content">
                            {doctorInfor && doctorInfor.positionData && doctorInfor.positionData.value_Vie}. {doctorInfor && doctorInfor.lastName && doctorInfor.lastName} {doctorInfor && doctorInfor.firstName && doctorInfor.firstName}
                        </span>
                    </div>
                    <div className="doctor-phone-number">
                        <label className="appointment-item-for-patient-label">Số điện thoại của bác sĩ: </label>
                        <span className="appointment-item-for-patient-content">{doctorInfor && doctorInfor.phoneNumber && doctorInfor.phoneNumber}</span>
                    </div>
                    <div className="doctor-email">
                        <label className="appointment-item-for-patient-label">Địa chỉ email của bác sĩ: </label>
                        <span className="appointment-item-for-patient-content">{doctorInfor && doctorInfor.email && doctorInfor.email}</span>
                    </div>
                    <div className="doctor-specialty">
                        <label className="appointment-item-for-patient-label">Chuyên ngành bác sĩ: </label>
                        <span className="appointment-item-for-patient-content">{doctorInfor.Doctor_infor && doctorInfor.Doctor_infor.belongToSpecialty && doctorInfor.Doctor_infor.belongToSpecialty.name}</span>
                    </div>
                    <div className="medical-report">
                        <label className="appointment-item-for-patient-label">Kết quả khám bệnh: </label>
                        {scheduleStatus === "S3" ? (
                            <span className="medical-report-available" onClick={this.openReportModal}>
                                <i className="fas fa-file-alt file-icon"></i>
                                Xem kết quả khám bệnh tại đây
                            </span>
                        ) : (
                            <span className="medical-report-unavailable">
                                <i>Chưa có kết quả khám bệnh</i>
                            </span>
                        )}
                    </div>
                    <div className="done-button-container-for-doctor">
                        <div
                            className="button-wrapper-1"
                            style={{
                                width: scheduleStatus === "S2" || scheduleStatus === "S3" ? "120px" : "215px",
                            }}
                        >
                            <button className={scheduleStatus === "S2" ? "done-button validate" : scheduleStatus === "S3" ? "done-button finish" : "done-button"}></button>
                        </div>

                        <div className="button-wrapper-2">
                            <button className={this.state.paymentStatus === "PT3" ? "paid-button validate" : "paid-button"} disabled={this.state.paymentMethod !== "PM3"}></button>
                        </div>
                    </div>
                </div>
                {this.state.showReportModal && (
                    <Portal>
                        <div className="modal-overlay" onClick={this.closeReportModal}>
                            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                                <div className="modal-header">
                                    <h3>Kết quả khám bệnh</h3>
                                    <span className="close-btn" onClick={this.closeReportModal}>
                                        ×
                                    </span>
                                </div>

                                <div className="modal-body">
                                    <pre className="report-content">{this.state.reportText}</pre>
                                </div>

                                <div className="modal-footer">
                                    <button className="close-button" onClick={this.closeReportModal}>
                                        Đóng
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Portal>
                )}
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppointmentItemForPatientInfterface));
