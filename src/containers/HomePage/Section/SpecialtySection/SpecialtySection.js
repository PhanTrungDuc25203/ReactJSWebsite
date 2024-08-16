import React, { Component } from 'react';
import { connect } from 'react-redux';
import './SpecialtySection.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { } from '@fortawesome/free-brands-svg-icons';
import { } from '@fortawesome/fontawesome-free-webfonts';
import { } from '@fortawesome/fontawesome-svg-core';
import { } from '@fortawesome/free-regular-svg-icons';
import { faTooth, faHeartPulse, faSuitcaseMedical, faStethoscope } from '@fortawesome/free-solid-svg-icons';
import { } from '@fortawesome/free-solid-svg-icons';
import { } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../../../../assets/specialty-image/101739-viem-gan.png';

class SpecialtySection extends Component {

    SampleNextArrow(props) {
        const { className, style, onClick } = props;
        return (
            <div
                className={`${className} slider-button-next override`}
                style={style}
                onClick={onClick}
            />
        );
    }

    // Định nghĩa hàm SamplePrevArrow
    SamplePrevArrow(props) {
        const { className, style, onClick } = props;
        return (
            <div
                className={`${className} slider-button-prev override`}
                style={style}
                onClick={onClick}
            />
        );
    }

    render() {
        const settings = {
            dots: false,
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 3,
            nextArrow: <this.SampleNextArrow />,  // Sử dụng SampleNextArrow
            prevArrow: <this.SamplePrevArrow />,  // Sử dụng SamplePrevArrow
            // autoplay: true,
            autoplaySpeed: 6000,
            speed: 1000,
            pauseOnHover: true,
        };

        return (
            <div className="specialty-section">
                <div className="specialty-contents">
                    <div className="specialty-section-title">
                        Chuyên khoa
                        <div className="more-detail-button"><a href="#">Xem thêm</a></div>
                    </div>

                    <Slider {...settings}>
                        <div className="item-content">
                            <div className="item-of-slider">
                                <div className="image-of-item-1 image-css"></div>
                                <div className="item-content">Bệnh viêm gan</div>
                            </div>
                        </div>

                        <div className="item-content">
                            <div className="item-of-slider">
                                <div className="image-of-item-2 image-css"></div>
                                <div className="item-content">Châm cứu</div>
                            </div>
                        </div>
                        <div className="item-content">
                            <div className="item-of-slider">
                                <div className="image-of-item-3 image-css"></div>
                                <div className="item-content">Bệnh xương khớp</div>
                            </div>
                        </div>
                        <div className="item-content">
                            <div className="item-of-slider">
                                <div className="image-of-item-4 image-css"></div>
                                <div className="item-content">Hệ miễn dịch</div>
                            </div>
                        </div>
                        <div className="item-content">
                            <div className="item-of-slider">
                                <div className="image-of-item-5 image-css"></div>
                                <div className="item-content">Cột sống</div>
                            </div>
                        </div>
                        <div className="item-content">
                            <div className="item-of-slider">
                                <div className="image-of-item-6 image-css"></div>
                                <div className="item-content">Da liễu</div>
                            </div>
                        </div>
                        <div className="item-content">
                            <div className="item-of-slider">
                                <div className="image-of-item-7 image-css"></div>
                                <div className="item-content">Nhi khoa</div>
                            </div>
                        </div>
                        <div className="item-content">
                            <div className="item-of-slider">
                                <div className="image-of-item-8 image-css"></div>
                                <div className="item-content">Sản phụ khoa</div>
                            </div>
                        </div>
                        <div className="item-content">
                            <div className="item-of-slider">
                                <div className="image-of-item-9 image-css"></div>
                                <div className="item-content">Siêu âm thai</div>
                            </div>
                        </div>
                        <div className="item-content">
                            <div className="item-of-slider">
                                <div className="image-of-item-10 image-css"></div>
                                <div className="item-content">Sức khỏe tinh thần</div>
                            </div>
                        </div>
                        <div className="item-content">
                            <div className="item-of-slider">
                                <div className="image-of-item-11 image-css"></div>
                                <div className="item-content">Tai mũi họng</div>
                            </div>
                        </div>
                        <div className="item-content">
                            <div className="item-of-slider">
                                <div className="image-of-item-12 image-css"></div>
                                <div className="item-content">Dạ dày</div>
                            </div>
                        </div>
                        <div className="item-content">
                            <div className="item-of-slider">
                                <div className="image-of-item-13 image-css"></div>
                                <div className="item-content">Tim mạch</div>
                            </div>
                        </div>
                        <div className="item-content">
                            <div className="item-of-slider">
                                <div className="image-of-item-14 image-css"></div>
                                <div className="item-content">Thần kinh khoa</div>
                            </div>
                        </div>
                        <div className="item-content">
                            <div className="item-of-slider">
                                <div className="image-of-item-15 image-css"></div>
                                <div className="item-content">Y học cổ truyền</div>
                            </div>
                        </div>
                    </Slider>
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(SpecialtySection);
