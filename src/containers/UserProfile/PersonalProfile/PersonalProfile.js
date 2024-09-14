import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import './PersonalProfile.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { LANGUAGES } from '../../../utils';
import _ from 'lodash';
import { withRouter } from 'react-router';
import * as actions from "../../../store/actions";
import { MoonLoader } from 'react-spinners';

class PersonalProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.email) {
            let userEmail = this.props.match.params.email;

        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    handleProfileTabClicked(whichClicked) {

    }

    render() {

        return (
            <div className="personal-profile-for-profile-page-container">
                <div className="phone-number">
                    <label>Số điện thoại</label>
                    <input value="01231231233"></input>
                </div>
                <div className="gender">
                    <label>Giới tính</label>
                    <input value="Nam"></input>
                </div>
                <div className="address">
                    <label>Địa chỉ</label>
                    <input value="Phố Hồng Hà 1, phương Bến Gót thành phố Việt Trì tỉnh Phú Thọ"></input>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        // systemMenuPath: state.app.systemMenuPath,
        // isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PersonalProfile));
