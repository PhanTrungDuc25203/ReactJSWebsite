import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { LANGUAGES, dateFormat } from "../../../utils";
import { getInforAndArticleForADoctor } from "../../../services/userService";
import Select from "react-select";
import * as actions from "../../../store/actions";
import DatePicker from "../../../components/Input/DatePicker";
import { toast } from "react-toastify";
import _ from "lodash";
//package formatting date
import moment from "moment";

class ExamPackageResultManage extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {}

    render() {
        return <div className="exampackage-result-manage-page-container">this is staff's package result manage page</div>;
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        allDoctorsForDoctorArticlePage: state.admin.allDoctorsForDoctorArticlePage,
        examHoursData: state.admin.examHoursData,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllDoctorsForDoctorArticlePage: () => dispatch(actions.fetchAllDoctorsForDoctorArticlePage()),
        fetchHoursInAllcodesForScheduleManagePage: () => dispatch(actions.fetchHoursInAllcodesForScheduleManagePage()),
        createTimeframesForDoctorSchedule: (result) => dispatch(actions.createTimeframesForDoctorSchedule(result)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ExamPackageResultManage);
