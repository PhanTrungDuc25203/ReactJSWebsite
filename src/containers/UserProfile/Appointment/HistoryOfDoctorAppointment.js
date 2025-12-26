import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./HistoryOfAppointment.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {} from "@fortawesome/free-solid-svg-icons";
import { LANGUAGES } from "../../../utils";
import { FormattedMessage } from "react-intl";
import _ from "lodash";
import * as actions from "../../../store/actions";
import { MoonLoader } from "react-spinners";
import moment from "moment";
import { getAppointmentHistoriesByDoctorEmail } from "../../../services/userService";

class HistoryOfDoctorAppointment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUserEmail: "",
            appointmentHistory: [],
            reportText: "",
            loading: false,
        };
    }

    async componentDidMount() {
        if (this.props && this.props.currentUserEmail) {
            this.setState({ currentUserEmail: this.props.currentUserEmail });
            await this.fetchAppointmentHistory(this.props.currentUserEmail);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.currentUserEmail !== this.props.currentUserEmail) {
            this.setState({ currentUserEmail: this.props.currentUserEmail });
            this.fetchAppointmentHistory(this.props.currentUserEmail);
        }
    }

    fetchAppointmentHistory = async (email) => {
        this.setState({ loading: true });
        try {
            const response = await getAppointmentHistoriesByDoctorEmail(email);
            if (response && response.data) {
                this.setState({
                    appointmentHistory: response.data,
                });
            }
        } catch (error) {
            console.error("Error fetching appointment history:", error);
        } finally {
            this.setState({ loading: false });
        }
    };

    filterAppointments = (appointments) => {
        const { filterOption, fromDate, toDate } = this.props;
        let updated = [...appointments];

        if (fromDate) {
            updated = updated.filter((item) => moment(item.date).isSameOrAfter(fromDate, "day"));
        }

        if (toDate) {
            updated = updated.filter((item) => moment(item.date).isSameOrBefore(toDate, "day"));
        }

        switch (filterOption) {
            case "date_asc":
                updated.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case "date_desc":
                updated.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;

            case "completed":
                updated = updated.filter((item) => item.statusId === "S3");
                break;

            case "pending":
                updated = updated.filter((item) => item.statusId === "S2");
                break;

            default:
                break;
        }

        return updated;
    };

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

    openReportModal = (appointment) => {
        const text = this.convertBufferToText(appointment.files);

        this.setState({
            showReportModal: true,
            reportText: text,
        });
    };

    closeReportModal = () => {
        this.setState({ showReportModal: false });
    };

    render() {
        let appointmentHistory = this.filterAppointments(this.state.appointmentHistory);

        return (
            <div className="doctor-appointment-history-container">
                {appointmentHistory && appointmentHistory.length > 0 ? (
                    appointmentHistory.map((appointment, index) => (
                        <div key={index} className="doctor-appointment-history-item">
                            <div className="doctor-appointment-history-item-id">
                                <label className="doctor-appointment-history-label">
                                    <FormattedMessage id="user-profile.history-page.appointment-id" />
                                </label>
                                <span className="doctor-appointment-history-content">{appointment && appointment.id}</span>
                            </div>
                            <div className="doctor-appointment-history-item-patient-email">
                                <label className="doctor-appointment-history-label">
                                    <FormattedMessage id="user-profile.history-page.patient-email" />
                                </label>
                                <span className="doctor-appointment-history-content">{appointment && appointment.patientHasAppointmentWithDoctors && appointment.patientHasAppointmentWithDoctors.email}</span>
                            </div>
                            <div className="doctor-appointment-history-item-date">
                                <label className="doctor-appointment-history-label">
                                    <FormattedMessage id="user-profile.history-page.date" />
                                </label>
                                <span className="doctor-appointment-history-content">{appointment && appointment.date && moment(appointment.date).format("DD-MM-YYYY")}</span>
                            </div>
                            <div className="doctor-appointment-history-item-timeframe">
                                <label className="doctor-appointment-history-label">
                                    <FormattedMessage id="user-profile.history-page.timeframe" />
                                </label>
                                <span className="doctor-appointment-history-content">{appointment && appointment.appointmentTimeTypeData && appointment.appointmentTimeTypeData.value_Vie && appointment.appointmentTimeTypeData.value_Vie}</span>
                            </div>
                            <div className="doctor-appointment-history-item-medical-report" onClick={() => this.openReportModal(appointment)}>
                                <label className="doctor-appointment-history-label">
                                    <FormattedMessage id="user-profile.history-page.medical-report" />
                                </label>
                                <i className="fas fa-file-alt file-icon"></i>
                                <FormattedMessage id="user-profile.history-page.see-medical-report" />
                            </div>
                            {this.state.showReportModal && (
                                <div className="modal-overlay">
                                    <div className="modal-container">
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
                            )}
                        </div>
                    ))
                ) : (
                    <p>Bạn không có lịch sử khám cho bệnh nhân.</p>
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

export default connect(mapStateToProps, mapDispatchToProps)(HistoryOfDoctorAppointment);
