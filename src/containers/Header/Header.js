import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from "../../store/actions";
import Navigator from '../../components/Navigator';
import { adminMenu } from './menuApp';
import './Header.scss';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from "../../utils";
import { switchLanguageOfWebsite } from "../../store/actions";

class Header extends Component {

    handleSwitchLanguage = (language) => {
        this.props.switchLanguageOfWebsite(language);
    }

    render() {
        const { processLogout, language, userInfo } = this.props;
        console.log(userInfo);
        return (
            <div className="header-container">
                {/* thanh navigator */}
                <div className="header-tabs-container">
                    <Navigator menus={adminMenu} />
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
