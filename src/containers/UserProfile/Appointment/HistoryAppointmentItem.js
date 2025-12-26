import React, { Component } from "react";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
import RateAndReviewModal from "./RateAndReview/RateAndReviewForm";
import { FormattedMessage } from "react-intl";
import { LANGUAGES, CommonUtils } from "../../../utils";

class HistoryAppointmentItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenReview: false,
            showReportModal: false,
            userEmail: "",
            appointment: "",
            reportText: "",
        };
    }

    componentDidMount() {
        if (this.props && this.props.appointment && this.props.userEmail) {
            this.setState({
                appointment: this.props.appointment,
                userEmail: this.props.userEmail,
            });
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.appointment !== this.props.appointment || prevProps.userEmail !== this.props.userEmail) {
            this.setState({
                appointment: this.props.appointment,
                userEmail: this.props.userEmail,
            });
        }
    }

    toggleReview = () => {
        this.setState({ isOpenReview: !this.state.isOpenReview });
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

    openReportModal = () => {
        const text = this.convertBufferToText(this.state.appointment.files);

        this.setState({
            showReportModal: true,
            reportText: text,
        });
    };

    closeReportModal = () => {
        this.setState({ showReportModal: false });
    };

    render() {
        const { appointment, userEmail, isOpenReview } = this.state;

        return (
            <div className="patient-appointment-history-item-list-container">
                {/* Zone thông tin */}
                <div className="patient-appointment-history-item">
                    <div>
                        <label className="patient-appointment-history-item-label">
                            <FormattedMessage id="user-profile.history-page.appointment-id" />
                        </label>
                        <span>{appointment.id}</span>
                    </div>

                    <div>
                        <label className="patient-appointment-history-item-label">
                            <FormattedMessage id="user-profile.history-page.doctor-email" />
                        </label>
                        <span>{appointment.doctorHasAppointmentWithPatients?.email}</span>
                    </div>

                    <div>
                        <label className="patient-appointment-history-item-label">
                            <FormattedMessage id="user-profile.history-page.date" />
                        </label>
                        <span>{moment(appointment.date).format("DD-MM-YYYY")}</span>
                    </div>

                    <div>
                        <label className="patient-appointment-history-item-label">
                            <FormattedMessage id="user-profile.history-page.timeframe" />
                        </label>
                        <span>{appointment.appointmentTimeTypeData?.value_Vie}</span>
                    </div>
                    <div className="medical-report" onClick={this.openReportModal}>
                        <label className="patient-appointment-history-item-label">
                            <FormattedMessage id="user-profile.history-page.exam-result" />
                        </label>
                        <span>
                            <i className="fas fa-file-alt file-icon"></i>
                            <FormattedMessage id="user-profile.history-page.see-result" />
                        </span>
                    </div>
                </div>

                {/* Nút mở review */}
                <div className="review-and-rate">
                    {!isOpenReview && (
                        <button className="review-and-comment-button" onClick={this.toggleReview}>
                            <FontAwesomeIcon icon={faCommentDots} />
                            <FormattedMessage id="user-profile.history-page.review-service" />
                        </button>
                    )}
                </div>

                {/* Form review */}
                {isOpenReview && <RateAndReviewModal isOpen={isOpenReview} toggleUserModal={this.toggleReview} appointmentData={appointment} userEmail={userEmail} doctorEmail={appointment.doctorHasAppointmentWithPatients?.email} />}
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
        );
    }
}

export default HistoryAppointmentItem;
