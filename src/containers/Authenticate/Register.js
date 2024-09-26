import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import { Route, Switch, Redirect } from 'react-router-dom';
import * as actions from "../../store/actions";
import './Register.scss';
import { path } from '../../utils';
import { FormattedMessage } from 'react-intl';
import { handleLoginAPI } from '../../services/userService';
import CustomScrollbars from '../../components/CustomScrollbars';
import { withRouter } from 'react-router';
import RegisterPersonalInfo from './RegisterPersonalInfo/RegisterPersonalInfo';
import { checkUserEmailIsAlreadyExist } from '../../services/userService';
import { toast } from "react-toastify";

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            verifyPassword: '',
            passwordShown: false,
            errMessage: '',
            isPasswordMatch: false,
        }
    }

    handleOnChangeEmailInput = (event) => {
        this.setState({
            email: event.target.value,
        })
    }

    handleOnChangePasswordInput = (event) => {
        this.setState({
            password: event.target.value,
        }, this.checkPasswordMatch);
    }

    handleOnChangeInputPasswordAgainInput = (event) => {
        this.setState({
            verifyPassword: event.target.value,
        }, this.checkPasswordMatch);
    }

    checkPasswordMatch = () => {
        const { password, verifyPassword } = this.state;
        this.setState({
            isPasswordMatch: password === verifyPassword
        });
    }

    handleRegisterButtonClicked = async (event) => {
        this.setState({
            errMessage: '',
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
                    })
                }
            }
        }
    }

    handleShowAndHidePassword = (event) => {
        this.setState({
            passwordShown: !this.state.passwordShown,
        })
    }

    handleEnterKeyPressed = (event) => {
        if (event.key === 'Enter' || event.keyCode === 13) {

        }
    }

    handleBackClicked = () => {
        this.props.history.goBack();
    }

    nextStepToCreateAccount = async () => {
        let isAlreadyExist = true;
        if (this.state.email && this.state.password) {
            isAlreadyExist = await checkUserEmailIsAlreadyExist(this.state.email);
            if (!isAlreadyExist) {
                this.props.saveUserEmailAndPasswordTemporarily(this.state.email, this.state.password);
            } else {
                toast.error("User is already exist, try another email!");
            }
        }
        if (this.state.isPasswordMatch && !isAlreadyExist) {
            this.props.history.push(`/register/personal-info`);
        }
    }

    render() {

        const { isPasswordMatch } = this.state;

        return (
            <div className="register-background">
                <div className="register-container">
                    <div className="register-contents row">
                        <div className="col-12 text-center register-text">Create your account</div>
                        <div className="col-12 form-group register-input">
                            <label>Email</label>
                            <input type="text"
                                className="form-control input-place"
                                placeholder="Piscean"
                                value={this.state.username}
                                onChange={(event) => this.handleOnChangeEmailInput(event)} />
                        </div>
                        <div className="col-12 form-group register-input">
                            <label>Password</label>
                            <div className="password-input-and-eye">
                                <input type={this.state.passwordShown ? 'text' : 'password'}
                                    className="form-control input-place"
                                    placeholder="Enter your password"
                                    value={this.state.password}
                                    onChange={(event) => this.handleOnChangePasswordInput(event)}
                                />
                                <span
                                    onClick={(event) => { this.handleShowAndHidePassword() }}>
                                    <i className={this.state.passwordShown ? "far fa-eye" : "far fa-eye-slash"}></i>
                                </span>

                            </div>
                        </div>
                        <div className="col-12 form-group register-input">
                            <label>Repeat your password</label>
                            <div className="password-input-and-eye">
                                <input type={this.state.passwordShown ? 'text' : 'password'}
                                    className="form-control input-place"
                                    placeholder="Re-input your password"
                                    value={this.state.verifyPassword}
                                    onChange={(event) => this.handleOnChangeInputPasswordAgainInput(event)}
                                />
                                <span
                                    onClick={(event) => { this.handleShowAndHidePassword() }}>
                                    <i className={this.state.passwordShown ? "far fa-eye" : "far fa-eye-slash"}></i>
                                </span>
                                {/* Hiển thị thông báo dưới ô input của mật khẩu xác nhận */}
                                {!isPasswordMatch && this.state.verifyPassword && (
                                    <div className="text-danger announce-text-with-password">Password is not matching!</div>
                                )}
                                {isPasswordMatch && this.state.verifyPassword && (
                                    <div className="text-success announce-text-with-password">Password is matching!</div>
                                )}
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="back-or-next-button">
                                <span className="login-link"
                                    onClick={() => this.handleBackClicked()}
                                >Already have account? Login here</span>
                                <div className="wrapper-for-next-button">
                                    <a onClick={() => { this.nextStepToCreateAccount() }} disabled={!isPasswordMatch}><span>Next</span></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
        userLoginSuccess: (userInfor) => dispatch(actions.userLoginSuccess(userInfor)),
        saveUserEmailAndPasswordTemporarily: (email, password) => dispatch(actions.saveUserEmailAndPasswordTemporarily(email, password)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Register));
