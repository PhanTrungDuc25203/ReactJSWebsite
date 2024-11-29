import React, { Component } from 'react';
import { connect } from 'react-redux';
import './SpecialtySection.scss';
import { withRouter } from 'react-router';
import * as actions from '../../../../store/actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FormattedMessage } from 'react-intl';
import { LANGUAGES, path } from "../../../../utils";
import { switchLanguageOfWebsite } from "../../../../store/actions";

class SpecialtySection extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrSpecialty: [],
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.specialtiesData !== this.props.specialtiesData) {
            this.setState({
                arrSpecialty: this.props.arrSpecialty,
            })
        }
    }

    componentDidMount() {
        this.props.loadSpecialties();
    }

    handleViewDetailArticleOfASpecialty = (specialty) => {
        // console.log("Check this doctor: ", doctor);
        this.props.history.push(`/detail-specialty-article/${specialty.id}`);
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

    render() {
        let arrSpecialty = this.props.specialtiesData;
        let { language } = this.props;
        const isMobile = window.innerWidth <= 430;
        const settings = {
            dots: isMobile ? false : true,
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 3,
            nextArrow: <this.SampleNextArrow />,
            prevArrow: <this.SamplePrevArrow />,
            autoplay: true,
            className: 'specialty-section-slider',
            autoplaySpeed: 6000,
            speed: 1000,
            pauseOnHover: true,
            pauseOnDotsHover: true,
            responsive: [
                {
                    breakpoint: 430,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2
                    }
                }
            ],
        };

        return (
            <div className="specialty-section">
                <div className="specialty-contents">
                    <div className="specialty-section-title">
                        <div className="title-text">
                            <FormattedMessage id="specialty-section.specialty-section-title" />
                        </div>
                        <div className="spacing"></div>
                        <div className="more-detail-button"><a href={path.ALL_SPECIALTIES} className="button">
                            <FormattedMessage id="specialty-section.button-more-detail" />
                        </a></div>
                    </div>
                    <Slider {...settings}>
                        {arrSpecialty && arrSpecialty.length > 0 &&
                            arrSpecialty.slice(0, 15).map((item, index) => {
                                let imageByBase64 = '';
                                if (item.specialtyImage) {
                                    imageByBase64 = Buffer.from(item.specialtyImage, 'base64').toString('binary');
                                }
                                let nameInVie = `${item.name}`;
                                let nameInEng = `${item.name}`;
                                return (
                                    <div className="item-content" key={index}
                                        onClick={() => this.handleViewDetailArticleOfASpecialty(item)}
                                    >
                                        <div className="item-of-slider">
                                            <div className="image-css"
                                                style={{ backgroundImage: `url(${imageByBase64})` }}
                                            >

                                            </div>
                                            <div className="item-content">
                                                {language === LANGUAGES.VI ? nameInVie : nameInEng}
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
        // specialtiesData: state.admin.specialties,
        specialtiesData: state.admin?.specialties || [],
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loadSpecialties: () => dispatch(actions.fetchSpecialties()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SpecialtySection));
