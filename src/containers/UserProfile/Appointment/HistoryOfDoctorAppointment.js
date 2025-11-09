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
import { getAppointmentHistoriesByDoctorEmail } from "../../../services/userService";

class HistoryOfDoctorAppointment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUserEmail: "",
            appointmentHistory: [],
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
                this.setState({ appointmentHistory: response.data });
            }
        } catch (error) {
            console.error("Error fetching appointment history:", error);
        } finally {
            this.setState({ loading: false });
        }
    };

    render() {
        let { appointmentHistory } = this.state;
        return (
            <div className="doctor-appointment-history-container">
                {appointmentHistory && appointmentHistory.length > 0 ? (
                    appointmentHistory.map((appointment, index) => (
                        <div key={index} className="doctor-appointment-history-item">
                            <div className="doctor-appointment-history-item-id">
                                <label className="doctor-appointment-history-label">Mã số cuộc hẹn:</label>
                                <span className="doctor-appointment-history-content">{appointment && appointment.id}</span>
                            </div>
                            <div className="doctor-appointment-history-item-patient-email">
                                <label className="doctor-appointment-history-label">Địa chỉ email của bệnh nhân:</label>
                                <span className="doctor-appointment-history-content">{appointment && appointment.patientHasAppointmentWithDoctors && appointment.patientHasAppointmentWithDoctors.email}</span>
                            </div>
                            <div className="doctor-appointment-history-item-date">
                                <label className="doctor-appointment-history-label">Ngày đã hẹn:</label>
                                <span className="doctor-appointment-history-content">{appointment && appointment.date && moment(appointment.date).format("DD-MM-YYYY")}</span>
                            </div>
                            <div className="doctor-appointment-history-item-timeframe">
                                <label className="doctor-appointment-history-label">Khung giờ đã hẹn:</label>
                                <span className="doctor-appointment-history-content">{appointment && appointment.appointmentTimeTypeData && appointment.appointmentTimeTypeData.value_Vie && appointment.appointmentTimeTypeData.value_Vie}</span>
                            </div>
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
