import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import "./ConfirmBookingAppointment.scss";
import { confirmBookingAppointmentService, createPaymentUrlService } from "../../../services/userService";
import Lottie from "lottie-react";
import cardPaymentFail from "../../../assets/Card Payment Unsuccessful.json";
import errorCone from "../../../assets/Error cone.json";
import confirmSuccess from "../../../assets/Success animation.json";
import decayBlock from "../../../assets/Decaying Squares Load.json";

class BookingPayment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: "init", // init | waitingPayment | confirming | success | error
            message: "",
        };
    }

    async componentDidMount() {
        const params = new URLSearchParams(this.props.location.search);
        const token = params.get("token");
        const doctorId = params.get("doctorId");
        const vnp_ResponseCode = params.get("vnp_ResponseCode");
        const vnp_Amount = params.get("vnp_Amount");

        // 👉 Chưa thanh toán
        if (!vnp_ResponseCode) {
            try {
                this.setState({
                    step: "waitingPayment",
                    message: "Đang chuyển tới cổng thanh toán VNPay...",
                });

                const res = await createPaymentUrlService({ token, doctorId });
                const paymentUrl = res?.url;

                if (res?.errCode === 4) {
                    this.setState({
                        step: "expired",
                        message: "Liên kết thanh toán đã hết hạn.",
                    });
                    return;
                }

                if (paymentUrl) {
                    setTimeout(() => {
                        window.location.href = paymentUrl;
                    }, 2000);
                } else {
                    this.setState({
                        step: "error",
                        message: "Không tạo được liên kết thanh toán.",
                    });
                }
            } catch (e) {
                console.error(e);
                this.setState({
                    step: "error",
                    message: "Lỗi tạo liên kết thanh toán.",
                });
            }
        }

        // 👉 Quay lại từ VNPay
        else {
            if (vnp_ResponseCode === "00") {
                this.setState({
                    step: "confirming",
                    message: "Thanh toán thành công. Đang xác nhận đặt lịch...",
                });

                const body = {
                    token,
                    doctorId,
                    ...(vnp_Amount && { paidAmount: vnp_Amount }),
                };

                const res = await confirmBookingAppointmentService(body);
                if (res && res.errCode === 0) {
                    this.setState({
                        step: "success",
                        message: "Đặt lịch thành công!",
                    });
                } else {
                    this.setState({
                        step: "fail",
                        message: "Xác nhận thất bại hoặc lịch đã tồn tại.",
                    });
                }
            } else {
                this.setState({
                    step: "error",
                    message: "Thanh toán thất bại hoặc bị hủy.",
                });
            }
        }
    }

    handleReturnHomePageClicked = () => {
        this.props.history.push(`/home`);
    };

    /* ================= UI theo trạng thái ================= */

    renderContent = () => {
        const { step, message } = this.state;

        switch (step) {
            case "waitingPayment":
                return (
                    <div className="payment-status waiting">
                        <div className="spinner" />
                        <h3>Đang chuyển hướng</h3>
                        <p>{message}</p>
                    </div>
                );

            case "confirming":
                return (
                    <div className="payment-status confirming">
                        <div className="spinner" />
                        <h3>Đang xác nhận</h3>
                        <p>{message}</p>
                    </div>
                );

            case "success":
                return (
                    <div className="payment-status success">
                        <Lottie animationData={confirmSuccess} loop={true} style={{ width: 200, height: 200 }} />
                        <span className="message">{message}</span>
                        <span className="return-to-homepage-btn" onClick={() => this.handleReturnHomePageClicked()}>
                            Quay trở về <span className="website-logo">MedicalCare</span>
                        </span>
                    </div>
                );

            case "error":
                return (
                    <div className="payment-status error">
                        <Lottie animationData={cardPaymentFail} loop={true} style={{ width: 200, height: 200 }} />
                        <span className="message">{message}</span>
                        <span className="return-to-homepage-btn" onClick={() => this.handleReturnHomePageClicked()}>
                            Quay trở về <span className="website-logo">MedicalCare</span>
                        </span>
                    </div>
                );

            case "fail":
                return (
                    <div className="payment-status error">
                        <Lottie animationData={errorCone} loop={true} style={{ width: 200, height: 200 }} />
                        <span className="message">{message}</span>
                        <span className="return-to-homepage-btn" onClick={() => this.handleReturnHomePageClicked()}>
                            Quay trở về <span className="website-logo">MedicalCare</span>
                        </span>
                    </div>
                );
            case "expired":
                return (
                    <div className="payment-status expired">
                        <Lottie animationData={decayBlock} loop={true} style={{ width: 200, height: 200 }} />
                        <span className="message">{message}</span>
                        <span className="return-to-homepage-btn" onClick={this.handleReturnHomePageClicked}>
                            Quay trở về <span className="website-logo">MedicalCare</span>
                        </span>
                    </div>
                );

            default:
                return (
                    <div className="payment-status init">
                        <p>Đang khởi tạo...</p>
                    </div>
                );
        }
    };

    render() {
        return <div className="confirm-booking-container">{this.renderContent()}</div>;
    }
}

export default withRouter(connect()(BookingPayment));
