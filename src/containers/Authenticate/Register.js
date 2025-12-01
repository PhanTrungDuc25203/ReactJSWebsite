import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { Route, Switch, Redirect } from "react-router-dom";
import * as actions from "../../store/actions";
import "./Register.scss";
import { path } from "../../utils";
import { FormattedMessage } from "react-intl";
import { handleLoginAPI, sendEmailOTPAPI, verifyEmailOTPAPI } from "../../services/userService";
import CustomScrollbars from "../../components/CustomScrollbars";
import { withRouter } from "react-router";
import RegisterPersonalInfo from "./RegisterPersonalInfo/RegisterPersonalInfo";
import { checkUserEmailIsAlreadyExist } from "../../services/userService";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            isEmailValid: false,
            password: "",
            verifyPassword: "",
            passwordShown: false,
            errMessage: "",
            isPasswordMatch: false,
        };
    }

    handleOnChangeEmailInput = (event) => {
        const email = event.target.value;

        // Biểu thức chính quy để kiểm tra định dạng email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmailValid = emailRegex.test(email);

        this.setState({
            email: email,
            isEmailValid: isEmailValid,
        });
    };

    handleOnChangePasswordInput = (event) => {
        this.setState(
            {
                password: event.target.value,
            },
            this.checkPasswordMatch
        );
    };

    handleOnChangeInputPasswordAgainInput = (event) => {
        this.setState(
            {
                verifyPassword: event.target.value,
            },
            this.checkPasswordMatch
        );
    };

    checkPasswordMatch = () => {
        const { password, verifyPassword } = this.state;
        this.setState({
            isPasswordMatch: password === verifyPassword,
        });
    };

    handleRegisterButtonClicked = async (event) => {
        this.setState({
            errMessage: "",
        });

        try {
            let data = await handleLoginAPI(this.state.username, this.state.password);
            if (data && data.errCode !== 0) {
                this.setState({
                    errMessage: data.message,
                });
            }
            if (data && data.errCode === 0) {
                this.props.userLoginSuccess(data.user);
            }
        } catch (e) {
            if (e.response) {
                if (e.response.data) {
                    this.setState({
                        errMessage: e.response.data.message,
                    });
                }
            }
        }
    };

    handleShowAndHidePassword = (event) => {
        this.setState({
            passwordShown: !this.state.passwordShown,
        });
    };

    handleEnterKeyPressed = (event) => {
        if (event.key === "Enter" || event.keyCode === 13) {
        }
    };

    handleBackClicked = () => {
        this.props.history.goBack();
    };

    nextStepToCreateAccount = async () => {
        const { email, password, isPasswordMatch, isEmailValid } = this.state;

        if (!isPasswordMatch || !isEmailValid) return;

        let isAlreadyExist = await checkUserEmailIsAlreadyExist(email);
        if (isAlreadyExist) {
            toast.error("User is already exist, try another email!");
            return;
        }

        const res = await sendEmailOTPAPI(email);

        if (res.errCode === 0) {
            Swal.fire({
                title: "Verify your Email",
                input: "text",
                inputPlaceholder: "Enter OTP",
                showCancelButton: true,
                confirmButtonText: "Verify",
            }).then(async (result) => {
                if (!result.value) return;

                let verify = await verifyEmailOTPAPI(email, result.value);

                if (verify.errCode === 0) {
                    this.props.saveUserEmailAndPasswordTemporarily(email, password);
                    this.props.history.push(`/register/personal-info`);
                } else {
                    toast.error("OTP incorrect!");
                }
            });
        }
    };

    render() {
        const { isPasswordMatch } = this.state;

        return (
            <div className="register-background">
                <div className="register-container">
                    <div className="register-contents row">
                        <div className="col-12 text-center register-text">Create your account</div>
                        <div className="col-12 form-group register-input">
                            <label>Email</label>
                            <input type="email" className="form-control input-place" placeholder="Piscean" value={this.state.username} onChange={(event) => this.handleOnChangeEmailInput(event)} />
                            {!this.state.isEmailValid && this.state.email && <div className="text-danger announce-text-with-email">Your email syntax is not valid!</div>}
                        </div>
                        <div className="col-12 form-group register-input">
                            <label>Password</label>
                            <div className="password-input-and-eye">
                                <input type={this.state.passwordShown ? "text" : "password"} className="form-control input-place" placeholder="Enter your password" value={this.state.password} onChange={(event) => this.handleOnChangePasswordInput(event)} />
                                <span
                                    onClick={(event) => {
                                        this.handleShowAndHidePassword();
                                    }}
                                >
                                    <i className={this.state.passwordShown ? "far fa-eye" : "far fa-eye-slash"}></i>
                                </span>
                            </div>
                        </div>
                        <div className="col-12 form-group register-input">
                            <label>Repeat your password</label>
                            <div className="password-input-and-eye">
                                <input type={this.state.passwordShown ? "text" : "password"} className="form-control input-place" placeholder="Re-input your password" value={this.state.verifyPassword} onChange={(event) => this.handleOnChangeInputPasswordAgainInput(event)} />
                                <span
                                    onClick={(event) => {
                                        this.handleShowAndHidePassword();
                                    }}
                                >
                                    <i className={this.state.passwordShown ? "far fa-eye" : "far fa-eye-slash"}></i>
                                </span>
                                {/* Hiển thị thông báo dưới ô input của mật khẩu xác nhận */}
                                {!isPasswordMatch && this.state.verifyPassword && <div className="text-danger announce-text-with-password">Password is not matching!</div>}
                                {isPasswordMatch && this.state.verifyPassword && <div className="text-success announce-text-with-password">Password is matching!</div>}
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="back-or-next-button">
                                <span className="login-link" onClick={() => this.handleBackClicked()}>
                                    Already have account? Login here
                                </span>
                                <div className="wrapper-for-next-button">
                                    <a
                                        onClick={() => {
                                            this.nextStepToCreateAccount();
                                        }}
                                        disabled={!isPasswordMatch}
                                    >
                                        <span>Next</span>
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
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        navigate: (path) => dispatch(push(path)),
        userLoginSuccess: (userInfor) => dispatch(actions.userLoginSuccess(userInfor)),
        saveUserEmailAndPasswordTemporarily: (email, password) => dispatch(actions.saveUserEmailAndPasswordTemporarily(email, password)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Register));
