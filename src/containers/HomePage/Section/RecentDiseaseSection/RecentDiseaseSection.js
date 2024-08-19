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
            <div className="recent-disease-section">
                <div className="recent-disease-section-title">
                    Những dịch bệnh gần đây
                </div>
                <div className="recent-disease-section-contents">
                    <div className="left-contents">
                        <iframe width="697"
                            height="392"
                            src="https://www.youtube.com/embed/Jz2Pyf_Mu5U"
                            title="Triệu chứng bệnh bạch hầu - Căn bệnh đang bùng phát tại nhiều tỉnh thành | VTV24"
                            // style={{ border: "none",  }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen>
                        </iframe>
                    </div>
                    <div className="right-contents">
                        <div className="">

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

export default connect(mapStateToProps, mapDispatchToProps)(RecentDiseaseSection);
