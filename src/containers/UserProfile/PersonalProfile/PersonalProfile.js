import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./PersonalProfile.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { LANGUAGES } from "../../../utils";
import { FormattedMessage, injectIntl } from "react-intl";
import _ from "lodash";
import { withRouter } from "react-router";
import * as actions from "../../../store/actions";
import { MoonLoader } from "react-spinners";
import { getAllRelativeInforsOfCurrentSystemUserService } from "../../../services/userService";

class PersonalProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: {},
        };
    }

    async componentDidMount() {
        if (this.props && this.props.currentUser) {
            // console.log("check props: ", this.props);
            this.setState({
                currentUser: this.props.currentUser,
            });
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.currentUser !== this.props.currentUser) {
            this.setState({
                currentUser: this.props.currentUser,
            });
        }
    }

    handleProfileTabClicked(whichClicked) {}

    render() {
        // console.log("Check current user role: ", this.state.currentUser);
        let { currentUser } = this.state;
        return (
            <div className="personal-profile-for-profile-page-container">
                <div className="phone-number">
                    <label>
                        <FormattedMessage id="personal-info-page.phonenumber" />
                    </label>
                    <input disabled value={currentUser && currentUser.phoneNumber ? currentUser.phoneNumber : this.props.intl.formatMessage({ id: "personal-info-page.not-updated" })} onChange={() => this.tempFunction()} />
                </div>

                <div className="gender">
                    <label>
                        <FormattedMessage id="personal-info-page.gender" />
                    </label>
                    <input
                        disabled
                        value={currentUser && currentUser.genderData ? (this.props.language === LANGUAGES.VI ? currentUser.genderData.value_Vie : currentUser.genderData.value_Eng) : this.props.intl.formatMessage({ id: "personal-info-page.not-updated" })}
                        onChange={() => this.tempFunction()}
                    />
                </div>

                <div className="address">
                    <label>
                        <FormattedMessage id="personal-info-page.address" />
                    </label>
                    <input disabled value={currentUser && currentUser.address ? currentUser.address : this.props.intl.formatMessage({ id: "personal-info-page.not-updated" })} onChange={() => this.tempFunction()} />
                </div>

                {currentUser && currentUser.roleId !== "R3" && (
                    <div className="more-infor-if-user-is-not-patient">
                        <div className="role">
                            <label>
                                <FormattedMessage id="personal-info-page.role" />
                            </label>
                            <input
                                disabled
                                value={currentUser && currentUser.roleData ? (this.props.language === LANGUAGES.VI ? currentUser.roleData.value_Vie : currentUser.roleData.value_Eng) : this.props.intl.formatMessage({ id: "personal-info-page.not-updated" })}
                                onChange={() => this.tempFunction()}
                            />
                        </div>

                        {currentUser.roleId === "R2" && (
                            <div className="more-infor-if-user-is-not-patient-and-admin">
                                <div className="level">
                                    <label>
                                        <FormattedMessage id="personal-info-page.level" />
                                    </label>
                                    <input
                                        disabled
                                        value={currentUser && currentUser.positionData ? (this.props.language === LANGUAGES.VI ? currentUser.positionData.value_Vie : currentUser.positionData.value_Eng) : this.props.intl.formatMessage({ id: "personal-info-page.not-updated" })}
                                        onChange={() => this.tempFunction()}
                                    />
                                </div>

                                <div className="doctor-specialty">
                                    <label>
                                        <FormattedMessage id="personal-info-page.specialty" />
                                    </label>
                                    <input disabled value={currentUser?.Doctor_infor?.belongToSpecialty?.name || this.props.intl.formatMessage({ id: "personal-info-page.not-updated" })} onChange={() => this.tempFunction()} />
                                </div>

                                <div className="clinic-name">
                                    <label>
                                        <FormattedMessage id="personal-info-page.clinic-name" />
                                    </label>
                                    <input disabled value={currentUser?.Doctor_infor?.clinicName || this.props.intl.formatMessage({ id: "personal-info-page.not-updated" })} onChange={() => this.tempFunction()} />
                                </div>

                                <div className="clinic-address">
                                    <label>
                                        <FormattedMessage id="personal-info-page.clinic-address" />
                                    </label>
                                    <input disabled value={currentUser?.Doctor_infor?.clinicAddress || this.props.intl.formatMessage({ id: "personal-info-page.not-updated" })} onChange={() => this.tempFunction()} />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        // systemMenuPath: state.app.systemMenuPath,
        // isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(injectIntl(PersonalProfile)));
