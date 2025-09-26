import React, { Component } from "react";
import { connect } from "react-redux";
import "./StayAHealthyLifeSection.scss";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FormattedMessage } from "react-intl";
import { LANGUAGES } from "../../../../utils";
import { switchLanguageOfWebsite } from "../../../../store/actions";

class StayAHealthyLifeSection extends Component {
    SampleNextArrow(props) {
        const { className, style, onClick } = props;
        return <div className={`${className} slider-button-next override`} style={style} onClick={onClick} />;
    }

    // Định nghĩa hàm SamplePrevArrow
    SamplePrevArrow(props) {
        const { className, style, onClick } = props;
        return <div className={`${className} slider-button-prev override`} style={style} onClick={onClick} />;
    }

    render() {
        const isMobile = window.innerWidth <= 430;
        const settings = {
            dots: isMobile ? false : true,
            infinite: true,
            slidesToShow: 4,
            slidesToScroll: 4,
            nextArrow: <this.SampleNextArrow />, // Sử dụng SampleNextArrow
            prevArrow: <this.SamplePrevArrow />, // Sử dụng SamplePrevArrow
            autoplay: true,
            className: "stay-a-healthy-life-section-slider",
            // dotsClass: 'stay-a-healthy-life-section-dots-of-slider',
            autoplaySpeed: 12000,
            speed: 1000,
            pauseOnHover: true,
            // fade: true,
            // focusOnSelect: true,
            pauseOnDotsHover: true,
        };

        return (
            <div className="stay-a-healthy-life-section">
                <div className="stay-a-healthy-life-section-contents">
                    <div className="stay-a-healthy-life-section-title-section">
                        <div className="title-text">
                            <FormattedMessage id="stay-a-healthy-life-section.stay-a-healthy-life-section-title" />
                        </div>
                        <div className="more-detail-button">
                            <a href="#" className="button">
                                <FormattedMessage id="stay-a-healthy-life-section.button-more-detail" />
                            </a>
                        </div>
                    </div>

                    <Slider {...settings}>
                        <div className="item-content">
                            <div className="item-of-slider">
                                <div className="image-of-item-1 image-css"></div>
                                <div className="item-content">
                                    <FormattedMessage id="stay-a-healthy-life-section.article-1" />
                                </div>
                            </div>
                        </div>

                        <div className="item-content">
                            <div className="item-of-slider">
                                <div className="image-of-item-2 image-css"></div>
                                <div className="item-content">
                                    <FormattedMessage id="stay-a-healthy-life-section.article-2" />
                                </div>
                            </div>
                        </div>
                        <div className="item-content">
                            <div className="item-of-slider">
                                <div className="image-of-item-3 image-css"></div>
                                <div className="item-content">
                                    <FormattedMessage id="stay-a-healthy-life-section.article-3" />
                                </div>
                            </div>
                        </div>
                        <div className="item-content">
                            <div className="item-of-slider">
                                <div className="image-of-item-4 image-css"></div>
                                <div className="item-content">
                                    <FormattedMessage id="stay-a-healthy-life-section.article-4" />
                                </div>
                            </div>
                        </div>
                        <div className="item-content">
                            <div className="item-of-slider">
                                <div className="image-of-item-5 image-css"></div>
                                <div className="item-content">
                                    <FormattedMessage id="stay-a-healthy-life-section.article-5" />
                                </div>
                            </div>
                        </div>
                        <div className="item-content">
                            <div className="item-of-slider">
                                <div className="image-of-item-6 image-css"></div>
                                <div className="item-content">
                                    <FormattedMessage id="stay-a-healthy-life-section.article-6" />
                                </div>
                            </div>
                        </div>
                        <div className="item-content">
                            <div className="item-of-slider">
                                <div className="image-of-item-7 image-css"></div>
                                <div className="item-content">
                                    <FormattedMessage id="stay-a-healthy-life-section.article-7" />
                                </div>
                            </div>
                        </div>
                        <div className="item-content">
                            <div className="item-of-slider">
                                <div className="image-of-item-8 image-css"></div>
                                <div className="item-content">
                                    <FormattedMessage id="stay-a-healthy-life-section.article-8" />
                                </div>
                            </div>
                        </div>
                        <div className="item-content">
                            <div className="item-of-slider">
                                <div className="image-of-item-9 image-css"></div>
                                <div className="item-content">
                                    <FormattedMessage id="stay-a-healthy-life-section.article-9" />
                                </div>
                            </div>
                        </div>
                        <div className="item-content">
                            <div className="item-of-slider">
                                <div className="image-of-item-10 image-css"></div>
                                <div className="item-content">
                                    <FormattedMessage id="stay-a-healthy-life-section.article-10" />
                                </div>
                            </div>
                        </div>
                        <div className="item-content">
                            <div className="item-of-slider">
                                <div className="image-of-item-11 image-css"></div>
                                <div className="item-content">
                                    <FormattedMessage id="stay-a-healthy-life-section.article-11" />
                                </div>
                            </div>
                        </div>
                        <div className="item-content">
                            <div className="item-of-slider">
                                <div className="image-of-item-12 image-css"></div>
                                <div className="item-content">
                                    <FormattedMessage id="stay-a-healthy-life-section.article-12" />
                                </div>
                            </div>
                        </div>
                        <div className="item-content">
                            <div className="item-of-slider">
                                <div className="image-of-item-13 image-css"></div>
                                <div className="item-content">
                                    <FormattedMessage id="stay-a-healthy-life-section.article-13" />
                                </div>
                            </div>
                        </div>
                        <div className="item-content">
                            <div className="item-of-slider">
                                <div className="image-of-item-14 image-css"></div>
                                <div className="item-content">
                                    <FormattedMessage id="stay-a-healthy-life-section.article-14" />
                                </div>
                            </div>
                        </div>
                        <div className="item-content">
                            <div className="item-of-slider">
                                <div className="image-of-item-15 image-css"></div>
                                <div className="item-content">
                                    <FormattedMessage id="stay-a-healthy-life-section.article-15" />
                                </div>
                            </div>
                        </div>
                    </Slider>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(StayAHealthyLifeSection);
