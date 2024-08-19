import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HomeFooter.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { } from '@fortawesome/free-brands-svg-icons';
import { } from '@fortawesome/fontawesome-free-webfonts';
import { } from '@fortawesome/fontawesome-svg-core';
import { } from '@fortawesome/free-regular-svg-icons';
import { faTooth, faHeartPulse, faSuitcaseMedical, faStethoscope } from '@fortawesome/free-solid-svg-icons';
import { } from '@fortawesome/free-solid-svg-icons';
import { } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from "../../../utils";
import { switchLanguageOfWebsite } from "../../../store/actions";

class HomeFooter extends Component {

    render() {
        return (

            <div className="homepage-footer">
                <footer class="footer">
                    <div class="container">
                        <div class="row">
                            <div class="footer-col">
                                <h4><b>Công ty một thành viên</b></h4>
                                <ul>
                                    <li><a href="#">Thông tin</a></li>
                                    <li><a href="#">Dịch vụ</a></li>
                                    <li><a href="#">Chính sách bảo mật</a></li>
                                    <li><a href="#">Chi nhánh</a></li>
                                </ul>
                            </div>
                            <div class="footer-col">
                                <h4><b>Công nghệ sử dụng</b></h4>
                                <ul>
                                    <li><a href="https://nodejs.org/fr" target="_blank">NodeJS</a></li>
                                    <li><a href="https://expressjs.com/" target="_blank">Express</a></li>
                                    <li><a href="https://react.dev/" target="_blank">React</a></li>
                                    {/* <li><a href="#">order status</a></li>
                                    <li><a href="#">payment options</a></li> */}
                                </ul>
                            </div>
                            <div class="footer-col">
                                <h4><b>Giới thiệu</b></h4>
                                <div className="about-me-briefly-content">
                                    Mình là Phan Piscean, mình học IT-E6 ở Đại học Bách Khoa Hà Nội.
                                    Đây là dự án mình tạo ra với mục đích là học tập.
                                    Với giao diện sạch sẽ, chia layout dễ hiểu, thao tác đơn giản và tiếp cận nhiều người dùng ( trừ người khiếm thị ), mình mong nhận dược sự ủng hộ của chính bản thân để có thể làm dự án pet của mình tiến xa hơn.
                                    Và hiện tại mình đang cố gắng áp dụng nhiều công nghệ nhất có thể ví dụ như Trí tuệ nhân tạo.
                                    Với sự giúp sức của Trí tuệ nhân tạo thì người dùng có thể sử dụng tốt ứng dụng này hơn.
                                </div>
                                {/* <ul>
                                    <li><a href="#">watch</a></li>
                                    <li><a href="#">bag</a></li>
                                    <li><a href="#">shoes</a></li>
                                    <li><a href="#">dress</a></li>
                                </ul> */}
                            </div>
                            <div class="footer-col">
                                <h4><b>Theo dõi</b></h4>
                                <div class="social-links">
                                    <a href="#"><i class="fab fa-facebook-f"></i></a>
                                    <a href="#"><i class="fab fa-twitter"></i></a>
                                    <a href="#"><i class="fab fa-instagram"></i></a>
                                    <a href="#"><i class="fab fa-linkedin-in"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="home-footer">
                        <p>&copy; 2024-Phan Piscean.

                        </p>
                        <a href="https://github.com/PhanTrungDuc25203" target="_blank">
                            &#8594; Ghé thăm Github để biết thêm thông tin
                        </a>
                    </div>
                </footer >
            </div >

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

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
