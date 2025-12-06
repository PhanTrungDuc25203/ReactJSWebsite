import React, { PureComponent, Suspense, lazy } from "react";
import { connect } from "react-redux";
import "./AppointmentInProfilePage.scss";
import { withRouter } from "react-router";
import * as actions from "../../../store/actions";
import moment from "moment";
import queryString from "query-string";

const AppointmentItemForPatientInfterface = lazy(() => import("./AppointmentItemForPatientInfterface"));
const AppointmentItemForDoctorInfterface = lazy(() => import("./AppointmentItemForDoctorInfterface"));
const HistoryOfDoctorAppointment = lazy(() => import("./HistoryOfDoctorAppointment"));
const HistoryOfPatientAppointment = lazy(() => import("./HistoryOfPatientAppointment"));

class AppointmentInProfilePage extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            historyOrHandling: "handling",
            filterOption: "",
            fromDate: "",
            toDate: "",
        };
    }

    componentDidMount() {
        // lấy view từ URL
        const { location } = this.props;
        const parsed = queryString.parse(location.search);
        const historyOrHandling = parsed.view || "handling";
        this.setState({ historyOrHandling });
    }

    componentDidUpdate(prevProps) {
        // khi URL thay đổi, update state
        if (this.props.location.search !== prevProps.location.search) {
            const parsed = queryString.parse(this.props.location.search);
            const historyOrHandling = parsed.view || "handling";
            if (historyOrHandling !== this.state.historyOrHandling) {
                this.setState({ historyOrHandling });
            }
        }
    }

    handleHistoryOrHandlingButtonClicked = async () => {
        const { history, location, onRefreshAppointments } = this.props;
        const parsed = queryString.parse(location.search);
        const currentView = parsed.view || "handling";
        const newView = currentView === "history" ? "handling" : "history";

        history.push({
            pathname: location.pathname,
            search: `?tab=appointment&view=${newView}`,
        });

        if (newView === "handling" && typeof onRefreshAppointments === "function") {
            await onRefreshAppointments();
        }
    };

    getFilteredAppointments = (appointments) => {
        const { filterOption, fromDate, toDate } = this.state;

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

            case "pending":
                updated = updated.filter((item) => item.statusId === "S2");
                break;

            case "completed":
                updated = updated.filter((item) => item.statusId === "S3");
                break;

            default:
                break;
        }

        return updated;
    };

    renderAppointmentItems = (appointments, isDoctor) => {
        const { historyOrHandling } = this.state;
        const { currentUserEmail } = this.props;

        return (
            <div className="appointment-container">
                {historyOrHandling === "handling" ? (
                    <Suspense fallback={<div>Loading...</div>}>
                        {appointments.map(
                            (item, index) =>
                                (item.statusId !== "S3" || item.paymentStatus !== "PT3") && (
                                    <div className="appointment-item" key={index}>
                                        {isDoctor ? (
                                            item.statusId !== "S1" && (
                                                <AppointmentItemForDoctorInfterface
                                                    scheduleStatus={item.statusId}
                                                    appointmentId={item.id}
                                                    meetPatientId={item.patientId}
                                                    appointmentDate={moment(item.date).format("DD-MM-YYYY")}
                                                    appointmentTimeFrame={item.appointmentTimeTypeData?.value_Vie}
                                                    examReason={item.examReason}
                                                    patientBirthday={moment(item.patientBirthday).format("DD-MM-YYYY")}
                                                    patientAddress={item.patientAddress}
                                                    paymentMethod={item.paymentMethod}
                                                    paymentStatus={item.paymentStatus}
                                                    paidAmount={item.paidAmount}
                                                    files={item.files}
                                                    statusId={item.statusId}
                                                />
                                            )
                                        ) : (
                                            <AppointmentItemForPatientInfterface
                                                scheduleStatus={item.statusId}
                                                paymentStatus={item.paymentStatus}
                                                appointmentId={item.id}
                                                meetDoctorId={item.doctorId}
                                                appointmentDate={moment(item.date).format("DD-MM-YYYY")}
                                                appointmentTimeFrame={item.appointmentTimeTypeData?.value_Vie}
                                                medicalReport={item.files}
                                            />
                                        )}
                                    </div>
                                )
                        )}
                    </Suspense>
                ) : (
                    <Suspense fallback={<div>Loading...</div>}>
                        {isDoctor ? (
                            <HistoryOfDoctorAppointment currentUserEmail={currentUserEmail} filterOption={this.state.filterOption} fromDate={this.state.fromDate} toDate={this.state.toDate} />
                        ) : (
                            <HistoryOfPatientAppointment currentUserEmail={currentUserEmail} filterOption={this.state.filterOption} fromDate={this.state.fromDate} toDate={this.state.toDate} />
                        )}
                    </Suspense>
                )}
            </div>
        );
    };

    render() {
        const { historyOrHandling } = this.state;
        const { combinedAppointments, userRole } = this.props;

        return (
            <div className="appointment-in-profile-page">
                <div className="appointment-in-profile-page-header">
                    <div className="left-section">
                        <div className="appointment-in-profile-page-title">Danh sách lịch hẹn</div>
                        <div className="appointment-filter">
                            <select className="form-select" value={this.state.filterOption} onChange={(e) => this.setState({ filterOption: e.target.value })}>
                                <option value="">-- Lọc / Sắp xếp lịch hẹn --</option>
                                <option value="date_asc">Ngày khám (sớm → muộn)</option>
                                <option value="date_desc">Ngày khám (muộn → sớm)</option>
                                <option value="pending">Chưa khám</option>
                                <option value="completed">Đã khám</option>
                                {}
                                <option value="">-- Clear -- </option>
                            </select>
                            <div className="date-range">
                                <input type="date" value={this.state.fromDate} onChange={(e) => this.setState({ fromDate: e.target.value })} />

                                <span className="dash">~</span>

                                <input type="date" value={this.state.toDate} onChange={(e) => this.setState({ toDate: e.target.value })} />
                            </div>
                        </div>
                    </div>
                    <a className={historyOrHandling === "history" ? "btn-flip-backward" : "btn-flip"} data-back={historyOrHandling === "history" ? "Chưa khám" : "Lịch sử"} data-front={historyOrHandling === "history" ? "Lịch sử" : "Chưa khám"} onClick={this.handleHistoryOrHandlingButtonClicked} />
                </div>
                <div className="appointment-container">
                    {combinedAppointments.patientAppointments && combinedAppointments.patientAppointments.length > 0 ? this.renderAppointmentItems(this.getFilteredAppointments(combinedAppointments.patientAppointments), false) : userRole === "R3" && "Bạn chưa có lịch hẹn nào với bác sĩ"}

                    {combinedAppointments.doctorAppointments && combinedAppointments.doctorAppointments.length > 0 ? this.renderAppointmentItems(this.getFilteredAppointments(combinedAppointments.doctorAppointments), true) : userRole === "R2" && "Bạn chưa có lịch hẹn nào với bệnh nhân"}

                    {userRole === "R1" && "Bạn là admin nên không có gì trong này đâu:))"}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    language: state.app.language,
});

const mapDispatchToProps = (dispatch) => ({
    processLogout: () => dispatch(actions.processLogout()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppointmentInProfilePage));
