import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HomePageHeader.scss';

class HomePageHeader extends Component {

    render() {

        return (
            <React.Fragment>
                <div className="home-header-container">
                    <div className="home-header-contents">
                        <div className="left-contents">
                            <i className="fas fa-bars"></i>
                            <div className="header-logo">
                            </div>
                        </div>
                        <div className="center-contents">
                            <div className="child-content">
                                <div className="header-option-title">
                                    <a href="#"><b>Chuyên khoa</b></a>
                                </div>
                                <div className="header-option-detail">
                                    Tìm bác sĩ theo chuyên khoa
                                </div>
                            </div>
                            <div className="child-content">
                                <div className="header-option-title">
                                    <a href="#"><b>Cơ sở y tế</b></a>
                                </div>
                                <div className="header-option-detail">
                                    Chọn bệnh viện, phòng khám
                                </div>
                            </div>
                            <div className="child-content">
                                <div className="header-option-title">
                                    <a href="#"><b>Bác sĩ</b></a>
                                </div>
                                <div className="header-option-detail">
                                    Chọn những bác sĩ ưu tú
                                </div>
                            </div>
                            <div className="child-content">
                                <div className="header-option-title">
                                    <a href="#"><b>Gói khám</b></a>
                                </div>
                                <div className="header-option-detail">
                                    Khám sức khỏe tổng quát
                                </div>
                            </div>
                        </div>
                        <div className="right-contents">
                            <div className="header-booking-section">
                                <i className="far fa-clock"></i>
                                <div className="header-right-section-title title-1">Đặt lịch</div>
                            </div>
                            <div className="header-support-section">
                                <i className="far fa-question-circle"></i>
                                <div className="header-right-section-title title-2">Hỗ trợ</div>
                            </div>
                            <div className="header-user-account-section">
                                <i className="far fa-user"></i>
                                <div className="header-right-section-title title-3"><b>Đăng nhập</b></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="menu-between-header-and-banner">
                    <nav>
                        <ul id="home-top-navigator">
                            <li>Trang chủ</li>
                            <li>Khám chuyên khoa</li>
                            <li>Khám từ xa</li>
                            <li>Khám tổng quát</li>
                            <li>Xét nghiệm y học</li>
                            <li>Sức khỏe tinh thần</li>
                            <li>Khám nha khoa</li>
                            <div id="marker"></div>
                        </ul>
                    </nav>
                </div>
                <div className="home-header-banner-container">
                    <div className="home-page-banners"></div>
                    <div className="search-area">
                        
                    </div>
                </div>
            </React.Fragment>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePageHeader);
