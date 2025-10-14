import React, { Component, createRef } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions";
import ScheduleTable from "../../components/ScheduleTable/ScheduleTable";
import "./SchedulePage.scss";
import HomePageHeader from "../HomePage/HomePageHeader/HomePageHeader";
import CustomScrollbars from "../../components/CustomScrollbars";
import HomeFooter from "../../containers/HomePage/HomeFooter/HomeFooter";
import { getAllRelativeBookingsOfCurrentSystemUser2Service } from "../../services/userService";
/* global Temporal */

class SchedulePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            combinedAppointments: {},
            events: [],
        };
        this.scheduleRef = createRef();
    }

    async componentDidMount() {
        if (this.props.match?.params?.email) {
            const userEmail = this.props.match.params.email;
            const bookingRes = await getAllRelativeBookingsOfCurrentSystemUser2Service(userEmail);

            if (bookingRes && bookingRes.errCode === 0) {
                const doctorAppointments = bookingRes.data.doctorHasAppointmentWithPatients || [];
                const patientAppointments = bookingRes.data.patientHasAppointmentWithDoctors || [];
                const roleId = this.props.userInfo?.roleId;

                const allAppointments = [...doctorAppointments, ...patientAppointments];

                const combineDateTime = (dateStr, timeStr) => {
                    if (!dateStr || !timeStr) return null;
                    const [hour, minute] = timeStr.split(":").map(Number);
                    const dateObj = new Date(dateStr);
                    const yyyy = dateObj.getFullYear();
                    const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
                    const dd = String(dateObj.getDate()).padStart(2, "0");
                    const hh = String(hour).padStart(2, "0");
                    const mi = String(minute).padStart(2, "0");
                    return `${yyyy}-${mm}-${dd}T${hh}:${mi}:00`;
                };

                const now = Temporal.Now.zonedDateTimeISO("UTC");

                const mappedEvents = allAppointments
                    .map((item, index) => {
                        const timeRange = item.appointmentTimeTypeData?.value_Vie || "";
                        const [startTime, endTime] = timeRange.split(" - ");
                        if (!startTime || !endTime) return null;

                        const startBase = combineDateTime(item.date, startTime);
                        const endBase = combineDateTime(item.date, endTime);
                        if (!startBase || !endBase) return null;

                        try {
                            const startIsoWithZone = `${startBase}+00:00[UTC]`;
                            const endIsoWithZone = `${endBase}+00:00[UTC]`;
                            const startZoned = Temporal.ZonedDateTime.from(startIsoWithZone);
                            const endZoned = Temporal.ZonedDateTime.from(endIsoWithZone);

                            // Xác định màu theo thời gian
                            const diffHours = (startZoned.epochMilliseconds - now.epochMilliseconds) / (1000 * 60 * 60);
                            let calendarId = "future";
                            if (endZoned.epochMilliseconds < now.epochMilliseconds) {
                                calendarId = "past";
                            } else if (diffHours <= 24 && diffHours > 0) {
                                calendarId = "soon";
                            }

                            if (roleId === "R2") {
                                const patient = item.patientHasAppointmentWithDoctors;
                                const patientName = patient ? `${patient.lastName || ""} ${patient.firstName || ""}`.trim() : "Bệnh nhân chưa xác định";

                                return {
                                    id: String(item.id || index + 1),
                                    title: `Khám cho bệnh nhân ${patientName}`,
                                    start: startZoned,
                                    end: endZoned,
                                    description: item.examReason,
                                    calendarId, // màu sự kiện
                                };
                            } else if (roleId === "R3") {
                                const doctor = item.doctorHasAppointmentWithPatients;
                                const doctorName = doctor ? `${doctor.lastName || ""} ${doctor.firstName || ""}`.trim() : "Bác sĩ chưa xác định";

                                return {
                                    id: String(item.id || index + 1),
                                    title: `Khám với BS. ${doctorName}`,
                                    start: startZoned,
                                    end: endZoned,
                                    location: doctor?.address || "Không có địa chỉ",
                                    calendarId,
                                };
                            }

                            return null;
                        } catch (err) {
                            console.error("Lỗi chuyển đổi thời gian:", err);
                            return null;
                        }
                    })
                    .filter(Boolean);

                this.setState({
                    combinedAppointments: { doctorAppointments, patientAppointments },
                    events: mappedEvents,
                });
            }
        }
    }

    handleGoToEvent = (event) => {
        const dateStr = event.start.toPlainDate().toString(); // Lấy yyyy-mm-dd
        this.scheduleRef.current?.goToDate(dateStr);
    };

    render() {
        const { events } = this.state;

        return (
            <CustomScrollbars style={{ height: "100vh", width: "100%" }}>
                <HomePageHeader isShowBanner={false} />
                <div className="schedule-page-container">
                    <div className="schedule-content">
                        <div className="calendar-section">
                            <ScheduleTable ref={this.scheduleRef} events={events} defaultView="week" />
                        </div>

                        <div className="appointment-list">
                            <h3>Danh sách lịch hẹn</h3>
                            {events.length === 0 && <p>Không có lịch hẹn</p>}
                            {events.map((event) => (
                                <div key={event.id} className={`appointment-item ${event.calendarId}`} onClick={() => this.handleGoToEvent(event)}>
                                    <p>
                                        <strong>{event.title}</strong>
                                    </p>
                                    <p>{event.start.toPlainDate().toString()}</p>
                                    <p>
                                        {event.start.toPlainTime().toString().slice(0, 5)} - {event.end.toPlainTime().toString().slice(0, 5)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <HomeFooter />
            </CustomScrollbars>
        );
    }
}

const mapStateToProps = (state) => ({
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
    language: state.app.language,
});

const mapDispatchToProps = (dispatch) => ({
    processLogout: () => dispatch(actions.processLogout()),
    switchLanguageOfWebsite: (language) => dispatch(actions.switchLanguageOfWebsite(language)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SchedulePage);
