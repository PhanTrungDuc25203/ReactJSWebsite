import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
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
import { Calendar, Clock, MapPin, Phone, Mail, Stethoscope, FileText, CreditCard, User, BookMarked } from "lucide-react";

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
        let { language } = this.props;
        const isVI = language === LANGUAGES.VI;

        return (
            <div className="appointment-item-for-patient-interface">
                <div className="doctor-profile-lite-container">
                    <div
                        className="doctor-avatar-section"
                        style={{
                            backgroundImage: `url(${doctorInfor?.image ? doctorInfor.image : defaultAvatar})`,
                        }}
                    ></div>
                    <div className="doctor-info-lite">
                        <div className="doctor-name">
                            {doctorInfor && doctorInfor.positionData && (language === LANGUAGES.VI ? doctorInfor.positionData.value_Vie : doctorInfor.positionData.value_Eng)}. {doctorInfor && doctorInfor.lastName && doctorInfor.lastName}{" "}
                            {doctorInfor && doctorInfor.firstName && doctorInfor.firstName}
                        </div>

                        <div className="doctor-specialty">
                            <Stethoscope size={14} />
                            {doctorInfor?.Doctor_infor?.belongToSpecialty?.name}
                        </div>
                    </div>
                </div>
                <div className="appointment-details-section">
                    <div className="appointment-id">
                        <label className="appointment-item-for-patient-label">
                            <BookMarked size={18} />
                            <FormattedMessage id="user-profile.appointment-page.patient.appointment-id" />
                        </label>
                        <span className="appointment-item-for-patient-content">{appointmentId && appointmentId}</span>
                    </div>
                    <div className="doctor-phone-number">
                        <label className="appointment-item-for-patient-label">
                            <Phone size={18} />
                            <FormattedMessage id="user-profile.appointment-page.patient.phonenumber" />
                        </label>
                        <span className="appointment-item-for-patient-content">{doctorInfor && doctorInfor.phoneNumber && doctorInfor.phoneNumber}</span>
                    </div>
                    <div className="doctor-email">
                        <label className="appointment-item-for-patient-label">
                            <Mail size={18} />
                            <FormattedMessage id="user-profile.appointment-page.patient.email" />
                        </label>
                        <span className="appointment-item-for-patient-content">{doctorInfor && doctorInfor.email && doctorInfor.email}</span>
                    </div>
                    <div className="doctor-location">
                        <label className="appointment-item-for-patient-label">
                            <MapPin size={18} />
                            <FormattedMessage id="user-profile.appointment-page.patient.exam-address" />
                        </label>
                        <div className="location">{doctorInfor?.Doctor_specialty_medicalFacility?.medicalFacilityDoctorAndSpecialty?.name}</div>
                    </div>
                    <span className="sublocation">
                        {" ~ "} {doctorInfor?.Doctor_specialty_medicalFacility?.medicalFacilityDoctorAndSpecialty?.address}
                    </span>
                    <div className="medical-report">
                        <label className="appointment-item-for-patient-label">
                            <FileText size={18} />
                            <FormattedMessage id="user-profile.appointment-page.patient.exam-result" />
                        </label>
                        {scheduleStatus === "S3" ? (
                            <span className="medical-report-available" onClick={this.openReportModal}>
                                <FormattedMessage id="user-profile.appointment-page.patient.see-result" />
                            </span>
                        ) : (
                            <span className="medical-report-unavailable">
                                <i>
                                    <FormattedMessage id="user-profile.appointment-page.patient.no-result-yet" />
                                </i>
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
                            <button
                                className={scheduleStatus === "S2" ? "done-button validate" : scheduleStatus === "S3" ? "done-button finish" : "done-button"}
                                data-unconfirmed={isVI ? "Chưa xác nhận đặt lịch" : "Appointment not confirmed"}
                                data-waiting={isVI ? "Chờ khám" : "Waiting"}
                                data-done={isVI ? "Đã khám" : "Completed"}
                            />
                        </div>
                        <div className="button-wrapper-2">
                            <button className={this.state.paymentStatus === "PT3" ? "paid-button validate" : "paid-button"} disabled={this.state.paymentMethod !== "PM3"} data-unpaid={isVI ? "Chưa thanh toán" : "Unpaid"} data-paid={isVI ? "Đã thanh toán" : "Paid"} />
                        </div>
                    </div>
                </div>
                <div className="appointment-time">
                    <div className="appointment-date">
                        📅
                        <span>{appointmentDate && appointmentDate}</span>
                    </div>
                    <div className="appointment-timeframe">
                        🕐
                        <span className="appointment-item-for-patient-content">{appointmentTimeFrame && appointmentTimeFrame}</span>
                    </div>
                </div>
                {this.state.showReportModal && (
                    <Portal>
                        <div className="modal-overlay" onClick={this.closeReportModal}>
                            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                                <div className="modal-header">
                                    <h3>
                                        <FormattedMessage id="user-profile.appointment-page.patient.result" />
                                    </h3>
                                    <span className="close-btn" onClick={this.closeReportModal}>
                                        ×
                                    </span>
                                </div>

                                <div className="modal-body">
                                    <pre className="report-content">{this.state.reportText}</pre>
                                </div>

                                <div className="modal-footer">
                                    <button className="close-button" onClick={this.closeReportModal}>
                                        <FormattedMessage id="user-profile.appointment-page.patient.close-btn" />
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
