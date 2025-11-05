import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import "./ConfirmBookingAppointment.scss";
import { confirmBookingAppointmentService, createPaymentUrlService } from "../../../services/userService";

class BookingPayment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: "init", // init | waitingPayment | confirming | done
            message: "Đang chuẩn bị thanh toán...",
        };
    }

    async componentDidMount() {
        const params = new URLSearchParams(this.props.location.search);
        const token = params.get("token");
        const doctorId = params.get("doctorId");
        const vnp_ResponseCode = params.get("vnp_ResponseCode");
        const vnp_Amount = params.get("vnp_Amount");

        // 👉 Trường hợp 1: chưa thanh toán
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

                // console.log("Full response:", res);

                // ✅ chính xác theo dữ liệu bạn gửi
                const paymentUrl = res?.url;

                if (paymentUrl) {
                    // console.log("Redirecting to:", paymentUrl);

                    // Dùng timeout nhỏ để tránh React đang setState mà redirect liền
                    setTimeout(() => {
                        window.location.href = paymentUrl;
                    }, 2000);
                } else {
                    this.setState({
                        step: "done",
                        message: "Không tạo được liên kết thanh toán.",
                    });
                }
            } catch (e) {
                console.error(e);
                this.setState({
                    step: "done",
                    message: "Lỗi tạo liên kết thanh toán.",
                });
            }
        }

        // 👉 Trường hợp 2: quay lại từ VNPay
        else {
            if (vnp_ResponseCode === "00") {
                this.setState({
                    step: "confirming",
                    message: "Thanh toán thành công. Đang xác nhận đặt lịch...",
                });

                const body = {
                    token,
                    doctorId,
                    ...(vnp_Amount && { paidAmount: vnp_Amount }), // nếu tồn tại thì mới cho vào body
                };

                const res = await confirmBookingAppointmentService(body);
                if (res && res.errCode === 0) {
                    this.setState({ step: "done", message: "✅ Đặt lịch thành công!" });
                } else {
                    this.setState({
                        step: "done",
                        message: "❌ Xác nhận thất bại hoặc lịch đã tồn tại.",
                    });
                }
            } else {
                this.setState({
                    step: "done",
                    message: "❌ Thanh toán thất bại hoặc bị hủy.",
                });
            }
        }
    }

    render() {
        return (
            <div className="confirm-booking-container">
                <div className="confirm-booking-message">{this.state.message}</div>
            </div>
        );
    }
}

export default withRouter(connect()(BookingPayment));
