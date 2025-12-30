import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./ConfirmBookingExamPackage.scss";
import { confirmBookingExamPackageService } from "../../../services/userService";
import Lottie from "lottie-react";
import confirmSuccess from "../../../assets/Success animation.json";
import errorCone from "../../../assets/Error cone.json";
import decayBlock from "../../../assets/Decaying Squares Load.json";

class ConfirmBookingExamPackage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            errCode: null,
            message: "",
        };
    }

    async componentDidMount() {
        // ===== 1. Validate query string =====
        if (!this.props.location || !this.props.location.search) {
            this.setState({
                loading: false,
                errCode: -1,
                message: "Link xác nhận không hợp lệ.",
            });
            return;
        }

        const urlParams = new URLSearchParams(this.props.location.search);
        const token = urlParams.get("token");
        const packageId = urlParams.get("packageId");

        if (!token || !packageId) {
            this.setState({
                loading: false,
                errCode: 1,
                message: "Thiếu thông tin xác nhận gói khám.",
            });
            return;
        }

        // ===== 2. Call API =====
        try {
            const res = await confirmBookingExamPackageService({
                token,
                packageId,
            });

            this.setState({
                loading: false,
                errCode: res?.errCode ?? -1,
                message: res?.message || "Có lỗi xảy ra trong quá trình xác nhận.",
            });
        } catch (error) {
            console.error("Confirm booking exam package error:", error);
            this.setState({
                loading: false,
                errCode: -1,
                message: "Không thể kết nối đến hệ thống.",
            });
        }
    }

    handleReturnHomePageClicked = () => {
        this.props.history.push("/home");
    };

    // ===== Render theo trạng thái =====
    renderResult = () => {
        const { errCode, message } = this.state;

        if (errCode === 0) {
            return (
                <div className="confirm-success">
                    <Lottie animationData={confirmSuccess} loop={false} style={{ width: 200, height: 200 }} />
                    <span className="message">{message}</span>
                    <span className="return-to-homepage-btn" onClick={this.handleReturnHomePageClicked}>
                        Quay trở về <span className="website-logo">MedicalCare</span>
                    </span>
                </div>
            );
        }

        if (errCode === 4) {
            return (
                <div className="confirm-expired">
                    <Lottie animationData={decayBlock} loop={false} style={{ width: 200, height: 200 }} />
                    <span className="message">{message}</span>
                    <span className="return-to-homepage-btn" onClick={this.handleReturnHomePageClicked}>
                        Quay trở về <span className="website-logo">MedicalCare</span>
                    </span>
                </div>
            );
        }

        if (errCode === 2 || errCode === 3) {
            return (
                <div className="confirm-fail">
                    <Lottie animationData={errorCone} loop={false} style={{ width: 200, height: 200 }} />
                    <span className="message">{message}</span>
                    <span className="return-to-homepage-btn" onClick={this.handleReturnHomePageClicked}>
                        Quay trở về <span className="website-logo">MedicalCare</span>
                    </span>
                </div>
            );
        }

        return (
            <div className="confirm-error">
                <Lottie animationData={errorCone} loop={false} style={{ width: 200, height: 200 }} />
                <span className="message">{message}</span>
                <span className="return-to-homepage-btn" onClick={this.handleReturnHomePageClicked}>
                    Quay trở về <span className="website-logo">MedicalCare</span>
                </span>
            </div>
        );
    };

    render() {
        const { loading } = this.state;

        return (
            <Fragment>
                <div className="confirm-booking-exam-package-container">{loading ? <div className="confirm-loading">Đang xử lý xác nhận gói khám...</div> : this.renderResult()}</div>
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
    };
};

export default connect(mapStateToProps)(ConfirmBookingExamPackage);
