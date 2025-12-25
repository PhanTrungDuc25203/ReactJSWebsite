import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import HomePageHeader from "../../HomePage/HomePageHeader/HomePageHeader";
import "./AwaitingConfirmation.scss";
import {} from "@fortawesome/free-solid-svg-icons";
import sendEmailAnimation from "../../../assets/contact-mail.json";
import Lottie from "lottie-react";
import { FormattedMessage } from "react-intl";

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
                    <div className="remind-title">
                        <FormattedMessage id="awaiting-confirmation-page.almost-done" />
                    </div>
                    <div className="remind-content">
                        <FormattedMessage id="awaiting-confirmation-page.remind-content" />
                    </div>
                    <div className="remind-notice">
                        <FormattedMessage id="awaiting-confirmation-page.remind-notice" />
                    </div>
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
