import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import './AppointmentInProfilePage.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { LANGUAGES } from '../../../utils';
import _ from 'lodash';
import { withRouter } from 'react-router';
import * as actions from "../../../store/actions";
import { MoonLoader } from 'react-spinners';
import { getAllRelativeInforsOfCurrentSystemUserService } from '../../../services/userService';

class AppointmentInProfilePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentUser: {},
        }
    }

    async componentDidMount() {
        if (this.props && this.props.currentUser) {
            console.log("check props: ", this.props);
            this.setState({
                currentUser: this.props.currentUser,
            })
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.currentUser !== this.props.currentUser) {
            this.setState({
                currentUser: this.props.currentUser
            });
        }
    }

    handleProfileTabClicked(whichClicked) {

    }

    render() {
        console.log("Check current user role: ", this.state.currentUser);
        let { currentUser } = this.state;
        return (
            <div className="appointment-in-profile-page">
            </div >
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppointmentInProfilePage));
