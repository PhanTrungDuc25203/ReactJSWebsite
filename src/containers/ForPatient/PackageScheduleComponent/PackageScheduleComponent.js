import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./PackageScheduleComponent.scss";
import { emitter } from "../../../utils/emitter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyCheckDollar, faUserShield } from "@fortawesome/free-solid-svg-icons";
import { LANGUAGES } from "../../../utils";
import DoctorScheduleSection from "../DetailDoctor/DoctorScheduleSection";
import { getAllExamPackageService } from "../../../services/userService";
import defaultAvatar from "../../../assets/images/default-avatar-circle.png";
import PackageScheduleSection from "./PackageScheduleSection";
import { NumericFormat } from "react-number-format";
import { path } from "../../../utils";
import { withRouter } from "react-router";

class PackageScheduleComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            packageDetails: {},
            isShowInsurenceDetail: false,
            isShowPriceDetail: false,
        };
    }

    async componentDidMount() {
        let res = await getAllExamPackageService(this.props.packageId);
        if (res && res.errCode === 0) {
            this.setState({
                packageDetails: res.infor[0],
            });
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {}

    extractFirstSection(htmlString) {
        // Tạo một element DOM tạm thời để phân tích HTML
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = htmlString;

        // Lấy tất cả các thẻ `<p>` bên trong HTML
        const children = tempDiv.children;

        let resultHTML = ""; // Kết quả HTML cần lấy
        let foundFirstStrong = false; // Biến để kiểm tra `<p><strong>` đầu tiên

        // Duyệt qua tất cả các phần tử con
        for (let child of children) {
            // Nếu gặp một thẻ <p> chứa <strong> và chưa tìm thấy <p><strong> đầu tiên
            if (child.tagName === "P" && child.querySelector("strong")) {
                if (foundFirstStrong) {
                    // Nếu đã gặp `<p><strong>` đầu tiên rồi, thì dừng lại
                    break;
                }
                // Đánh dấu đã tìm thấy `<p><strong>` đầu tiên
                foundFirstStrong = true;
            }
            // Thêm phần tử HTML hiện tại vào kết quả
            resultHTML += child.outerHTML;
        }
        return resultHTML;
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

    handleViewDetailExamPackage = (packageId) => {
        const detailPath = path.DETAIL_EXAM_PACKAGE_ARTICLE.replace(":id", packageId);
        this.props.history.push(detailPath);
    };

    render() {
        let { packageDetails, isShowPriceDetail, isShowInsurenceDetail } = this.state;
        let htmlDescription = packageDetails.htmlDescription ? this.extractFirstSection(packageDetails.htmlDescription) : "";
        let imageByBase64 = "";
        if (packageDetails && packageDetails.image) {
            imageByBase64 = Buffer.from(packageDetails.image, "base64").toString("binary");
        }
        let { language } = this.props;

        return (
            <div className="package-schedule-component">
                {/* {packageDetails.name} */}
                <div className="avatar-name-and-description" onClick={() => this.handleViewDetailExamPackage(packageDetails.id)}>
                    <div
                        className="avatar avatar-css"
                        style={{
                            backgroundImage: `url(${imageByBase64 ? imageByBase64 : defaultAvatar})`,
                        }}
                    ></div>
                    <div className="package-name-and-description">
                        <div dangerouslySetInnerHTML={{ __html: htmlDescription }} />
                    </div>
                </div>
                <div className="schedule-and-insurance">
                    <div className="schedule">
                        <PackageScheduleSection selectedPackageId={packageDetails.id || -1} />
                    </div>
                    <div className="detail-informations">
                        <div className="price">
                            <div className={isShowPriceDetail === false ? "examination-price-sct2 css-for-less-content" : "examination-price-sct2"}>
                                <div className="sct2-title">
                                    <FontAwesomeIcon icon={faMoneyCheckDollar} className="money-check-icon" />
                                    <FormattedMessage id="doctor-detail-page-for-patient.extra-infor-section.package-price" />
                                </div>
                                {isShowPriceDetail === false ? (
                                    <React.Fragment>
                                        <div className="examination-price">
                                            {packageDetails && packageDetails.priceDataForPackage && language === LANGUAGES.EN && <NumericFormat value={packageDetails.priceDataForPackage.value_Eng} displayType="text" thousandSeparator="," suffix="$" />}
                                            {packageDetails && packageDetails.priceDataForPackage && language === LANGUAGES.VI && <NumericFormat value={packageDetails.priceDataForPackage.value_Vie} displayType="text" thousandSeparator="," suffix="đ" />}
                                        </div>
                                        <button className="more-button" onClick={() => this.handleMoreButtonClicked(true, "price")}>
                                            <FormattedMessage id="doctor-detail-page-for-patient.extra-infor-section.more-button" />
                                        </button>
                                    </React.Fragment>
                                ) : (
                                    <div className="price-detail">
                                        <div className="price-in-detail">
                                            <div className="section-content">Giá của gói khám</div>
                                            <div className="price-number">
                                                {packageDetails && packageDetails.priceDataForPackage && language === LANGUAGES.EN && <NumericFormat value={packageDetails.priceDataForPackage.value_Eng} displayType="text" thousandSeparator="," suffix="$" />}
                                                {packageDetails && packageDetails.priceDataForPackage && language === LANGUAGES.VI && <NumericFormat value={packageDetails.priceDataForPackage.value_Vie} displayType="text" thousandSeparator="," suffix="đ" />}
                                            </div>
                                        </div>
                                        <div className="sale-method">Phòng khám hỗ trợ cách hình thức: Chuyển khoản, quẹt thẻ và tiền mặt</div>

                                        <div className="less-button-container">
                                            <button className="less-button" onClick={() => this.handleMoreButtonClicked(false, "price")}>
                                                <FormattedMessage id="doctor-detail-page-for-patient.extra-infor-section.less-button" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="insurance">
                            <div className={isShowInsurenceDetail === false ? "insurance-sct3 css-for-less-content" : "insurance-sct3"}>
                                <div className="sct3-title">
                                    <FontAwesomeIcon icon={faUserShield} className="insurance-icon" />
                                    <FormattedMessage id="doctor-detail-page-for-patient.extra-infor-section.insurance" />
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
                                            <div className="section-content">
                                                Áp dụng với khách hàng đăng kí khám chữa bệnh ban đầu tại phòng khám, trung tâm y tế bệnh viện tuyến quận huyện tại TP. HCM. Khách hàng có giấy chuyển viện tuyến 3-4 ở tỉnh đến khám hoặc các trường hợp cấp cứu.(áp dụng từ ngày 01/04/2023)
                                            </div>
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
                        </div>
                    </div>
                </div>
            </div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PackageScheduleComponent));
