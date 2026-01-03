import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import "./PostVisitPayment.scss";
import { postVisitPaymentService, createPaymentUrlService } from "../../../services/userService";
import paymentSuccess from "../../../assets/Payment Success.json";
import errorCone from "../../../assets/Error cone.json";
import Lottie from "lottie-react";

class PostVisitPayment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: "init",
            message: "Đang chuẩn bị thanh toán...",
        };
    }

    async componentDidMount() {
        const params = new URLSearchParams(this.props.location.search);
        const token = params.get("token");
        const doctorId = params.get("doctorId");
        const vnp_ResponseCode = params.get("vnp_ResponseCode");
        const vnp_Amount = params.get("vnp_Amount");

        // ===== CHƯA THANH TOÁN =====
        if (!vnp_ResponseCode) {
            try {
                this.setState({
                    step: "waitingPayment",
                    message: "Đang chuyển tới cổng thanh toán VNPay...",
                });

                const res = await createPaymentUrlService({
                    token,
                    doctorId,
                });

                const paymentUrl = res?.url;

                if (paymentUrl) {
                    setTimeout(() => {
                        window.location.href = paymentUrl;
                    }, 1500);
                } else {
                    this.setState({
                        step: "failure",
                        message: "Không tạo được liên kết thanh toán.",
                    });
                }
            } catch (error) {
                console.error(error);
                this.setState({
                    step: "failure",
                    message: "Lỗi khi tạo liên kết thanh toán.",
                });
            }
            return;
        }

        // ===== QUAY LẠI TỪ VNPAY =====
        if (vnp_ResponseCode === "00") {
            try {
                this.setState({
                    step: "confirming",
                    message: "Thanh toán thành công. Đang xác nhận đặt lịch...",
                });

                const body = {
                    token,
                    doctorId,
                    ...(vnp_Amount && { paidAmount: vnp_Amount }),
                };

                const res = await postVisitPaymentService(body);

                if (res && res.errCode === 0) {
                    this.setState({
                        step: "success",
                        message: "Thanh toán và đặt lịch thành công!",
                    });
                } else {
                    this.setState({
                        step: "failure",
                        message: "Xác nhận đặt lịch thất bại.",
                    });
                }
            } catch (error) {
                console.error(error);
                this.setState({
                    step: "failure",
                    message: "Có lỗi xảy ra khi xác nhận thanh toán.",
                });
            }
        } else {
            this.setState({
                step: "failure",
                message: "Thanh toán thất bại hoặc đã bị hủy.",
            });
        }
    }

    handleReturnHomePageClicked = () => {
        this.props.history.push("/home");
    };

    render() {
        const { step, message } = this.state;

        return (
            <div className="post-visit-payment-container">
                {step === "init" && (
                    <div className="payment-step payment-init">
                        <div className="payment-title">Khởi tạo</div>
                        <div className="payment-message">{message}</div>
                    </div>
                )}

                {step === "waitingPayment" && (
                    <div className="payment-step payment-waiting">
                        <div className="payment-title">Đang chuyển hướng</div>
                        <div className="payment-message">{message}</div>
                        <div className="payment-loading">Loading...</div>
                    </div>
                )}

                {step === "confirming" && (
                    <div className="payment-step payment-confirming">
                        <div className="payment-title">Xác nhận thanh toán</div>
                        <div className="payment-message">{message}</div>
                    </div>
                )}

                {step === "success" && (
                    <div className="payment-step payment-success">
                        <Lottie animationData={paymentSuccess} loop={false} style={{ width: 200, height: 200 }} />
                        <div className="payment-message">{message}</div>
                        <span className="return-to-homepage-btn" onClick={this.handleReturnHomePageClicked}>
                            Quay trở về <span className="website-logo">MedicalCare</span>
                        </span>
                    </div>
                )}

                {step === "failure" && (
                    <div className="payment-step payment-failure">
                        <Lottie animationData={errorCone} loop={false} style={{ width: 200, height: 200 }} />
                        <div className="payment-message">{message}</div>
                        <span className="return-to-homepage-btn" onClick={this.handleReturnHomePageClicked}>
                            Quay trở về <span className="website-logo">MedicalCare</span>
                        </span>
                    </div>
                )}
            </div>
        );
    }
}

export default withRouter(connect()(PostVisitPayment));
