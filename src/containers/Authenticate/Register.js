import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
// import * as actions from "../store/actions";
import * as actions from "../../store/actions";
import './Register.scss';
import { FormattedMessage } from 'react-intl';
import { handleLoginAPI } from '../../services/userService';
import CustomScrollbars from '../../components/CustomScrollbars';
import { withRouter } from 'react-router';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            passwordShown: false,
            errMessage: '',
        }
    }

    handleOnChangeUsernameInput = (event) => {
        this.setState({
            username: event.target.value,
        })
    }

    handleOnChangePasswordInput = (event) => {
        this.setState({
            password: event.target.value,
        })
    }

    handleOnChangeInputPasswordAgainInput = (event) => {
        this.setState({
            password: event.target.value,
        })
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
            this.handleLoginButtonClicked();
        }
    }

    handleLoginClicked = () => {
        this.props.history.push(`/login`);
    }

    render() {
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
                                onChange={(event) => this.handleOnChangeUsernameInput(event)} />
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
                                    placeholder="Enter your password"
                                    value={this.state.password}
                                    onChange={(event) => this.handleOnChangeInputPasswordAgainInput(event)}
                                />
                                <span
                                    onClick={(event) => { this.handleShowAndHidePassword() }}>
                                    <i className={this.state.passwordShown ? "far fa-eye" : "far fa-eye-slash"}></i>
                                </span>

                            </div>
                        </div>
                        <div className="col-12">
                            <div className="back-or-next-button">
                                <button className="back-button">Back</button>
                                <button className="next-button">Next</button>
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
        // userLoginFail: () => dispatch(actions.adminLoginFail()),
        userLoginSuccess: (userInfor) => dispatch(actions.userLoginSuccess(userInfor)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Register));
