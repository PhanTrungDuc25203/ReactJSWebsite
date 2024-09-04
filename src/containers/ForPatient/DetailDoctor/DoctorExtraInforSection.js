import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHospitalUser, faMoneyCheckDollar, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { LANGUAGES } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import localization from 'moment/locale/vi';
import { getDoctorScheduleByDateService } from '../../../services/userService';

class DoctorExtraInforSection extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    async componentDidMount() {

    }

    async componentDidUpdate(prevProps, prevState, snapshot) {

    }

    render() {
        return (
            <React.Fragment>
                <div className="appointment-address-sct1">
                    <div className="sct1-title">
                        <FontAwesomeIcon icon={faHospitalUser} className="hospital-icon" />Địa chỉ khám:
                    </div>
                    <div className="clinic-name-and-address">
                        <div>
                            Bệnh viện Đa khoa Bảo Sơn 2
                        </div>
                           <div>
                            Số 52 Nguyễn Chí Thanh - Đống Đa - Hà Nội
                        </div>
                    </div>
                </div>
                <div className="examination-price-sct2">
                    <div className="sct2-title">
                        <FontAwesomeIcon icon={faMoneyCheckDollar} className="money-check-icon" />Giá khám:
                    </div>
                    <div className="examination-price">
                        300.000đ
                    </div>
                    <button className="more-button">
                        Xem thêm
                    </button>
                </div>
                <div className="insurance-sct3">
                    <div className="sct3-title">
                        <FontAwesomeIcon icon={faUserShield} className="insurance-icon" />
                        Bảo hiểm áp dụng:
                        <button className="more-button">
                            Xem thêm
                        </button>
                    </div>

                    <div className="applying-insurance">

                    </div>
                </div>
            </React.Fragment >

        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtraInforSection);

