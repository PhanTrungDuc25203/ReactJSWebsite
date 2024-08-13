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
                            <li><i class="far fa-hospital nav-icon"></i>Khám chuyên khoa</li>
                            <li><i class="fas fa-phone-volume nav-icon"></i>Khám từ xa</li>
                            <li><i class="fas fa-child nav-icon"></i>Khám tổng quát</li>
                            <li><i class="fas fa-vial nav-icon"></i>Xét nghiệm y học</li>
                            <li><i class="far fa-heart nav-icon"></i>Sức khỏe tinh thần</li>
                            <li><i class="fas fa-tablets nav-icon"></i>Khám nha khoa</li>


                            <div id="marker"></div>
                        </ul>
                    </nav>
                </div>
                <div className="home-header-banner-container">
                    <div className="search-area">
                        <div className="container">
                            <input type="text" placeholder="Tìm kiếm..."></input>
                            <div className="search"></div>
                            <div className="search-box-title">Nền tảng chăm sóc sức khỏe toàn diện</div>
                            <div className="search-box-content">Hãy để chúng tôi chăm sóc cho bạn</div>
                            <marquee> A simple scrolling text.
                            </marquee>
                        </div>
                    </div>
                    <div className="home-page-banners"></div>

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
