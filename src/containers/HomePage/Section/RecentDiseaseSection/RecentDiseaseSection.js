import React, { Component } from 'react';
import { connect } from 'react-redux';
import './RecentDiseaseSection.scss';
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

class RecentDiseaseSection extends Component {

    render() {
        return (
            <div className="about-section">
                This is recent disease
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

export default connect(mapStateToProps, mapDispatchToProps)(RecentDiseaseSection);
