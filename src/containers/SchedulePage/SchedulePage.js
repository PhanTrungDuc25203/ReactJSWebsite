/* global Temporal */
import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions";
import ScheduleTable from "../../components/ScheduleTable/ScheduleTable";
import "./SchedulePage.scss";
import HomePageHeader from "../HomePage/HomePageHeader/HomePageHeader";
import CustomScrollbars from "../../components/CustomScrollbars";
import HomeFooter from "../../containers/HomePage/HomeFooter/HomeFooter";

class SchedulePage extends Component {
    render() {
        const sampleEvents = [
            {
                id: "1",
                title: "Khám tim mạch - BS. Nguyễn Văn A",
                start: Temporal.ZonedDateTime.from("2025-10-10T09:00+07:00[Asia/Bangkok]"),
                end: Temporal.ZonedDateTime.from("2025-10-10T10:30+07:00[Asia/Bangkok]"),
                description: "Phòng 201 - Tầng 2 - Bệnh viện Đa khoa",
            },
            {
                id: "2",
                title: "Khám da liễu - BS. Trần Thị B",
                start: Temporal.ZonedDateTime.from("2025-10-11T14:00+07:00[Asia/Bangkok]"),
                end: Temporal.ZonedDateTime.from("2025-10-11T15:30+07:00[Asia/Bangkok]"),
                description: "Phòng 305 - Tầng 3 - Cơ sở 2",
            },
        ];

        return (
            <CustomScrollbars style={{ height: "100vh", width: "100%" }}>
                <HomePageHeader isShowBanner={false} />
                <div className="schedule-page-container">
                    <h2>Lịch hẹn của bạn</h2>
                    <ScheduleTable events={sampleEvents} defaultView="week" />
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
