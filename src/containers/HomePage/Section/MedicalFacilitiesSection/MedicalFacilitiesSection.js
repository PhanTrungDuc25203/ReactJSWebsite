import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import './MedicalFacilitiesSection.scss';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FormattedMessage } from 'react-intl';
import * as actions from "../../../../store/actions";
import { LANGUAGES } from "../../../../utils";
import { switchLanguageOfWebsite } from "../../../../store/actions";

class MedicalFacilitiesSection extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrMedicalFacility: [],
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.medicalFacility !== this.props.medicalFacility) {
            this.setState({
                arrMedicalFacility: this.props.medicalFacility,
            })
        }
    }

    componentDidMount() {
        this.props.loadMedicalFacilities('ALLANDIMAGE');
    }

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

    handleViewDetailArticleOfAFacility = (facility) => {
        this.props.history.push(`/detail-medical-facility/${facility}`);
    }

    render() {

        let { arrMedicalFacility } = this.state;

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
            autoplaySpeed: 7000,
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
                        {arrMedicalFacility && arrMedicalFacility.length > 0 &&
                            arrMedicalFacility.map((item, index) => {
                                let imageByBase64 = '';
                                if (item.image) {
                                    imageByBase64 = Buffer.from(item.image, 'base64').toString('binary');
                                }
                                return (
                                    <div className="item-content" key={index}
                                        onClick={() => this.handleViewDetailArticleOfAFacility(item.id)}
                                    >
                                        <div className="item-of-slider">
                                            <div className="image-css"
                                                style={{ backgroundImage: `url(${imageByBase64})` }}
                                            >

                                            </div>
                                            <div className="item-content">
                                                {item.name}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
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
        medicalFacility: state.admin.medicalFacility,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loadMedicalFacilities: (id) => dispatch(actions.getBriefInfoOfMedicalFaclityAction(id)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MedicalFacilitiesSection));
