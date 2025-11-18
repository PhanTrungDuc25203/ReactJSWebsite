import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import HomePageHeader from "../../HomePage/HomePageHeader/HomePageHeader";
import "./AwaitingConfirmation.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {} from "@fortawesome/free-solid-svg-icons";
import defaultAvatar from "../../../assets/images/default-avatar-circle.png";
import { LANGUAGES } from "../../../utils";
import { confirmBookingAppointmentService } from "../../../services/userService";
import sendEmailAnimation from "../../../assets/contact-mail.json";
import Lottie from "lottie-react";

class AwaitingConfirmation extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {}

    componentDidUpdate(prevProps, prevState, snapshot) {}

    render() {
        return (
            <React.Fragment>
                <HomePageHeader />
                <div className="awaiting-confirmation-container">
                    <div className="remind-title">Gần xong rồi!</div>
                    <div className="remind-content">Bạn hãy xác nhận đặt lịch khám tại hòm thư của bạn</div>
                    <div className="remind-notice">Nếu không thấy email, hãy kiểm tra thư mục Spam trong hòm thư.</div>
                    <Lottie animationData={sendEmailAnimation} loop={true} style={{ width: 200, height: 200 }} />
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

export default connect(mapStateToProps, mapDispatchToProps)(AwaitingConfirmation);
