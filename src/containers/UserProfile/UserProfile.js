import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import './UserProfile.scss';
import HomeFooter from '../HomePage/HomeFooter/HomeFooter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { } from '@fortawesome/free-solid-svg-icons';
import { LANGUAGES } from '../../utils';
import CustomScrollbars from '../../components/CustomScrollbars';
import _ from 'lodash';
import * as actions from "../../store/actions";
import { MoonLoader } from 'react-spinners';

class UserProfile extends Component {

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

    handleLoginForUser = (loginState) => {
            this.props.processLogout();
            this.props.history.push(`/login`);
    }

    render() {
        return (
            <React.Fragment>
                {/* <CustomScrollbars style={{ height: '100vh', width: '100%' }}> */}
                    This is user's profile page
                    <button onClick={() => this.handleLoginForUser()}>Log out </button>
                    <HomeFooter />
                {/* </CustomScrollbars> */}
            </React.Fragment >

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

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
