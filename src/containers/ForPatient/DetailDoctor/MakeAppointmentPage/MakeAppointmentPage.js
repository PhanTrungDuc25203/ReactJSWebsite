import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import HomePageHeader from '../../../HomePage/HomePageHeader/HomePageHeader';
import './MakeAppointmentPage.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyCheckDollar, faCashRegister } from '@fortawesome/free-solid-svg-icons';
import { LANGUAGES } from '../../../../utils';
import defaultAvatar from '../../../../assets/images/default-avatar-circle.png';
import DatePicker from '../../../../components/Input/DatePicker';

class MakeAppointmentPage extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    async componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    handleDatePickerChanged = () => {

    }

    render() {

        return (
            <React.Fragment>
                <HomePageHeader />
                <div className="making-appointment-container">
                    <div className="content-left">
                        <div className="page-title">
                            Đặt lịch khám bệnh
                        </div>
                        <div className="doctor-relative">
                            <div className="doctor-avatar avatar-css" style={{ backgroundImage: `url(${defaultAvatar})` }}>

                            </div>
                            <div className="text-content">
                                <div className="doctor-general-infor">
                                    Phó giáo sư, Phan Trung Đức
                                </div>
                                <div className="specialty">
                                    Bác sĩ khoa sản phụ
                                </div>
                                <div className="appointment-time">
                                    8:00 - 9:00 ngày 05/09/2024
                                </div>
                            </div>
                        </div>
                        <div className="patient-relative">
                            <div className="exam-price">
                                <div className="exam-specialty">
                                    <FontAwesomeIcon icon={faMoneyCheckDollar} className="price-icon" />
                                    Giá khám sản phụ khoa
                                </div>
                                <div className="price">
                                    300,000đ
                                </div>
                            </div>
                            <div className="payment">
                                <div className="payment-method">
                                    <FontAwesomeIcon icon={faCashRegister} className="receipt-icon" />
                                    Thanh toán sau tại cơ sở y tế
                                </div>
                                <div className="receipt">
                                    Tổng thanh toán (phí đặt lịch miễn phí): 300,000đ
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="content-right">

                        <div className="medical-records">
                            <div className="content-right-title">
                                Hồ sơ khám bệnh
                            </div>
                            <div className="name-gender">
                                <div className="name-section">
                                    <label>Họ và tên</label>
                                    <input
                                        type="text"
                                    ></input>
                                </div>
                                <div className="gender-section">
                                    <label>Giới tính</label>
                                    <input type="radio" id="html" name="fav_language" value="HTML"></input>
                                    <label htmlFor="html">Nam</label>
                                    <input type="radio" id="css" name="fav_language" value="CSS"></input>
                                    <label htmlFor="css">Nữ</label>
                                    <input type="radio" id="javascript" name="fav_language" value="JavaScript"></input>
                                    <label htmlFor="javascript">Khác...</label>
                                </div>
                            </div>
                            <div className="dob">
                                <label>Ngày sinh</label>
                                <DatePicker
                                    onChange={this.handleDatePickerChanged}
                                    className="date-picker-section"
                                // value={this.state.selectedDay}
                                // minDate={new Date().setHours(0, 0, 0, 0)}
                                />
                            </div>
                            <div className="contact-address">
                                <div className="address">
                                    <label>Địa chỉ (Nơi ở)</label>
                                    <input
                                        type="text"
                                    ></input>
                                </div>
                                <div className="phone-number">
                                    <label>Số điện thoại</label>
                                    <input
                                        type="text"
                                    ></input>
                                </div>
                                <div className="email">
                                    <label>Hòm thư điện tử (Email)</label>
                                    <input
                                        type="email"
                                    ></input>
                                </div>
                            </div>
                            <div className="booking-for">
                                <label>Đặt cho ai</label>
                                <input
                                    type="text"
                                ></input>
                            </div>
                            <div className="reason">
                                <label>Lí do khám bệnh</label>
                                <textarea>

                                </textarea>
                            </div>
                            <div className="attention">

                            </div>
                            <div className="confirm-and-send">

                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(MakeAppointmentPage);
