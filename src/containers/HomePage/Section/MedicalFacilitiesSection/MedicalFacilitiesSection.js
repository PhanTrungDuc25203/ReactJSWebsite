import React, { Component } from 'react';
import { connect } from 'react-redux';
import './MedicalFacilitiesSection.scss';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from "../../../../utils";
import { switchLanguageOfWebsite } from "../../../../store/actions";

class MedicalFacilitiesSection extends Component {

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
            dots: true,
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 3,
            nextArrow: <this.SampleNextArrow />,  // Sử dụng SampleNextArrow
            prevArrow: <this.SamplePrevArrow />,  // Sử dụng SamplePrevArrow
            autoplay: true,
            className: 'medical-facilities-section-slider',
            // dotsClass: 'medical-facilities-section-dots-of-slider',
            autoplaySpeed: 6000,
            speed: 1000,
            pauseOnHover: true,
            // fade: true,
            // focusOnSelect: true,
            pauseOnDotsHover: true,
        };

        return (
            <div className="medical-facilities-section">
                <div className="medical-facilities-section-contents">
                    <div className="medical-facilities-section-section-title">
                        <div className="title-text">
                            <FormattedMessage id="medical-facilities-section.medical-facilities-section-title" />
                        </div>
                        <div className="spacing"></div>
                        <div className="more-detail-button"><a href="#" className="button">
                            <FormattedMessage id="medical-facilities-section.button-more-detail" />
                        </a></div>
                    </div>

                    <Slider {...settings}>
                        <div className="item-content">
                            <div className="item-of-slider">
                                <div className="image-of-item-1 image-css"></div>
                                <div className="item-content"><FormattedMessage id="medical-facilities-section.hospital-1" />
                                </div>
                            </div>
                        </div>

                        <div className="item-content">
                            <div className="item-of-slider">
                                <div className="image-of-item-2 image-css"></div>
                                <div className="item-content"><FormattedMessage id="medical-facilities-section.hospital-2" />
                                </div>
                            </div>
                        </div>
                        <div className="item-content">
                            <div className="item-of-slider">
                                <div className="image-of-item-3 image-css"></div>
                                <div className="item-content"><FormattedMessage id="medical-facilities-section.hospital-3" />
                                </div>
                            </div>
                        </div>
                        <div className="item-content">
                            <div className="item-of-slider">
                                <div className="image-of-item-4 image-css"></div>
                                <div className="item-content"><FormattedMessage id="medical-facilities-section.hospital-4" />
                                </div>

                            </div>
                        </div>
                        <div className="item-content">
                            <div className="item-of-slider">
                                <div className="image-of-item-5 image-css"></div>
                                <div className="item-content"><FormattedMessage id="medical-facilities-section.hospital-5" />
                                </div>
                            </div>
                        </div>
                        <div className="item-content">
                            <div className="item-of-slider">
                                <div className="image-of-item-6 image-css"></div>
                                <div className="item-content"><FormattedMessage id="medical-facilities-section.hospital-6" />
                                </div>
                            </div>
                        </div>
                        <div className="item-content">
                            <div className="item-of-slider">
                                <div className="image-of-item-7 image-css"></div>
                                <div className="item-content"><FormattedMessage id="medical-facilities-section.hospital-7" />
                                </div>
                            </div>
                        </div>
                        <div className="item-content">
                            <div className="item-of-slider">
                                <div className="image-of-item-8 image-css"></div>
                                <div className="item-content"><FormattedMessage id="medical-facilities-section.hospital-8" />
                                </div>
                            </div>
                        </div>
                        <div className="item-content">
                            <div className="item-of-slider">
                                <div className="image-of-item-9 image-css"></div>
                                <div className="item-content"><FormattedMessage id="medical-facilities-section.hospital-9" />
                                </div>
                            </div>
                        </div>
                        <div className="item-content">
                            <div className="item-of-slider">
                                <div className="image-of-item-10 image-css"></div>
                                <div className="item-content"><FormattedMessage id="medical-facilities-section.hospital-10" />
                                </div>
                            </div>
                        </div>
                        <div className="item-content">
                            <div className="item-of-slider">
                                <div className="image-of-item-11 image-css"></div>
                                <div className="item-content"><FormattedMessage id="medical-facilities-section.hospital-11" />
                                </div>
                            </div>
                        </div>
                        <div className="item-content">
                            <div className="item-of-slider">
                                <div className="image-of-item-12 image-css"></div>
                                <div className="item-content"><FormattedMessage id="medical-facilities-section.hospital-12" />
                                </div>
                            </div>
                        </div>
                        <div className="item-content">
                            <div className="item-of-slider">
                                <div className="image-of-item-13 image-css"></div>
                                <div className="item-content"><FormattedMessage id="medical-facilities-section.hospital-13" />
                                </div>
                            </div>
                        </div>
                        <div className="item-content">
                            <div className="item-of-slider">
                                <div className="image-of-item-14 image-css"></div>
                                <div className="item-content"><FormattedMessage id="medical-facilities-section.hospital-14" />
                                </div>
                            </div>
                        </div>
                        <div className="item-content">
                            <div className="item-of-slider">
                                <div className="image-of-item-15 image-css"></div>
                                <div className="item-content"><FormattedMessage id="medical-facilities-section.hospital-15" />
                                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(MedicalFacilitiesSection);
