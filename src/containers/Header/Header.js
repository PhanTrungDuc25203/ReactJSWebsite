import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from "../../store/actions";
import Navigator from '../../components/Navigator';
import { adminMenu, doctorMenu } from './menuApp';
import './Header.scss';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES, REGISTERED_ROLE } from "../../utils";
import { switchLanguageOfWebsite } from "../../store/actions";
import _ from 'lodash';

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            menuApp: [],
        }
    }

    handleSwitchLanguage = (language) => {
        this.props.switchLanguageOfWebsite(language);
    }

    componentDidMount() {
        let { userInfo } = this.props;
        let menu = [];
        if (userInfo && !_.isEmpty(userInfo)) {
            let registeredRole = userInfo.roleId;
            if (registeredRole === REGISTERED_ROLE.ADMIN) {
                menu = adminMenu;
            }
            if (registeredRole === REGISTERED_ROLE.DOCTOR) {
                menu = doctorMenu;
            }
        }

        this.setState({
            menuApp: menu,
        })
    }

    render() {
        const { processLogout, language, userInfo } = this.props;
        console.log(userInfo);
        return (
            <div className="header-container">
                {/* thanh navigator */}
                <div className="header-tabs-container">
                    <Navigator menus={this.state.menuApp} />
                </div>

                <div className="switch-languages-and-logout">
                    <span className="welcome"><FormattedMessage id="menu.content.welcome-text" />
                        {userInfo && userInfo.firstName ? ', ' + userInfo.firstName : ''} !
                    </span>
                    <span
                        className={language === LANGUAGES.VI ? "vietnamese active" : "vietnamese"}
                        onClick={() => this.handleSwitchLanguage(LANGUAGES.VI)} >
                        Vie
                    </span>
                    <span
                        className={language === LANGUAGES.EN ? "english active" : "english"}
                        onClick={() => this.handleSwitchLanguage(LANGUAGES.EN)} >
                        Eng
                    </span>

                    {/* nút logout */}
                    <div className="btn btn-logout" onClick={processLogout} title="Log out">
                        <i className="fas fa-sign-out-alt"></i>
                    </div>
                </div >


            </div >
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
        switchLanguageOfWebsite: (language) => dispatch(actions.switchLanguageOfWebsite(language)),
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(Header);
