import React, { Component } from "react";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
import RateAndReviewModal from "./RateAndReview/RateAndReviewForm";

class HistoryAppointmentItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenReview: false,
        };
    }

    toggleReview = () => {
        this.setState({ isOpenReview: !this.state.isOpenReview });
    };

    render() {
        const { appointment, userEmail } = this.props;
        const { isOpenReview } = this.state;

        return (
            <div className="patient-appointment-history-item-list-container">
                {/* Zone thông tin */}
                <div className="patient-appointment-history-item">
                    <div>
                        <label>Mã cuộc hẹn:</label>
                        <span>{appointment.id}</span>
                    </div>

                    <div>
                        <label>Email bác sĩ:</label>
                        <span>{appointment.doctorHasAppointmentWithPatients?.email}</span>
                    </div>

                    <div>
                        <label>Ngày hẹn:</label>
                        <span>{moment(appointment.date).format("DD-MM-YYYY")}</span>
                    </div>

                    <div>
                        <label>Khung giờ:</label>
                        <span>{appointment.appointmentTimeTypeData?.value_Vie}</span>
                    </div>
                </div>

                {/* Nút mở review */}
                <div className="review-and-rate">
                    {!isOpenReview && (
                        <button className="review-and-comment-button" onClick={this.toggleReview}>
                            <FontAwesomeIcon icon={faCommentDots} /> Nhận xét về dịch vụ
                        </button>
                    )}
                </div>

                {/* Form review */}
                {isOpenReview && <RateAndReviewModal isOpen={isOpenReview} toggleUserModal={this.toggleReview} appointmentData={appointment} userEmail={userEmail} doctorEmail={appointment.doctorHasAppointmentWithPatients?.email} />}
            </div>
        );
    }
}

export default HistoryAppointmentItem;
