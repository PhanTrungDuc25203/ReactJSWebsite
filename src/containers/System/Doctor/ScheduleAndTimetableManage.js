import React, { Component } from "react";
import { connect } from "react-redux";
import "./ScheduleAndTimetableManage.scss";
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

class ScheduleAndTimetableManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listDoctors: [],
      selectedDoctor: {},
      selectedDay: new Date().setHours(0, 0, 0, 0),
      timeframe: [],
    };
  }

  componentDidMount() {
    this.props.fetchAllDoctorsForDoctorArticlePage();
    this.props.fetchHoursInAllcodesForScheduleManagePage();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevProps.allDoctorsForDoctorArticlePage !==
      this.props.allDoctorsForDoctorArticlePage
    ) {
      let selectData = this.buildDataForDoctorSelectBox(
        this.props.allDoctorsForDoctorArticlePage
      );
      this.setState({
        listDoctors: selectData,
      });
    }
    if (prevProps.examHoursData !== this.props.examHoursData) {
      let data = this.props.examHoursData;
      if (data && data.length > 0) {
        data = data.map((item) => ({ ...item, isSelected: false }));
      }
      this.setState({
        timeframe: data,
      });
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
      });
    }
    return result;
  };

  handleChangeOnSelectBox = async (selectedDoctor) => {
    this.setState({ selectedDoctor: selectedDoctor });
  };

  handleDatePickerChanged = (date) => {
    this.setState({
      selectedDay: date[0],
    });
  };

  handleTimeFrameClicked = (time) => {
    let { timeframe } = this.state;
    if (timeframe && timeframe.length > 0) {
      timeframe = timeframe.map((item) => {
        if (item.id === time.id) item.isSelected = !item.isSelected;
        return item;
      });
      this.setState({
        timeframe: timeframe,
      });
    }
  };

  handleSaveScheduleButtonClicked = () => {
    let { timeframe, selectedDoctor, selectedDay } = this.state;
    let result = [];

    if (!selectedDay) {
      toast.error("Invalid or missing date!");
      return;
    }

    if (selectedDoctor && _.isEmpty(selectedDoctor)) {
      toast.error("Invalid selcted doctor!");
      return;
    }

    // let formatedDate = moment(selectedDay).format(dateFormat.SEND_TO_SERVER);
    let formatedDate = new Date(selectedDay).getTime();

    if (timeframe && timeframe.length > 0) {
      let selectedTimeTemp = timeframe.filter(
        (item) => item.isSelected === true
      );
      if (selectedTimeTemp && selectedTimeTemp.length > 0) {
        selectedTimeTemp.map((schedule, index) => {
          let object = {};
          object.date = formatedDate;
          object.doctorId = selectedDoctor.value;
          object.timeType = schedule.keyMap;
          result.push(object);
        });
      } else {
        toast.error("Invalid selected time!");
        return;
      }
    }
    this.props.createTimeframesForDoctorSchedule({
      scheduleArr: result,
      doctorId: selectedDoctor.value,
      formatedDate: formatedDate,
    });
    console.log("Check result: ", result);
  };

  checkIfThisDoctorIsInDoctorList = (thisDoctor, doctorList) => {
    // Tìm đối tượng bác sĩ trong danh sách dựa trên trường 'name'
    console.log("check doctor list: ", doctorList);
    let foundDoctor = doctorList.find((doctor) => doctor.label === thisDoctor);

    // Nếu tìm thấy bác sĩ, trả về đối tượng chứa tên và id
    if (foundDoctor) {
      return [
        {
          label: foundDoctor.label,
          value: foundDoctor.value,
        },
      ];
    }

    // Nếu không tìm thấy, trả về null
    return null;
  };

  render() {
    // console.log("Check state: ", this.state);
    let { timeframe } = this.state;
    let { language, userInfo } = this.props;
    console.log("Check props: ", userInfo);
    let tempObj = {};
    let labelInVie = `${userInfo.lastName} ${userInfo.firstName}`;
    let labelInEng = `${userInfo.firstName} ${userInfo.lastName}`;
    tempObj = language === LANGUAGES.VI ? labelInVie : labelInEng;
    let checkPresentInDoctorList = this.checkIfThisDoctorIsInDoctorList(
      tempObj,
      this.state.listDoctors
    );
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
                  options={
                    checkPresentInDoctorList
                      ? checkPresentInDoctorList
                      : this.state.listDoctors
                  }
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
                  minDate={new Date().setHours(0, 0, 0, 0)}
                />
              </div>
              <div className="col-md-12 choose-time-frame">
                {timeframe &&
                  timeframe.length > 0 &&
                  timeframe.map((item, index) => {
                    return (
                      <button
                        key={index}
                        className={
                          item.isSelected === true
                            ? "time-frame-button active"
                            : "time-frame-button"
                        }
                        onClick={() => this.handleTimeFrameClicked(item)}
                      >
                        {language === LANGUAGES.VI
                          ? item.value_Vie
                          : item.value_Eng}
                      </button>
                    );
                  })}
              </div>
              <div className="col-md-10 spacing"></div>
              <button
                className="save-button btn btn-primary"
                onClick={() => this.handleSaveScheduleButtonClicked()}
              >
                <FormattedMessage id="schedule-and-timetable-manage-page.save-button" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
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
    fetchAllDoctorsForDoctorArticlePage: () =>
      dispatch(actions.fetchAllDoctorsForDoctorArticlePage()),
    fetchHoursInAllcodesForScheduleManagePage: () =>
      dispatch(actions.fetchHoursInAllcodesForScheduleManagePage()),
    createTimeframesForDoctorSchedule: (result) =>
      dispatch(actions.createTimeframesForDoctorSchedule(result)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScheduleAndTimetableManage);
