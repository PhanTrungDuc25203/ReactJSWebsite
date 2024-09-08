import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import HomePageHeader from '../../../HomePage/HomePageHeader/HomePageHeader';
import './MakeAppointmentPage.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyCheckDollar, faCashRegister, faUser, faCalendar, faLocationDot, faMobileScreenButton, faEnvelope, faPeopleArrows } from '@fortawesome/free-solid-svg-icons';
import { getInforAndArticleForADoctor } from '../../../../services/userService';
import { LANGUAGES } from '../../../../utils';
import defaultAvatar from '../../../../assets/images/default-avatar-circle.png';
import DatePicker from '../../../../components/Input/DatePicker';
import { getAllCodesService } from "../../../../services/userService";
import { NumericFormat } from 'react-number-format';
import { FormattedMessage } from 'react-intl';
import * as actions from '../../../../store/actions';
import { patientInforWhenBookingAppointment } from '../../../../services/userService';
import { toast } from 'react-toastify';
import moment from 'moment';
import CustomScrollbars from '../../../../components/CustomScrollbars';

class MakeAppointmentPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            doctorDetails: {},
            timeframe: {},
            genderList: [],

            fullname: '',
            phoneNumber: '',
            email: '',
            address: '',
            reason: '',
            birthday: '',
            selectedGender: '',
            doctorId: '',
            timeType: '',
        }
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let res = await getInforAndArticleForADoctor(id);
            // console.log("Check doctor infor: ", res);
            if (res && res.errCode === 0) {
                this.setState({
                    doctorDetails: res.data,
                })
            }

            let timeframeArrRes = await getAllCodesService('time');
            if (timeframeArrRes && timeframeArrRes.data.length > 0) {
                let result = timeframeArrRes.data.find(item => item.keyMap === this.props.match.params.timeframe);
                if (result) {
                    this.setState({
                        timeframe: result,
                    })
                }
            }
            // let genderList = await getAllCodesService('gender');
            // if (genderList && genderList.data.length > 0) {
            //     this.setState({
            //         genderList: genderList.data,
            //     })
            // }
            this.props.getGenderList();
            // console.log("Check genderlist", this.state.genderList);
        }
    }

    appointmentDateFormat(language) {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let date = this.props.match.params.date;
            let appoitmentDate;
            if (language === LANGUAGES.VI) {
                appoitmentDate = this.state.timeframe.value_Vie + ' ngày ' + date;
            }
            if (language === LANGUAGES.EN) {
                appoitmentDate = 'At ' + this.state.timeframe.value_Eng + ' ~ ' + date;
            }
            return appoitmentDate;
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.genderList !== this.props.genderList) {
            if (this.props.genderList.length > 0) {
                this.setState({
                    genderList: this.props.genderList,
                })
            }
        }
        if (prevProps.language !== this.props.language) {

        }
    }

    handleDatePickerChanged = (date) => {
        this.setState({
            birthday: date[0],
        })
    }

    handleOnchangeInput = (event, eventId) => {
        let valueInput = event.target.value;
        let copyState = { ...this.state };
        copyState[eventId] = valueInput;
        this.setState({
            ...copyState,
        })
    }

    handleGenderChange = (event) => {
        this.setState({
            selectedGender: event.target.value, // Cập nhật selectedGender theo giá trị của radio button đã chọn
        });
    };

    handleSubmitForm = async () => {
        //validate input

        //call api
        let appointmentMoment = this.props.match.params.date;
        //chuyển dạng date về loại db có thể lưu được
        if (this.props.language === LANGUAGES.VI) {
            appointmentMoment = moment(appointmentMoment, 'dddd, DD-MM-YYYY', 'vi').toDate();
        }
        if (this.props.language === LANGUAGES.EN) {
            appointmentMoment = moment(appointmentMoment, 'ddd, DD-MM-YYYY', 'en').toDate();
        }

        let res = await patientInforWhenBookingAppointment({
            fullname: this.state.fullname,
            phoneNumber: this.state.phoneNumber,
            email: this.state.email,
            address: this.state.address,
            reason: this.state.reason,
            date: appointmentMoment, //ngày để lưu vào DB
            birthday: this.state.birthday,
            selectedGender: this.state.selectedGender,
            appointmentMoment: this.props.match.params.date,  //ngày để hiển thị dẽ dàng hơn
            doctorId: this.state.doctorDetails.id,
            timeType: this.state.timeframe.keyMap,
            language: this.props.language,
        });

        if (res && res.errCode === 0) {
            toast.success(`Record has been sent, wait for doctor's verification!`)
        } else {
            toast.error(`Send record fail!`)
        }
    }

    render() {

        let { doctorDetails } = this.state;
        // console.log('This doctor: ', this.state.doctorDetails)
        let { language } = this.props;
        let nameInVie = '';
        let nameInEng = '';
        if (doctorDetails && doctorDetails.positionData) {
            nameInVie = `${doctorDetails.positionData.value_Vie}, ${doctorDetails.lastName} ${doctorDetails.firstName}`;
            nameInEng = `${doctorDetails.positionData.value_Eng}, ${doctorDetails.firstName} ${doctorDetails.lastName}`;
        }

        let appointmentDate = this.appointmentDateFormat(language);
        console.log("check state in booking form: ", this.state);

        return (
            <React.Fragment>
                <CustomScrollbars>
                    <HomePageHeader />
                    <div className="making-appointment-container">
                        <div className="content-left">
                            <div className="page-title">
                                <FormattedMessage id="make-appointment-page.left-content.page-title" />
                            </div>
                            <div className="doctor-relative">
                                <div className="doctor-avatar avatar-css"
                                    style={{
                                        backgroundImage: `url(${doctorDetails.image
                                            ? doctorDetails.image
                                            : defaultAvatar
                                            })`
                                    }}
                                >

                                </div>
                                <div className="text-content">
                                    <div className="doctor-general-infor">
                                        {language === LANGUAGES.VI ? nameInVie : nameInEng}
                                    </div>
                                    <div className="specialty">
                                        <FormattedMessage id="make-appointment-page.left-content.specialty" />
                                    </div>
                                    <div className="appointment-time">
                                        {appointmentDate}
                                    </div>
                                </div>
                            </div>
                            <div className="patient-relative">
                                <div className="exam-price">
                                    <div className="exam-specialty">
                                        <FontAwesomeIcon icon={faMoneyCheckDollar} className="price-icon" />
                                        <FormattedMessage id="make-appointment-page.left-content.exam-price" />
                                    </div>
                                    <div className="price">
                                        {doctorDetails.Doctor_infor && doctorDetails.Doctor_infor.priceTypeData && language === LANGUAGES.EN &&
                                            <NumericFormat
                                                value={doctorDetails.Doctor_infor.priceTypeData.value_Eng}
                                                displayType='text'
                                                thousandSeparator=","
                                                suffix='$'
                                            />
                                        }
                                        {doctorDetails.Doctor_infor && doctorDetails.Doctor_infor.priceTypeData && language === LANGUAGES.VI &&
                                            <NumericFormat
                                                value={doctorDetails.Doctor_infor.priceTypeData.value_Vie}
                                                displayType='text'
                                                thousandSeparator=","
                                                suffix='đ'
                                            />
                                        }
                                    </div>
                                </div>
                                <div className="payment">
                                    <div className="payment-method">
                                        <FontAwesomeIcon icon={faCashRegister} className="receipt-icon" />
                                        <FormattedMessage id="make-appointment-page.left-content.payment-method" />
                                    </div>
                                    <div className="receipt">
                                        <span><FormattedMessage id="make-appointment-page.left-content.receipt" /> </span>
                                        {doctorDetails.Doctor_infor && doctorDetails.Doctor_infor.priceTypeData && language === LANGUAGES.EN &&
                                            <NumericFormat
                                                value={doctorDetails.Doctor_infor.priceTypeData.value_Eng}
                                                displayType='text'
                                                thousandSeparator=","
                                                suffix='$'
                                            />
                                        }
                                        {doctorDetails.Doctor_infor && doctorDetails.Doctor_infor.priceTypeData && language === LANGUAGES.VI &&
                                            <NumericFormat
                                                value={doctorDetails.Doctor_infor.priceTypeData.value_Vie}
                                                displayType='text'
                                                thousandSeparator=","
                                                suffix='đ'
                                            />
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="content-right">

                            <div className="medical-records">
                                <div className="content-right-title">
                                    <FormattedMessage id="make-appointment-page.right-content.title" />
                                </div>
                                <div className="name-gender">
                                    <div className="name-section">
                                        <label><FormattedMessage id="make-appointment-page.right-content.name" /></label>
                                        <div className="icon-and-input">
                                            <FontAwesomeIcon icon={faUser} className="input-icon" />
                                            <input
                                                type="text"
                                                value={this.state.fullname}
                                                onChange={(event) => this.handleOnchangeInput(event, 'fullname')}
                                            // placeholder={<FormattedMessage id="make-appointment-page.right-content.placeholder.name" />}
                                            ></input>
                                        </div>
                                    </div>
                                    <div className="gender-section">
                                        <label><FormattedMessage id="make-appointment-page.right-content.gender" /></label>
                                        {this.state.genderList && this.state.genderList.length > 0 && language === LANGUAGES.VI &&
                                            this.state.genderList.map((gender) => (
                                                <div key={gender.id}>
                                                    <input
                                                        className="radio-button-for-gender"
                                                        type="radio"
                                                        id={gender.keyMap}
                                                        name="gender"
                                                        value={gender.keyMap}
                                                        onChange={this.handleGenderChange}
                                                    />
                                                    <label htmlFor={gender.keyMap}>{gender.value_Vie}</label>
                                                </div>
                                            ))
                                        }

                                        {this.state.genderList && this.state.genderList.length > 0 && language === LANGUAGES.EN &&
                                            this.state.genderList.map((gender) => (
                                                <div key={gender.id}>
                                                    <input
                                                        className="radio-button-for-gender"
                                                        type="radio"
                                                        id={gender.keyMap}
                                                        name="gender"
                                                        value={gender.keyMap}
                                                        onChange={this.handleGenderChange}
                                                    />
                                                    <label htmlFor={gender.keyMap}>{gender.value_Eng}</label>
                                                </div>
                                            ))
                                        }

                                    </div>
                                </div>
                                <div className="dob">
                                    <label><FormattedMessage id="make-appointment-page.right-content.dob" /></label>
                                    <div className="icon-and-input">
                                        <FontAwesomeIcon icon={faCalendar} className="input-icon" />
                                        <DatePicker
                                            onChange={this.handleDatePickerChanged}
                                            className="date-picker-section"
                                            // placeholder={<FormattedMessage id="make-appointment-page.right-content.placeholder.dob" />}
                                            value={this.state.birthday}
                                        // minDate={new Date().setHours(0, 0, 0, 0)}
                                        />
                                    </div>
                                </div>
                                <div className="contact-address">
                                    <div className="address">
                                        <label><FormattedMessage id="make-appointment-page.right-content.address" /></label>
                                        <div className="icon-and-input">
                                            <FontAwesomeIcon icon={faLocationDot} className="input-icon" />
                                            <input
                                                type="text"
                                                value={this.state.address}
                                                onChange={(event) => this.handleOnchangeInput(event, 'address')}
                                            // placeholder={<FormattedMessage id="make-appointment-page.right-content.placeholder.address" />}
                                            ></input>
                                        </div>
                                    </div>
                                    <div className="phone-number">
                                        <label><FormattedMessage id="make-appointment-page.right-content.phonenum" /></label>
                                        <div className="icon-and-input">
                                            <FontAwesomeIcon icon={faMobileScreenButton} className="input-icon" />
                                            <input
                                                type="text"
                                                value={this.state.phoneNumber}
                                                onChange={(event) => this.handleOnchangeInput(event, 'phoneNumber')}
                                            // placeholder={<FormattedMessage id="make-appointment-page.right-content.placeholder.phonenum" />}
                                            ></input>
                                        </div>
                                    </div>
                                    <div className="email">
                                        <label><FormattedMessage id="make-appointment-page.right-content.email" /></label>
                                        <div className="icon-and-input">
                                            <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                                            <input
                                                type="email"
                                                value={this.state.email}
                                                onChange={(event) => this.handleOnchangeInput(event, 'email')}
                                            // placeholder={<FormattedMessage id="make-appointment-page.right-content.placeholder.email" />}
                                            ></input>
                                        </div>
                                    </div>
                                </div>
                                <div className="booking-for">
                                    <label><FormattedMessage id="make-appointment-page.right-content.booking-for" /></label>
                                    <div className="icon-and-input">
                                        <FontAwesomeIcon icon={faPeopleArrows} className="input-icon" />
                                        <input
                                            type="text"
                                        // placeholder={<FormattedMessage id="make-appointment-page.right-content.placeholder.booking-for" />}
                                        ></input>
                                    </div>
                                </div>
                                <div className="reason">
                                    <label><FormattedMessage id="make-appointment-page.right-content.reason" /></label>
                                    <textarea
                                        value={this.state.reason}
                                        onChange={(event) => this.handleOnchangeInput(event, 'reason')}
                                    // placeholder={<FormattedMessage id="make-appointment-page.right-content.placeholder.reason" />}
                                    >

                                    </textarea>
                                </div>
                                <div className="attention">

                                </div>
                                <div className="confirm-and-send">
                                    <div className="term">
                                        <span>Bằng việc xác nhận đặt khám, bạn hoàn toàn đống ý với </span>
                                        <a href="#">Điều khoản sử dụng</a>
                                        <span> của chúng tôi</span>
                                    </div>
                                    <div className="button">
                                        <button
                                            onClick={() => this.handleSubmitForm()}
                                        >Xác nhận đặt khám</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CustomScrollbars>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        // systemMenuPath: state.app.systemMenuPath,
        // isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        genderList: state.admin.genders,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenderList: () => dispatch(actions.fetchGenderValueStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MakeAppointmentPage);
