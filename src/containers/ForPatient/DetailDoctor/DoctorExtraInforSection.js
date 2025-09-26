import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHospitalUser, faMoneyCheckDollar, faUserShield } from "@fortawesome/free-solid-svg-icons";
import { LANGUAGES } from "../../../utils";
import { FormattedMessage } from "react-intl";
import moment from "moment";
import localization from "moment/locale/vi";
import { getExtraInforDoctorByIdService } from "../../../services/userService";
import { NumericFormat } from "react-number-format";

class DoctorExtraInforSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowPriceDetail: false,
            isShowInsurenceDetail: false,
            extraInfor: {},
        };
    }

    async componentDidMount() {}

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
        }

        if (prevProps.selectedDoctorId !== this.props.selectedDoctorId) {
            let res = await getExtraInforDoctorByIdService(this.props.selectedDoctorId);
            // console.log("Check get extra infor: ", data);
            if (res && res.errCode === 0) {
                this.setState({
                    extraInfor: res.data,
                });
            }
        }
    }

    handleMoreButtonClicked = (status, isShow) => {
        if (isShow === "price") {
            this.setState({
                isShowPriceDetail: status,
            });
        }
        if (isShow === "insurance") {
            this.setState({
                isShowInsurenceDetail: status,
            });
        }
    };

    render() {
        let { isShowPriceDetail, isShowInsurenceDetail, extraInfor } = this.state;
        let { language } = this.props;

        return (
            <React.Fragment>
                <div className="appointment-address-sct1">
                    <div className="sct1-title">
                        <FontAwesomeIcon icon={faHospitalUser} className="hospital-icon" />
                        <FormattedMessage id="doctor-detail-page-for-patient.extra-infor-section.exam-address" />
                    </div>
                    <div className="clinic-name-and-address">
                        <div>{extraInfor && extraInfor.clinicName ? extraInfor.clinicName : "Phòng khám của bác sĩ chưa được cập nhật"}</div>
                        <div>{extraInfor && extraInfor.clinicAddress ? extraInfor.clinicAddress : ""}</div>
                    </div>
                </div>
                <div className={isShowPriceDetail === false ? "examination-price-sct2 css-for-less-content" : "examination-price-sct2"}>
                    <div className="sct2-title">
                        <FontAwesomeIcon icon={faMoneyCheckDollar} className="money-check-icon" />
                        <FormattedMessage id="doctor-detail-page-for-patient.extra-infor-section.exam-price" />
                    </div>
                    {isShowPriceDetail === false ? (
                        <React.Fragment>
                            <div className="examination-price">
                                {extraInfor && extraInfor.priceTypeData && language === LANGUAGES.EN && <NumericFormat value={extraInfor.priceTypeData.value_Eng} displayType="text" thousandSeparator="," suffix="$" />}
                                {extraInfor && extraInfor.priceTypeData && language === LANGUAGES.VI && <NumericFormat value={extraInfor.priceTypeData.value_Vie} displayType="text" thousandSeparator="," suffix="đ" />}
                            </div>
                            <button className="more-button" onClick={() => this.handleMoreButtonClicked(true, "price")}>
                                <FormattedMessage id="doctor-detail-page-for-patient.extra-infor-section.more-button" />
                            </button>
                        </React.Fragment>
                    ) : (
                        <div className="price-detail">
                            <div className="price-in-detail">
                                <div className="section-content">
                                    <FormattedMessage id="doctor-detail-page-for-patient.extra-infor-section.attention" />
                                </div>
                                <div className="price">
                                    {extraInfor && extraInfor.priceTypeData && language === LANGUAGES.EN && <NumericFormat value={extraInfor.priceTypeData.value_Eng} displayType="text" thousandSeparator="," suffix="$" />}
                                    {extraInfor && extraInfor.priceTypeData && language === LANGUAGES.VI && <NumericFormat value={extraInfor.priceTypeData.value_Vie} displayType="text" thousandSeparator="," suffix="đ" />}
                                </div>
                            </div>
                            <div className="sale-promotion">{extraInfor && extraInfor.note ? extraInfor.note : <FormattedMessage id="doctor-detail-page-for-patient.extra-infor-section.no-note" />}</div>
                            <div className="payment-method">
                                {extraInfor && extraInfor.paymentId && extraInfor.paymentId === "PAY3" && <FormattedMessage id="doctor-detail-page-for-patient.extra-infor-section.payment-method-1" />}
                                {extraInfor && extraInfor.paymentId && extraInfor.paymentId === "PAY2" && <FormattedMessage id="doctor-detail-page-for-patient.extra-infor-section.payment-method-2" />}
                                {extraInfor && extraInfor.paymentId && extraInfor.paymentId === "PAY1" && <FormattedMessage id="doctor-detail-page-for-patient.extra-infor-section.payment-method-3" />}
                            </div>

                            <div className="less-button-container">
                                <button className="less-button" onClick={() => this.handleMoreButtonClicked(false, "price")}>
                                    <FormattedMessage id="doctor-detail-page-for-patient.extra-infor-section.less-button" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <div className={isShowInsurenceDetail === false ? "insurance-sct3 css-for-less-content" : "insurance-sct3"}>
                    <div className="sct3-title">
                        <FontAwesomeIcon icon={faUserShield} className="insurance-icon" />
                        Bảo hiểm áp dụng:
                    </div>
                    {isShowInsurenceDetail === false ? (
                        <React.Fragment>
                            <button className="more-button" onClick={() => this.handleMoreButtonClicked(true, "insurance")}>
                                <FormattedMessage id="doctor-detail-page-for-patient.extra-infor-section.more-button" />
                            </button>
                        </React.Fragment>
                    ) : (
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
                                <div>
                                    <a href="#">Xem danh sách</a>
                                </div>
                            </div>
                            <div className="less-button-container">
                                <button className="less-button" onClick={() => this.handleMoreButtonClicked(false, "insurance")}>
                                    <FormattedMessage id="doctor-detail-page-for-patient.extra-infor-section.less-button" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtraInforSection);
