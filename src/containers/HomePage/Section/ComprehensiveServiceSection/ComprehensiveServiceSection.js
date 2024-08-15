import React, { Component } from 'react';
import { connect } from 'react-redux';
import './ComprehensiveServiceSection.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { } from '@fortawesome/free-brands-svg-icons';
import { } from '@fortawesome/fontawesome-free-webfonts';
import { } from '@fortawesome/fontawesome-svg-core';
import { } from '@fortawesome/free-regular-svg-icons';
import { faTooth, faHeartPulse, faSuitcaseMedical, faStethoscope } from '@fortawesome/free-solid-svg-icons';
import { } from '@fortawesome/free-solid-svg-icons';
import { } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';

class ComprehensiveServiceSection extends Component {

    render() {
        return (
            <div className="comprehensive-service-section">
                <div className="section-title">Dịch vụ toàn diện</div>
                <div className="service-contents">
                    <div className="left-contents">
                        <div className="specialty-exam content-background ">
                            <div className="service-icon-container"><div className="specialty-icon"></div></div>
                            Khám chuyên khoa
                        </div>
                        <div className="general-exam content-background">
                            <div className="service-icon-container"><div className="check-list-icon"></div></div>
                            Khám tổng quát
                        </div>
                        <div className="mental-health content-background">
                            <div className="service-icon-container"><div className="mental-icon"></div></div>
                            Sức khỏe tinh thần
                        </div>
                        <div className="surgery-pack content-background">
                            <div className="service-icon-container"><div className="surgery-icon"></div></div>
                            Gói phẫu thuật
                        </div>
                        <div className="health-checkup content-background">
                            <div className="service-icon-container"><div className="health-checkup-icon"></div></div>
                            Kiểm tra sức khỏe
                        </div>
                    </div>
                    <div className="right-contents">
                        <div className="remote-exam content-background">
                            <div className="service-icon-container"><div className="phone-call-icon"></div></div>
                            Khám từ xa
                        </div>
                        <div className="medical-testing content-background">
                            <div className="service-icon-container"><div className="medical-tube-icon"></div></div>
                            Xét nghiệm y học
                        </div>
                        <div className="dental-health content-background">
                            <div className="service-icon-container"><div className="tooth-icon"></div></div>
                            Khám nha khoa
                        </div>
                        <div className="healthy-with-diabetes content-background">
                            <div className="service-icon-container"><div className="blood-glucose-meter-icon"></div></div>
                            Sống khỏe với tiểu đường
                        </div>
                        <div className="nearly-clinic content-background">
                            <div className="service-icon-container"><div className="locate-icon"></div></div>
                            Cơ sở y tế gần bạn
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

export default connect(mapStateToProps, mapDispatchToProps)(ComprehensiveServiceSection);
