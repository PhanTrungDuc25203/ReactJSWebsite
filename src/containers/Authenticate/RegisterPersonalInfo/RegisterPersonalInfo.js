import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
// import * as actions from "../store/actions";
import * as actions from "../../../store/actions";
import "./RegisterPersonalInfo.scss";
import { LANGUAGES, CommonUtils } from "../../../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCameraRetro, faCameraRotate } from "@fortawesome/free-solid-svg-icons";
import { Input } from "reactstrap";
import { createNewUserService, sendPhoneOTP, verifyPhoneOTP } from "../../../services/userService";
import { FormattedMessage } from "react-intl";
import { withRouter } from "react-router";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import defaultAvatar from "../../../assets/images/default-avatar-circle.png";
import { showOTPPopup } from "../../../components/OTPPopupHelper/OTPPopupHelper";

class RegisterPersonalInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            phoneNumber: "",
            address: "",
            roleId: "R3",
            positionId: "P0",
            gender: "",
            genderList: [],
            previewAvatarImageUrl: "",
            avatarImage: "",
        };
    }

    async componentDidMount() {
        this.props.getGenderValueStart();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.genderValueByRedux !== this.props.genderValueByRedux) {
            let tempArr = this.props.genderValueByRedux;
            this.setState({
                genderList: tempArr,
                gender: tempArr && tempArr.length > 0 ? tempArr[0].keyMap : "",
            });
        }
    }

    handleImageChange = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                previewAvatarImageUrl: objectUrl,
                avatarImage: base64,
            });
        }
        console.log("Check image: ", this.state.avatar);
    };

    onChangeInput = (event, idForEvent) => {
        let copyState = {
            ...this.state,
        };
        copyState[idForEvent] = event.target.value;
        this.setState({
            ...copyState,
        });
    };

    formatPhoneNumberVN = (phoneNumber) => {
        // Nếu bắt đầu bằng '0' → đổi thành +84
        if (phoneNumber.startsWith("0")) {
            return "+84" + phoneNumber.slice(1);
        }
        return phoneNumber;
    };

    handleRegisterButtonClicked = async () => {
        const phoneNumber = this.formatPhoneNumberVN(this.state.phoneNumber);

        await sendPhoneOTP(phoneNumber);

        showOTPPopup({
            title: "Nhập OTP gửi qua SMS",
            onVerify: async (otp) => {
                const verifyRes = await verifyPhoneOTP(phoneNumber, otp);

                if (verifyRes.res.status === "approved") {
                    await createNewUserService({
                        email: this.props.userTemporaryEmail,
                        password: this.props.userTemporaryPassword,
                        firstName: this.state.firstName,
                        lastName: this.state.lastName,
                        address: this.state.address,
                        phoneNumber: this.state.phoneNumber,
                        gender: this.state.gender,
                        image: this.state.avatarImage,
                        roleId: this.state.roleId,
                        positionId: this.state.positionId,
                    });

                    toast.success("Register successfully!");
                    this.props.history.push("/login");
                } else {
                    throw new Error("OTP không đúng hoặc đã hết hạn");
                }
            },
            onResend: async () => {
                await sendPhoneOTP(phoneNumber);
                toast.success("Đã gửi lại OTP");
            },
        });
    };

    handleBackToLoginButtonClicked = () => {
        this.props.history.goBack();
    };

    render() {
        let genders = this.state.genderList;
        let isLoadingGenderValue = this.props.isLoadingGenderValue;

        return (
            <div className="register-personal-info-background">
                <div className="register-personal-info-container">
                    <div className="text-center register-personal-info-text">
                        <FormattedMessage id="register.personal-info-page.page-title" />
                    </div>
                    <div className="input-field-container">
                        <div className="user-avatar-container">
                            <div
                                className="image-frame avatar-css"
                                style={{
                                    backgroundImage: `url(${this.state.previewAvatarImageUrl})`,
                                }}
                            >
                                <div className={this.state.previewAvatarImageUrl ? "switch-to-button-change-image" : "choose-avatar-button"}>
                                    <label htmlFor="file-input">
                                        <FontAwesomeIcon icon={this.state.previewAvatarImageUrl ? faCameraRotate : faCameraRetro} />
                                    </label>
                                </div>
                                <input
                                    id="file-input"
                                    type="file"
                                    accept="image/*"
                                    style={{ display: "none" }} // Ẩn input
                                    onChange={this.handleImageChange} // Gọi hàm khi người dùng chọn ảnh
                                />
                            </div>
                        </div>
                        <div className="register-personal-info-contents row">
                            <div className="col-4 form-group register-input">
                                <label>
                                    <FormattedMessage id="register.personal-info-page.first-name" />
                                </label>
                                <FormattedMessage id="register.personal-info-page.first-name-placeholder">
                                    {(text) => <input type="text" className="form-control input-place" placeholder={text} name="firstName" value={this.state.firstName} onChange={(event) => this.onChangeInput(event, "firstName")} />}
                                </FormattedMessage>
                            </div>
                            <div className="col-4 form-group register-input">
                                <label>
                                    <FormattedMessage id="register.personal-info-page.last-name" />
                                </label>
                                <FormattedMessage id="register.personal-info-page.last-name-placeholder">
                                    {(text) => <input type="text" className="form-control input-place" placeholder={text} name="lastName" value={this.state.lastName} onChange={(event) => this.onChangeInput(event, "lastName")} />}
                                </FormattedMessage>
                            </div>
                            <div className="col-4 form-group register-input">
                                <label>
                                    <FormattedMessage id="register.personal-info-page.gender" />
                                </label>
                                <Input
                                    id="addUserGenderSelection"
                                    name="select"
                                    className="gender-choice-box"
                                    type="select"
                                    onChange={(event) => {
                                        this.onChangeInput(event, "gender");
                                    }}
                                    value={this.state.gender}
                                    placeholder={isLoadingGenderValue === true ? `Loading gender's value` : ""}
                                >
                                    {genders &&
                                        genders.length > 0 &&
                                        genders.map((item, index) => {
                                            return (
                                                <option key={index} value={item.keyMap}>
                                                    {this.props.language === LANGUAGES.VI ? item.value_Vie : item.value_Eng}
                                                </option>
                                            );
                                        })}
                                </Input>
                            </div>

                            <div className="col-12 form-group register-input">
                                <label>
                                    <FormattedMessage id="register.personal-info-page.phonenumber" />
                                </label>
                                <FormattedMessage id="register.personal-info-page.phonenumber-placeholder">
                                    {(text) => <input type="text" className="form-control input-place" placeholder={text} name="phoneNumber" value={this.state.phoneNumber} onChange={(event) => this.onChangeInput(event, "phoneNumber")} />}
                                </FormattedMessage>
                            </div>
                            <div className="col-12 form-group register-input">
                                <label>
                                    <FormattedMessage id="register.personal-info-page.address" />
                                </label>
                                <FormattedMessage id="register.personal-info-page.address-placeholder">
                                    {(text) => <input type="text" className="form-control input-place" placeholder={text} name="address" value={this.state.address} onChange={(event) => this.onChangeInput(event, "address")} />}
                                </FormattedMessage>
                            </div>
                            <div className="operation-button-container">
                                <div className="back-to-login-button-wrapper">
                                    <a
                                        onClick={(event) => {
                                            this.handleBackToLoginButtonClicked();
                                        }}
                                    >
                                        <span>
                                            <FormattedMessage id="register.personal-info-page.back-btn" />
                                        </span>
                                    </a>
                                </div>
                                <div className="register-button-wrapper">
                                    <a
                                        onClick={(event) => {
                                            this.handleRegisterButtonClicked();
                                        }}
                                    >
                                        <span>
                                            <FormattedMessage id="register.personal-info-page.register-btn" />
                                        </span>
                                    </a>
                                </div>
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
        userTemporaryEmail: state.user.temporaryEmail,
        userTemporaryPassword: state.user.temporaryPassword,
        genderValueByRedux: state.admin.genders,
        isLoadingGenderValue: state.admin.isLoadingGenderValue,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        navigate: (path) => dispatch(push(path)),
        userLoginSuccess: (userInfor) => dispatch(actions.userLoginSuccess(userInfor)),
        getGenderValueStart: () => dispatch(actions.fetchGenderValueStart()),
        addNewUserByRedux: (data) => dispatch(actions.addNewUserByRedux(data)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RegisterPersonalInfo));
