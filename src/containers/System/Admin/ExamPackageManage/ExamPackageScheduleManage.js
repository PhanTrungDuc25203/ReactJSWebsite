import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { LANGUAGES } from "../../../../utils";
import { connect } from "react-redux";
import "./ExamPackageScheduleManage.scss";
import * as actions from "../../../../store/actions";
import "react-markdown-editor-lite/lib/index.css";
import DatePicker from "../../../../components/Input/DatePicker";
import Select from "react-select";
import { toast } from "react-toastify";
import { createTimeframeForPackage } from "../../../../services/userService";
import _ from "lodash";

class ExamPackageScheduleManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listPackages: [],
      selectedPackage: {},
      selectedDay: new Date().setHours(0, 0, 0, 0),
      timeframe: [],
    };
  }

  async componentDidMount() {
    this.props.getAllExamPackage("ALL");
    this.props.fetchHoursInAllcodesForScheduleManagePage();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.allPackagesData !== this.props.allPackagesData) {
      let selectData = this.buildDataForPackageSelectBox(
        this.props.allPackagesData
      );
      this.setState({
        listPackages: selectData,
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
  }

  buildDataForPackageSelectBox = (data) => {
    let result = [];
    let { language } = this.props;
    if (data && data.length > 0) {
      data.map((item, index) => {
        let tempObj = {};
        let labelInVie = `${item.name}`;
        let labelInEng = `${item.name}`;
        tempObj.label = language === LANGUAGES.VI ? labelInVie : labelInEng;
        tempObj.value = item.id;
        result.push(tempObj);
      });
    }
    return result;
  };

  handleChangeOnSelectBox = async (selectedPackage) => {
    this.setState({ selectedPackage: selectedPackage });
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

  handleSaveScheduleButtonClicked = async () => {
    let { timeframe, selectedPackage, selectedDay } = this.state;
    let result = [];

    if (!selectedDay) {
      toast.error("Invalid or missing date!");
      return;
    }

    if (selectedPackage && _.isEmpty(selectedPackage)) {
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
          object.id = selectedPackage.value;
          object.timeType = schedule.keyMap;
          result.push(object);
        });
      } else {
        toast.error("Invalid selected time!");
        return;
      }
    }
    try {
      let response = await createTimeframeForPackage({
        scheduleArr: result,
        examPackageId: selectedPackage.value,
        formatedDate: formatedDate,
      });

      if (response && response.errCode === 0) {
        toast.success("Schedule saved successfully!");
      } else {
        toast.error(response.errMessage || "Failed to save schedule!");
      }
    } catch (error) {
      toast.error("An error occurred while saving the schedule!");
    }
  };

  render() {
    let { timeframe } = this.state;
    let { language, userInfo } = this.props;
    let tempObj = {};
    let labelInVie = `${userInfo.lastName} ${userInfo.firstName}`;
    let labelInEng = `${userInfo.firstName} ${userInfo.lastName}`;
    tempObj = language === LANGUAGES.VI ? labelInVie : labelInEng;
    return (
      <div className="schedule-for-packagemanage-page-container">
        <div className="schedule-for-packagepage-title">
          Thời gian biểu và lịch khám của Gói khám
        </div>
        <div className="content-container">
          <div className="container">
            <div className="row">
              <div className="col-md-6 form-group">
                <label>Chọn Gói khám</label>
                <Select
                  value={this.state.selectedPackage}
                  onChange={this.handleChangeOnSelectBox}
                  options={this.state.listPackages}
                  placeholder="Chọn gói khám..."
                />
              </div>
              <div className="col-md-6 form-group">
                <label>Chọn ngày hẹn và khung giờ của Gói khám</label>
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
              <button
                className="save-button btn btn-primary"
                onClick={() => this.handleSaveScheduleButtonClicked()}
              >
                Lưu ngày hẹn
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
    allPackagesData: state.admin.allPackagesData,
    examHoursData: state.admin.examHoursData,
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllExamPackage: (inputId) =>
      dispatch(actions.getAllExamPackage(inputId)),
    fetchHoursInAllcodesForScheduleManagePage: () =>
      dispatch(actions.fetchHoursInAllcodesForScheduleManagePage()),
    // createTimeframesForPackageSchedule: (result) => dispatch(actions.createTimeframesForPackageSchedule(result)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExamPackageScheduleManage);
