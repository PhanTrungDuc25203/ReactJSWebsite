import React, { Component } from "react";
import { connect } from "react-redux";
import "./HistoryOfAppointment.scss";
import moment from "moment";
import { getAppointmentHistoriesByPatientEmail } from "../../../services/userService";
import * as actions from "../../../store/actions";
import HistoryAppointmentItem from "./HistoryAppointmentItem";

class HistoryOfPatientAppointment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUserEmail: "",
            appointmentHistory: [],
            loading: false,
        };
    }

    async componentDidMount() {
        if (this.props.currentUserEmail) {
            this.setState({ currentUserEmail: this.props.currentUserEmail });
            await this.fetchAppointmentHistory(this.props.currentUserEmail);
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.currentUserEmail !== this.props.currentUserEmail) {
            this.setState({ currentUserEmail: this.props.currentUserEmail });
            this.fetchAppointmentHistory(this.props.currentUserEmail);
        }
    }

    fetchAppointmentHistory = async (email) => {
        this.setState({ loading: true });
        try {
            const response = await getAppointmentHistoriesByPatientEmail(email);
            if (response && response.data) {
                this.setState({ appointmentHistory: response.data });
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            this.setState({ loading: false });
        }
    };

    applyFilter = () => {
        const { filterOption, fromDate, toDate } = this.props;
        let updated = [...this.state.appointmentHistory];

        if (fromDate) {
            updated = updated.filter((a) => moment(a.date).isSameOrAfter(fromDate, "day"));
        }

        if (toDate) {
            updated = updated.filter((a) => moment(a.date).isSameOrBefore(toDate, "day"));
        }

        switch (filterOption) {
            case "date_asc":
                updated.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;

            case "date_desc":
                updated.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;

            case "pending": // chưa khám
                updated = updated.filter((a) => a.statusId === "S2");
                break;

            case "completed": // đã khám
                updated = updated.filter((a) => a.statusId === "S3");
                break;
        }

        return updated;
    };

    render() {
        const filtered = this.applyFilter();

        return <div className="patient-appointment-history-container">{filtered.length > 0 ? filtered.map((appointment, index) => <HistoryAppointmentItem key={index} appointment={appointment} userEmail={this.props.userEmail} />) : <p>Bạn không có lịch sử khám bệnh nào.</p>}</div>;
    }
}

const mapStateToProps = (state) => ({
    language: state.app.language,
    userEmail: state.user.userInfo.email,
});

const mapDispatchToProps = (dispatch) => ({
    processLogout: () => dispatch(actions.processLogout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(HistoryOfPatientAppointment);
