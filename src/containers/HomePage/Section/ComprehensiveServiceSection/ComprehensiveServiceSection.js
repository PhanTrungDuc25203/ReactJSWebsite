import React, { Component } from 'react';
import { connect } from 'react-redux';
import './ComprehensiveServiceSection.scss';
import { path } from '../utils'
import { withRouter } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { } from '@fortawesome/free-brands-svg-icons';
import { } from '@fortawesome/fontawesome-free-webfonts';
import { } from '@fortawesome/fontawesome-svg-core';
import { } from '@fortawesome/free-regular-svg-icons';
import { faTooth, faHeartPulse, faSuitcaseMedical, faStethoscope } from '@fortawesome/free-solid-svg-icons';
import { } from '@fortawesome/free-solid-svg-icons';
import { } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from "../../../../utils";
import { switchLanguageOfWebsite } from "../../../../store/actions";

class ComprehensiveServiceSection extends Component {

    handleClickToGeneralExamPage = () => {
        this.props.history.push(`/general-exam`);
    }

    handleClickToHealthCheckPage = () => {
        this.props.history.push(`/health-check`);
    }

    render() {
        return (
            <div className="comprehensive-service-section">
                <div className="section-title"><FormattedMessage id="comprehensive-service-section.section-title" /></div>
                <div className="service-contents">
                    <div className="left-contents">
                        <div className="specialty-exam content-background "
                            onClick={() => this.handleClickToGeneralExamPage()}
                        >
                            <div className="service-icon-container"><div className="specialty-icon"></div></div>
                            <FormattedMessage id="comprehensive-service-section.option-specialty-exam" />
                        </div>
                        <div className="general-exam content-background">
                            <div className="service-icon-container"><div className="check-list-icon"></div></div>
                            <FormattedMessage id="comprehensive-service-section.option-general-exam" />
                        </div>
                        <div className="mental-health content-background">
                            <div className="service-icon-container"><div className="mental-icon"></div></div>
                            <FormattedMessage id="comprehensive-service-section.option-mental-health" />
                        </div>
                        <div className="surgery-pack content-background">
                            <div className="service-icon-container"><div className="surgery-icon"></div></div>
                            <FormattedMessage id="comprehensive-service-section.option-surgery-pack" />
                        </div>
                        <div className="health-checkup content-background"
                            onClick={() => this.handleClickToHealthCheckPage()}
                        >
                            <div className="service-icon-container"><div className="health-checkup-icon"></div></div>
                            <FormattedMessage id="comprehensive-service-section.option-health-exam" />
                        </div>
                    </div>
                    <div className="right-contents">
                        <div className="remote-exam content-background">
                            <div className="service-icon-container"><div className="phone-call-icon"></div></div>
                            <FormattedMessage id="comprehensive-service-section.option-remote-exam" />
                        </div>
                        <div className="medical-testing content-background">
                            <div className="service-icon-container"><div className="medical-tube-icon"></div></div>
                            <FormattedMessage id="comprehensive-service-section.option-medical-testing" />
                        </div>
                        <div className="dental-health content-background">
                            <div className="service-icon-container"><div className="tooth-icon"></div></div>
                            <FormattedMessage id="comprehensive-service-section.option-dental-exam" />
                        </div>
                        <div className="healthy-with-diabetes content-background">
                            <div className="service-icon-container"><div className="blood-glucose-meter-icon"></div></div>
                            <FormattedMessage id="comprehensive-service-section.option-diabetes" />
                        </div>
                        <div className="nearly-clinic content-background">
                            <div className="service-icon-container"><div className="locate-icon"></div></div>
                            <FormattedMessage id="comprehensive-service-section.option-near-clinic" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ComprehensiveServiceSection));
