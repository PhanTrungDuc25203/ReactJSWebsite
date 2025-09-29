import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./HistoryOfAppointment.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {} from "@fortawesome/free-solid-svg-icons";
import { LANGUAGES } from "../../../utils";
import _ from "lodash";
import * as actions from "../../../store/actions";
import { MoonLoader } from "react-spinners";
import moment from "moment";
import { getAppointmentHistoriesByPatientEmail } from "../../../services/userService";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
import RateAndReviewForm from "./RateAndReview/RateAndReviewForm";

class HistoryOfPatientAppointment extends Component {
    constructor(props) {
        super(props);
        this.state = { currentUserEmail: "", appointmentHistory: [], loading: false, isOpenReviewModal: false, selectedAppointment: null };
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

    openReviewModal = (appointment) => {
        this.setState({
            isOpenReviewModal: true,
            selectedAppointment: appointment,
        });
    };

    toggleReviewModal = () => {
        this.setState({ isOpenReviewModal: !this.state.isOpenReviewModal });
    };

    fetchAppointmentHistory = async (email) => {
        this.setState({ loading: true });
        try {
            const response = await getAppointmentHistoriesByPatientEmail(email);
            if (response && response.data) {
                this.setState({ appointmentHistory: response.data });
            }
        } catch (error) {
            console.error("Error fetching appointment history:", error);
        } finally {
            this.setState({ loading: false });
        }
    };

    render() {
        let { appointmentHistory, isOpenReviewModal, selectedAppointment } = this.state;
        console.log("Check state: ", appointmentHistory);
        console.log("Check props: ", this.props);
        return (
            <div className="patient-appointment-history-container">
                {appointmentHistory && appointmentHistory.length > 0 ? (
                    appointmentHistory.map((appointment, index) => (
                        <div key={index} className="patient-appointment-history-item-list-container">
                            <div className="patient-appointment-history-item">
                                <div className="patient-appointment-history-item-id">
                                    <label className="patient-appointment-history-label">Mã số cuộc hẹn:</label>
                                    <span className="patient-appointment-history-content">{appointment && appointment.appointmentId && appointment.appointmentId}</span>
                                </div>
                                <div className="patient-appointment-history-item-patient-email">
                                    <label className="patient-appointment-history-label">Địa chỉ email của bác sĩ:</label>
                                    <span className="patient-appointment-history-content">{appointment && appointment.doctorEmail && appointment.doctorEmail}</span>
                                </div>
                                <div className="patient-appointment-history-item-date">
                                    <label className="patient-appointment-history-label">Ngày đã hẹn:</label>
                                    <span className="patient-appointment-history-content">{appointment && appointment.appointmentDate && moment(appointment.appointmentDate).format("DD-MM-YYYY")}</span>
                                </div>
                                <div className="patient-appointment-history-item-timeframe">
                                    <label className="patient-appointment-history-label">Khung giờ đã hẹn:</label>
                                    <span className="patient-appointment-history-content">{appointment && appointment.appointmentTimeFrameData && appointment.appointmentTimeFrameData.value_Vie && appointment.appointmentTimeFrameData.value_Vie}</span>
                                </div>
                            </div>
                            <div className="review-and-rate">
                                {!isOpenReviewModal && (
                                    <button className="review-and-comment-button" onClick={() => this.openReviewModal(appointment)}>
                                        <FontAwesomeIcon icon={faCommentDots} className="edit-icon" /> Nhận xét về dịch vụ
                                    </button>
                                )}
                                {isOpenReviewModal && (
                                    <RateAndReviewForm
                                        isOpen={isOpenReviewModal}
                                        toggleUserModal={this.toggleReviewModal}
                                        appointmentData={selectedAppointment}
                                        currentUserId={this.props.currentUserId} // truyền userId từ redux/props
                                    />
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Bạn không có lịch sử khám bệnh nào.</p>
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

export default connect(mapStateToProps, mapDispatchToProps)(HistoryOfPatientAppointment);
