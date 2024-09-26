import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
// import * as actions from "../store/actions";
import * as actions from "../../../store/actions";
import './RegisterPersonalInfo.scss';
import { LANGUAGES, CommonUtils } from "../../../utils";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCameraRetro, faCameraRotate } from '@fortawesome/free-solid-svg-icons';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router';
import defaultAvatar from '../../../assets/images/default-avatar-circle.png';

class RegisterPersonalInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: '',
            roleId: 'R3',
            positionId: 'P0',
            previewAvatarImageUrl: '',
            avatarImage: '',
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
            })
        }
        console.log("Check image: ", this.state.avatar);
    };

    onChangeInput = (event, idForEvent) => {
        let copyState = {
            ...this.state,
        };
        copyState[idForEvent] = event.target.value;
        this.setState({
            ...copyState
        })
    }

    handleRegisterButtonClicked = () => {
        console.log("check state before save: ", this.state);
    }

    handleBackToLoginButtonClicked = () => {
        this.props.history.goBack();
    }

    render() {
        return (
            <div className="register-personal-info-background">
                <div className="register-personal-info-container">
                    <div className="text-center register-personal-info-text">Give us more information</div>
                    <div className="input-field-container">
                        <div className="user-avatar-container">
                            <div
                                className="image-frame avatar-css"
                                style={{ backgroundImage: `url(${this.state.previewAvatarImageUrl})` }}
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
                                    style={{ display: 'none' }} // Ẩn input
                                    onChange={this.handleImageChange} // Gọi hàm khi người dùng chọn ảnh
                                />
                            </div>
                        </div>
                        <div className="register-personal-info-contents row">
                            <div className="col-6 form-group register-input">
                                <label>First name</label>
                                <input type="text"
                                    className="form-control input-place"
                                    placeholder="Piscean"
                                    name="firstName"
                                    value={this.state.firstName}
                                    onChange={(event) => this.onChangeInput(event, 'firstName')}
                                />
                            </div>
                            <div className="col-6 form-group register-input">
                                <label>Last name</label>
                                <input type="text"
                                    className="form-control input-place"
                                    placeholder="Phan"
                                    name="lastName"
                                    value={this.state.lastName}
                                    onChange={(event) => this.onChangeInput(event, 'lastName')}
                                />
                            </div>
                            <div className="col-12 form-group register-input">
                                <label>Phone number</label>
                                <input type="text"
                                    className="form-control input-place"
                                    placeholder="Your phone number"
                                    name="phoneNumber"
                                    value={this.state.phoneNumber}
                                    onChange={(event) => this.onChangeInput(event, 'phoneNumber')}
                                />
                            </div>
                            <div className="col-12 form-group register-input">
                                <label>Address</label>
                                <input type="text"
                                    className="form-control input-place"
                                    placeholder="Khu 2 Hoàng Cương Thanh Ba Phú Thọ"
                                    name="address"
                                    value={this.state.address}
                                    onChange={(event) => this.onChangeInput(event, 'address')}
                                />
                            </div>
                            <div className="operation-button-container">
                                <div className="back-to-login-button-wrapper">
                                    <a onClick={(event) => { this.handleBackToLoginButtonClicked() }}><span>Back</span></a>
                                </div>
                                <div className="register-button-wrapper">
                                    <a onClick={(event) => { this.handleRegisterButtonClicked() }}><span>Register</span></a>
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
        // userLoginFail: () => dispatch(actions.adminLoginFail()),
        userLoginSuccess: (userInfor) => dispatch(actions.userLoginSuccess(userInfor)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RegisterPersonalInfo));
