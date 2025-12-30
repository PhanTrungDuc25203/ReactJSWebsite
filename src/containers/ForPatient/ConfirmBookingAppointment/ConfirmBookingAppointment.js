import React, { Component } from "react";
import { connect } from "react-redux";
import "./ConfirmBookingAppointment.scss";
import { confirmBookingAppointmentService } from "../../../services/userService";
import Lottie from "lottie-react";
import confirmSuccess from "../../../assets/Success animation.json";
import errorCone from "../../../assets/Error cone.json";
import decayBlock from "../../../assets/Decaying Squares Load.json";

class ConfirmBookingAppointment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: "init", // init | confirming | success | fail | error
            message: "",
        };
    }

    async componentDidMount() {
        if (!this.props.location || !this.props.location.search) {
            this.setState({
                step: "error",
                message: "Thiếu thông tin xác nhận lịch hẹn.",
            });
            return;
        }

        const urlParams = new URLSearchParams(this.props.location.search);
        const token = urlParams.get("token");
        const doctorId = urlParams.get("doctorId");

        if (!token || !doctorId) {
            this.setState({
                step: "error",
                message: "Liên kết xác nhận không hợp lệ.",
            });
            return;
        }

        this.setState({
            step: "confirming",
            message: "Đang xác nhận lịch hẹn...",
        });

        try {
            const res = await confirmBookingAppointmentService({
                token,
                doctorId,
            });

            if (res && res.errCode === 4) {
                this.setState({
                    step: "expired",
                    message: "Liên kết xác nhận đã hết hạn.",
                });
                return;
            }

            if (res && res.errCode === 0) {
                this.setState({
                    step: "success",
                    message: "Xác nhận lịch hẹn thành công!",
                });
            } else {
                this.setState({
                    step: "fail",
                    message: "Lịch hẹn đã tồn tại. Bạn chỉ có thể đặt một lịch hẹn với bác sĩ này.",
                });
            }
        } catch (error) {
            console.error(error);
            this.setState({
                step: "error",
                message: "Có lỗi xảy ra trong quá trình xác nhận.",
            });
        }
    }

    handleReturnHomePageClicked = () => {
        this.props.history.push("/home");
    };

    /* ================= UI theo trạng thái ================= */

    renderContent = () => {
        const { step, message } = this.state;

        switch (step) {
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
                        <Lottie animationData={confirmSuccess} loop={false} style={{ width: 200, height: 200 }} />
                        <span className="message">{message}</span>
                        <span className="return-to-homepage-btn" onClick={this.handleReturnHomePageClicked}>
                            Quay trở về <span className="website-logo">MedicalCare</span>
                        </span>
                    </div>
                );

            case "fail":
                return (
                    <div className="payment-status error">
                        <Lottie animationData={errorCone} loop={true} style={{ width: 200, height: 200 }} />
                        <span className="message">{message}</span>
                        <span className="return-to-homepage-btn" onClick={this.handleReturnHomePageClicked}>
                            Quay trở về <span className="website-logo">MedicalCare</span>
                        </span>
                    </div>
                );

            case "error":
                return (
                    <div className="payment-status error">
                        <span className="message">{message}</span>
                        <span className="return-to-homepage-btn" onClick={this.handleReturnHomePageClicked}>
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

const mapStateToProps = (state) => ({
    language: state.app.language,
});

export default connect(mapStateToProps)(ConfirmBookingAppointment);
