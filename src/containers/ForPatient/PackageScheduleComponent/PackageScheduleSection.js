import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { LANGUAGES } from "../../../utils";
import { FormattedMessage } from "react-intl";
import moment from "moment";
import localization from "moment/locale/vi";
import { getPackageScheduleByDateService } from "../../../services/userService";
import { withRouter } from "react-router";

class PackageScheduleSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            availableDays: [],
            allAvailableTimeframe: [],
        };
    }

    async componentDidMount() {
        let { language } = this.props;
        let tempDateArr = this.buildSelectionOption(language);

        this.setState({
            availableDays: tempDateArr,
        });
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
            let tempDateArr = this.buildSelectionOption(this.props.language);
            this.setState({
                availableDays: tempDateArr,
            });
        }

        if (prevProps.selectedPackageId !== this.props.selectedPackageId) {
            let tempDateArr = this.buildSelectionOption(this.props.language);
            if (tempDateArr && tempDateArr.length > 0) {
                let res = await getPackageScheduleByDateService(this.props.selectedPackageId, tempDateArr[0].value);
                this.setState({
                    allAvailableTimeframe: res.data ? res.data : [],
                });
            }
        }
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    buildSelectionOption = (language) => {
        let tempDateArr = [];
        for (let i = 0; i < 7; i++) {
            let object = {};

            if (language === LANGUAGES.VI) {
                if (i === 0) {
                    let ddMM = moment(new Date()).format("DD/MM");
                    let today = `Hôm nay - ${ddMM}`;
                    object.label = today;
                } else {
                    let labelVi = moment(new Date()).add(i, "days").format("dddd - DD/MM");
                    object.label = this.capitalizeFirstLetter(labelVi);
                }
            } else if (language === LANGUAGES.EN) {
                if (i === 0) {
                    let ddMM = moment(new Date()).format("DD/MM");
                    let today = `Today - ${ddMM}`;
                    object.label = today;
                } else {
                    object.label = moment(new Date()).add(i, "days").locale("en").format("ddd - DD/MM");
                }
            }

            object.value = moment(new Date()).add(i, "days").startOf("day").valueOf();
            tempDateArr.push(object);
        }

        return tempDateArr;
    };

    handleOnChangeAtSelectBox = async (event) => {
        if (this.props.selectedPackageId && this.props.selectedPackageId !== -1) {
            let packageId = this.props.selectedPackageId;
            let date = event.target.value;
            let res = await getPackageScheduleByDateService(packageId, date);

            let tempAllAvailableTimeframe = [];
            if (res && res.errCode === 0) {
                this.setState({
                    allAvailableTimeframe: res.data ? res.data : [],
                });
            }
            // console.log("Check res get schedule: ", res);
        }
    };

    handleChoosingATimeframeForPeriodicExam = (pack) => {
        if (!this.props.userInfo || !this.props.userInfo.email) {
            this.props.history.push(`/login`);
        } else {
            let formattedDate;
            if (this.props.language === LANGUAGES.VI) {
                formattedDate = this.capitalizeFirstLetter(moment(pack.date).format("dddd, DD-MM-YYYY"));
            }
            if (this.props.language === LANGUAGES.EN) {
                formattedDate = moment(pack.date).locale("en").format("ddd, DD-MM-YYYY");
            }

            // Sau đó truyền formattedDate thay vì package.date
            this.props.history.push(`/booking-a-exam-package/${pack.examPackageId}/${formattedDate}/${pack.timeType}`);
        }
    };

    render() {
        let { availableDays, allAvailableTimeframe } = this.state;
        let { language } = this.props;

        return (
            <React.Fragment>
                <div className="available-day">
                    <select className="available-day-selection" onChange={(event) => this.handleOnChangeAtSelectBox(event)}>
                        {availableDays &&
                            availableDays.length > 0 &&
                            availableDays.map((item, index) => {
                                return (
                                    <option value={item.value} key={index}>
                                        {item.label}
                                    </option>
                                );
                            })}
                    </select>
                </div>
                <div className="available-timeframe">
                    <div className="section-title">
                        <FontAwesomeIcon icon={faCalendarDays} className="calendar-icon" />
                        <FormattedMessage id="doctor-detail-page-for-patient.schedule-section.available-timeframe-section-title" />
                    </div>
                    <div className="timeframe-selection">
                        {allAvailableTimeframe && allAvailableTimeframe.length > 0 ? (
                            allAvailableTimeframe.map((item, index) => {
                                let timeframe = language === LANGUAGES.VI ? item.timeTypeDataForPackage.value_Vie : item.timeTypeDataForPackage.value_Eng;
                                return (
                                    <button key={index} className="timeframe-button" onClick={() => this.handleChoosingATimeframeForPeriodicExam(item)}>
                                        {timeframe}
                                    </button>
                                );
                            })
                        ) : (
                            <div className="sorry-text-because-noavailable-timeframe">Xin lỗi quý khách, gói khám này đã kín lịch đăng ký!</div>
                        )}
                    </div>
                </div>
                <div className="timeframe-in-one-day"></div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        // systemMenuPath: state.app.systemMenuPath,
        // isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PackageScheduleSection));
