import React, { Component } from "react";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import RateAndReviewModal from "./RateAndReview/RateAndReviewDoctorForm";
import { FormattedMessage } from "react-intl";
import { LANGUAGES, CommonUtils } from "../../../utils";
import { getRateAndReviewAboutDoctorService } from "../../../services/userService";

class HistoryAppointmentItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenReview: false,
            showReportModal: false,
            userEmail: "",
            appointment: "",
            reportText: "",

            // 🔥 NEW
            hasReview: false,
            reviewRating: null,
        };
    }

    async componentDidMount() {
        const { appointment, userEmail } = this.props;
        if (!appointment?.id) return;
        this.setState({ appointment, userEmail });
        try {
            const res = await getRateAndReviewAboutDoctorService({
                appointmentId: appointment.id,
            });

            if (res?.errCode === 0 && res.data) {
                this.setState({
                    hasReview: true,
                    reviewRating: res.data.rating,
                });
            }
        } catch (e) {
            console.error(e);
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

    getEmojiForRating = (rating) => {
        switch (rating) {
            case 1:
                return "😡";
            case 2:
                return "☹️";
            case 3:
                return "😐";
            case 4:
                return "😊";
            case 5:
                return "😁";
            default:
                return "⭐";
        }
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
                    {/* ĐÃ ĐÁNH GIÁ */}
                    {this.state.hasReview && !isOpenReview && (
                        <div className="review-summary">
                            <span className="rating-text">
                                {this.getEmojiForRating(this.state.reviewRating)} {this.state.reviewRating}
                            </span>
                            {` `}/ 5.0
                            <button className="review-and-comment-button" onClick={this.toggleReview}>
                                <FontAwesomeIcon icon={faPenToSquare} />
                                <FormattedMessage id="user-profile.history-page.update-review" />
                            </button>
                        </div>
                    )}

                    {/* CHƯA ĐÁNH GIÁ */}
                    {!this.state.hasReview && !isOpenReview && (
                        <button className="review-and-comment-button" onClick={this.toggleReview}>
                            <FontAwesomeIcon icon={faCommentDots} />
                            <FormattedMessage id="user-profile.history-page.review-service" />
                        </button>
                    )}
                </div>

                {/* Form review */}
                {isOpenReview && (
                    <RateAndReviewModal
                        isOpen={isOpenReview}
                        toggleUserModal={this.toggleReview}
                        appointmentData={appointment}
                        userEmail={userEmail}
                        doctorEmail={appointment.doctorHasAppointmentWithPatients?.email}
                        // 🔥 NEW
                        onReviewSaved={(rating) => {
                            this.setState({
                                hasReview: true,
                                reviewRating: rating,
                                isOpenReview: false,
                            });
                        }}
                    />
                )}

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
