import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { LANGUAGES } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import localization from 'moment/locale/vi';
import { getDoctorScheduleByDateService } from '../../../services/userService';

class DoctorScheduleSection extends Component {

    constructor(props) {
        super(props);
        this.state = {
            availableDays: [],
            allAvailableTimeframe: [],
        }
    }

    async componentDidMount() {
        let { language } = this.props;
        let tempDateArr = this.buildSelectionOpion(language);

        this.setState({
            availableDays: tempDateArr,
        })

    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
            let tempDateArr = this.buildSelectionOpion(this.props.language);
            this.setState({
                availableDays: tempDateArr,
            })
        }

        if (prevProps.selectedDoctorId !== this.props.selectedDoctorId) {
            let tempDateArr = this.buildSelectionOpion(this.props.language);
            if (tempDateArr && tempDateArr.length > 0) {
                let res = await getDoctorScheduleByDateService(this.props.selectedDoctorId, tempDateArr[0].value);
                this.setState({
                    allAvailableTimeframe: res.data ? res.data : [],
                })
            }
        }
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    buildSelectionOpion = (language) => {
        let tempDateArr = [];
        for (let i = 0; i < 7; i++) {
            let object = {};

            if (language === LANGUAGES.VI) {
                if (i === 0) {
                    let ddMM = moment(new Date()).format('DD/MM');
                    let today = `Hôm nay - ${ddMM}`;
                    object.label = today;
                } else {
                    let labelVi = moment(new Date()).add(i, 'days').format('dddd - DD/MM');
                    object.label = this.capitalizeFirstLetter(labelVi);
                }

            } else if (language === LANGUAGES.EN) {
                if (i === 0) {
                    let ddMM = moment(new Date()).format('DD/MM');
                    let today = `Today - ${ddMM}`;
                    object.label = today;
                } else {
                    object.label = moment(new Date()).add(i, 'days').locale('en').format('ddd - DD/MM');

                }
            }

            object.value = moment(new Date()).add(i, 'days').startOf('day').valueOf();
            tempDateArr.push(object);
        }

        return tempDateArr;
    }

    handleOnChangeAtSelectBox = async (event) => {
        if (this.props.selectedDoctorId && this.props.selectedDoctorId !== -1) {
            let doctorId = this.props.selectedDoctorId;
            let date = event.target.value;

            let res = await getDoctorScheduleByDateService(doctorId, date);

            let tempAllAvailableTimeframe = [];
            if (res && res.errCode === 0) {
                this.setState({
                    allAvailableTimeframe: res.data ? res.data : [],
                })
            }
            console.log("Check res get schedule: ", res);
        }
    }

    render() {

        let { availableDays, allAvailableTimeframe } = this.state;
        let { language } = this.props;

        return (
            <React.Fragment>
                <div className="available-day">
                    <select className="available-day-selection"
                        onChange={(event) => this.handleOnChangeAtSelectBox(event)}
                    >
                        {availableDays && availableDays.length > 0 &&
                            availableDays.map((item, index) => {
                                return (
                                    <option
                                        value={item.value}
                                        key={index}
                                    >
                                        {item.label}
                                    </option>
                                )
                            })
                        }

                    </select>
                </div>
                <div className="available-timeframe">
                    <div className="section-title">
                        <FontAwesomeIcon icon={faCalendarDays} className="calendar-icon" />
                        <FormattedMessage id="doctor-detail-page-for-patient.schedule-section.available-timeframe-section-title" />

                    </div>
                    <div className="timeframe-selection">
                        {allAvailableTimeframe && allAvailableTimeframe.length > 0 ?
                            allAvailableTimeframe.map((item, index) => {
                                let timeframe = language === LANGUAGES.VI ? item.timeTypeData.value_Vie : item.timeTypeData.value_Eng;
                                return (
                                    <button key={index} className="timeframe-button">{timeframe}</button>
                                )
                            })

                            :

                            <div className="sorry-text-because-noavailable-timeframe">
                                <FormattedMessage id="doctor-detail-page-for-patient.schedule-section.sorry-text" />
                            </div>
                        }
                    </div>
                </div>
                <div className="timeframe-in-one-day">

                </div>
            </React.Fragment >

        );
    }
}

const mapStateToProps = state => {
    return {
        // systemMenuPath: state.app.systemMenuPath,
        // isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorScheduleSection);

