import React, { Component } from 'react';
import { connect } from "react-redux";
import './ScheduleAndTimetableManage.scss';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES, dateFormat } from "../../../utils";
import Select from 'react-select';
import * as actions from "../../../store/actions";
import DatePicker from '../../../components/Input/DatePicker';
//package formatting date
import moment from 'moment';

class ScheduleAndTimetableManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listDoctors: [],
            selectedDoctor: {},
            selectedDay: new Date(),
            timeframe: [],
        }
    }

    componentDidMount() {
        this.props.fetchAllDoctorsForDoctorArticlePage();
        this.props.fetchHoursInAllcodesForScheduleManagePage();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allDoctorsForDoctorArticlePage !== this.props.allDoctorsForDoctorArticlePage) {
            let selectData = this.buildDataForDoctorSelectBox(this.props.allDoctorsForDoctorArticlePage)
            this.setState({
                listDoctors: selectData,
            })
        }
        if (prevProps.examHoursData !== this.props.examHoursData) {
            this.setState({
                timeframe: this.props.examHoursData,
            })
        }
        // if (prevProps.language !== this.props.language) {
        //     let selectData = this.buildDataForDoctorSelectBox(this.props.allDoctorsForDoctorArticlePage)
        //     this.setState({
        //         listDoctors: selectData,
        //     })
        // }
    }

    buildDataForDoctorSelectBox = (data) => {
        let result = [];
        let { language } = this.props;
        if (data && data.length > 0) {
            data.map((item, index) => {
                let tempObj = {};
                let labelInVie = `${item.lastName} ${item.firstName}`;
                let labelInEng = `${item.firstName} ${item.lastName}`;
                tempObj.label = language === LANGUAGES.VI ? labelInVie : labelInEng;
                tempObj.value = item.id;
                result.push(tempObj);
            })

        }
        return result;
    }

    handleChangeOnSelectBox = async (selectedDoctor) => {
        this.setState({ selectedDoctor: selectedDoctor });
    }

    handleDatePickerChanged = (date) => {
        this.setState({
            selectedDay: date[0],
        })
    }

    render() {
        console.log("Check state: ", this.state);
        let { timeframe } = this.state;
        let { language } = this.props;
        return (
            <div className="schedule-manage-page-container">
                <div className="schedule-page-title">
                    <FormattedMessage id="schedule-and-timetable-manage-page.title" />
                </div>
                <div className="content-container">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6 form-group">
                                <label>
                                    <FormattedMessage id="schedule-and-timetable-manage-page.choose-dotor" />
                                </label>
                                <Select
                                    value={this.state.selectedDoctor}
                                    onChange={this.handleChangeOnSelectBox}
                                    options={this.state.listDoctors}
                                    placeholder="Chọn bác sĩ..."
                                />
                            </div>
                            <div className="col-md-6 form-group">
                                <label>
                                    <FormattedMessage id="schedule-and-timetable-manage-page.choose-day" />
                                </label>
                                <DatePicker
                                    onChange={this.handleDatePickerChanged}
                                    className="form-control"
                                    value={this.state.selectedDay}
                                    minDate={new Date()}
                                />
                            </div>
                            <div className="col-md-12 choose-time-frame">
                                {timeframe && timeframe.length > 0 &&
                                    timeframe.map((item, index) => {
                                        return (
                                            <button key={index} className="time-frame-button">
                                                {language === LANGUAGES.VI ? item.value_Vie : item.value_Eng}
                                            </button>
                                        )
                                    })

                                }
                            </div>
                            <div className="col-md-10 spacing">

                            </div>
                            <button className="save-button btn btn-primary">
                                <FormattedMessage id="schedule-and-timetable-manage-page.save-button" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        allDoctorsForDoctorArticlePage: state.admin.allDoctorsForDoctorArticlePage,
        examHoursData: state.admin.examHoursData,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctorsForDoctorArticlePage: () => dispatch(actions.fetchAllDoctorsForDoctorArticlePage()),
        fetchHoursInAllcodesForScheduleManagePage: () => dispatch(actions.fetchHoursInAllcodesForScheduleManagePage()),

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleAndTimetableManage);
