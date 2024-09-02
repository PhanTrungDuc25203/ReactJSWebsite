import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LANGUAGES } from '../../../utils';
import moment from 'moment';
import localization from 'moment/locale/vi';
import { getDoctorScheduleByDateService } from '../../../services/userService';

class DoctorScheduleSection extends Component {

    constructor(props) {
        super(props);
        this.state = {
            availableDays: [],
        }
    }

    async componentDidMount() {
        let { language } = this.props;
        this.buildSelectionOpion(language);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
            this.buildSelectionOpion(this.props.language);
        }
    }

    buildSelectionOpion = (language) => {
        let tempDateArr = [];
        for (let i = 0; i < 7; i++) {
            let object = {};

            if (language === LANGUAGES.VI) {
                object.label = moment(new Date()).add(i, 'days').format('dddd - DD/MM');
            } else if (language === LANGUAGES.EN) {
                object.label = moment(new Date()).add(i, 'days').locale('en').format('ddd - DD/MM');
            }

            object.value = moment(new Date()).add(i, 'days').startOf('day').valueOf();

            tempDateArr.push(object);
        }

        this.setState({
            availableDays: tempDateArr,
        })
    }

    handleOnChangeAtSelectBox = async (event) => {
        if (this.props.selectedDoctorId && this.props.selectedDoctorId !== -1) {
            let doctorId = this.props.selectedDoctorId;
            let date = event.target.value;

            let res = await getDoctorScheduleByDateService(doctorId, date);
            // console.log("Check res get schedule: ", res);
        }
    }

    render() {

        let { availableDays } = this.state;

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

