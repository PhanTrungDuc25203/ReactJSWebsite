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
            isShowPriceDetail: false,
            isShowInsurenceDetail: false,
        }
    }

    async componentDidMount() {

    }

    async componentDidUpdate(prevProps, prevState, snapshot) {

    }

    handleMoreButtonClicked = (status, isShow) => {

        if (isShow === 'price') {
            this.setState({
                isShowPriceDetail: status,
            })
        }
        if (isShow === 'insurance') {
            this.setState({
                isShowInsurenceDetail: status,
            })
        }
    }

    render() {

        let { isShowPriceDetail, isShowInsurenceDetail } = this.state;

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
                <div className={isShowPriceDetail === false ? "examination-price-sct2 css-for-less-content" : "examination-price-sct2"}>
                    <div className="sct2-title">
                        <FontAwesomeIcon icon={faMoneyCheckDollar} className="money-check-icon" />Giá khám:
                    </div>
                    {isShowPriceDetail === false ?
                        <React.Fragment>
                            <div className="examination-price">
                                300.000đ
                            </div>
                            <button className="more-button"
                                onClick={() => this.handleMoreButtonClicked(true, 'price')}
                            >
                                Xem thêm
                            </button>
                        </React.Fragment>
                        :
                        <div className="price-detail">
                            <div className="price-in-detail">
                                <div className="section-content">Chưa bao gồm chi phí siêu âm, xét nghiệm</div>
                                <div className="price">300.000đ</div>
                            </div>
                            <div className="sale-promotion">
                                Miễn phí khám thai khi khách hàng mua phiếu siêu âm thai 2D hoặc 5D (khám thai 0đ)
                            </div>
                            <div className="payment-method">
                                Bệnh viện có thanh toán bằng hình thức tiền mặt và quẹt thẻ
                            </div>

                            <div className="less-button-container">
                                <button className="less-button"
                                    onClick={() => this.handleMoreButtonClicked(false, 'price')}
                                >
                                    Thu gọn
                                </button>
                            </div>

                        </div>
                    }

                </div>
                <div className={isShowInsurenceDetail === false ? "insurance-sct3 css-for-less-content" : "insurance-sct3"}>
                    <div className="sct3-title">
                        <FontAwesomeIcon icon={faUserShield} className="insurance-icon" />
                        Bảo hiểm áp dụng:
                    </div>
                    {isShowInsurenceDetail === false ?
                        <React.Fragment>
                            <button className="more-button"
                                onClick={() => this.handleMoreButtonClicked(true, 'insurance')}
                            >
                                Xem thêm
                            </button>
                        </React.Fragment>
                        :
                        <div className="insurance-detail">
                            <div className="insurance-type-1">
                                <div>Bảo hiểm y tế nhà nước</div>
                                <div className="section-content">Áp dụng với Bảo hiểm y tế hạng 3 (bao gồm BHYT ở Phường, Quận TPHCM và Tỉnh)</div>
                            </div>
                            <div className="insurance-type-2">
                                <div>Bảo hiểm bảo lãnh</div>
                                <div className="section-content">Đối với các đơn vị bảo hiểm không bảo lãnh trực tiếp: Bệnh viện xuất hoá đơn tài chính (hoá đơn điện tử) và hỗ trợ bệnh nhân hoàn thiện hồ sơ</div>
                            </div>
                            <div className="more-insurance-type">
                                <div><a href="#">Xem danh sách</a></div>
                            </div>
                            <div className="less-button-container">
                                <button className="less-button"
                                    onClick={() => this.handleMoreButtonClicked(false, 'insurance')}
                                >
                                    Thu gọn
                                </button>
                            </div>
                        </div>
                    }
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

