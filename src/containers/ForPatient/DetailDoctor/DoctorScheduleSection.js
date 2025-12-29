import React, { Component } from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { LANGUAGES } from "../../../utils";
import { FormattedMessage } from "react-intl";
import moment from "moment";
import { getDoctorScheduleByDateService } from "../../../services/userService";
import { withRouter } from "react-router";

class DoctorScheduleSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            availableDays: [],
            allAvailableTimeframe: [],
            bookedTimeTypes: [], // <== thêm state này
        };
    }

    async componentDidMount() {
        let { language } = this.props;
        let tempDateArr = this.buildSelectionOption(language);
        this.setState({ availableDays: tempDateArr });
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.language !== this.props.language) {
            let tempDateArr = this.buildSelectionOption(this.props.language);
            this.setState({ availableDays: tempDateArr });
        }

        if (prevProps.selectedDoctorId !== this.props.selectedDoctorId) {
            let tempDateArr = this.buildSelectionOption(this.props.language);
            if (tempDateArr && tempDateArr.length > 0) {
                await this.fetchDoctorSchedule(this.props.selectedDoctorId, tempDateArr[0].value);
            }
        }
    }

    buildSelectionOption = (language) => {
        let tempDateArr = [];
        for (let i = 0; i < 7; i++) {
            let object = {};
            if (language === LANGUAGES.VI) {
                if (i === 0) {
                    let ddMM = moment(new Date()).format("DD/MM");
                    object.label = `Hôm nay - ${ddMM}`;
                } else {
                    let labelVi = moment(new Date()).add(i, "days").format("dddd - DD/MM");
                    object.label = labelVi.charAt(0).toUpperCase() + labelVi.slice(1);
                }
            } else {
                if (i === 0) {
                    let ddMM = moment(new Date()).format("DD/MM");
                    object.label = `Today - ${ddMM}`;
                } else {
                    object.label = moment(new Date()).add(i, "days").locale("en").format("ddd - DD/MM");
                }
            }
            object.value = moment(new Date()).add(i, "days").startOf("day").valueOf();
            tempDateArr.push(object);
        }
        return tempDateArr;
    };

    fetchDoctorSchedule = async (doctorId, date) => {
        let res = await getDoctorScheduleByDateService(doctorId, date);
        if (res && res.errCode === 0) {
            const bookedTimeTypes = (res.bookedSchedule || []).map((item) => item.timeType);
            this.setState({
                allAvailableTimeframe: res.data || [],
                bookedTimeTypes,
            });
        }
    };

    handleOnChangeAtSelectBox = async (event) => {
        if (this.props.selectedDoctorId && this.props.selectedDoctorId !== -1) {
            await this.fetchDoctorSchedule(this.props.selectedDoctorId, event.target.value);
        }
    };

    handleChoosingATimeframeForAppointment = (doctor) => {
        if (!this.props.userInfo || !this.props.userInfo.email) {
            this.props.history.push(`/login`);
        } else {
            let formattedDate = this.props.language === LANGUAGES.VI ? moment(doctor.date).format("dddd, DD-MM-YYYY") : moment(doctor.date).locale("en").format("ddd, DD-MM-YYYY");

            this.props.history.push(`/make-appointment/${doctor.doctorId}/${formattedDate}/${doctor.timeType}`);
        }
    };

    render() {
        let { availableDays, allAvailableTimeframe, bookedTimeTypes } = this.state;
        let { language } = this.props;

        return (
            <React.Fragment>
                <div className="available-day">
                    <select className="available-day-selection" onChange={this.handleOnChangeAtSelectBox}>
                        {availableDays.map((item, index) => (
                            <option value={item.value} key={index}>
                                {item.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="available-timeframe">
                    <div className="section-title">
                        <FontAwesomeIcon icon={faCalendarDays} className="calendar-icon" />
                        <FormattedMessage id="doctor-detail-page-for-patient.schedule-section.available-timeframe-section-title" />
                    </div>

                    <div className="timeframe-selection">
                        {allAvailableTimeframe.length > 0 ? (
                            allAvailableTimeframe.map((item, index) => {
                                const timeframe = language === LANGUAGES.VI ? item.timeTypeData.value_Vie : item.timeTypeData.value_Eng;

                                const isBooked = bookedTimeTypes.includes(item.timeType);

                                return (
                                    <button key={index} className={`timeframe-button ${isBooked ? "booked has-tooltip" : ""}`} disabled={isBooked} onClick={() => !isBooked && this.handleChoosingATimeframeForAppointment(item)}>
                                        {timeframe}
                                        {isBooked && (
                                            <span className="tooltip-text">
                                                <FormattedMessage id="doctor-detail-page-for-patient.schedule-section.sorry-text-2" />
                                            </span>
                                        )}
                                    </button>
                                );
                            })
                        ) : (
                            <div className="sorry-text-because-noavailable-timeframe">
                                <FormattedMessage id="doctor-detail-page-for-patient.schedule-section.sorry-text" />
                            </div>
                        )}
                    </div>
                </div>

                <style>{`
                    .timeframe-button {
                        position: relative;
                        margin: 6px;
                        padding: 8px 14px;
                        border-radius: 8px;
                        border: 1px solid #ccc;
                        background-color: #f5f5f5;
                        cursor: pointer;
                        transition: 0.2s;
                    }

                    .timeframe-button.booked {
                        background-color: #ddd;
                        cursor: not-allowed;
                        opacity: 0.6;
                    }

                    /* Tooltip */
                    .timeframe-button.has-tooltip .tooltip-text {
                        visibility: hidden;
                        opacity: 0;
                        width: max-content;
                        background-color: rgba(0, 0, 0, 0.95);
                        color: #fff;
                        text-align: center;
                        border-radius: 6px;
                        padding: 5px 10px;
                        position: absolute;
                        z-index: 10;
                        bottom: 125%; /* hiển thị ở phía trên */
                        left: 50%;
                        transform: translateX(-50%);
                        transition: opacity 0.3s;
                        font-size: 13px;
                        pointer-events: none;
                        white-space: nowrap;
                    }

                    .timeframe-button.has-tooltip:hover .tooltip-text {
                        visibility: visible;
                        opacity: 1;
                    }
                `}</style>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    language: state.app.language,
    userInfo: state.user.userInfo,
});

export default withRouter(connect(mapStateToProps)(DoctorScheduleSection));
