import React, { Component } from 'react';
import { connect } from 'react-redux';
import './EliteDoctorSection.scss';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from "../../../../utils";
import { switchLanguageOfWebsite } from "../../../../store/actions";
import * as actions from '../../../../store/actions';
import { Redirect, Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router';
import defaultAvatar from '../../../../assets/images/default-avatar-circle.png';

class EliteDoctorSection extends Component {

    //TẠO STATE để lưu nhưngx bác sĩ nổit bật hiện tại, state có thể thay đổi tùy vào bác sĩ
    constructor(props) {
        super(props);
        this.state = {
            arrEliteDoctor: [],
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.eliteDoctorsData !== this.props.eliteDoctorsData) {
            this.setState({
                arrEliteDoctor: this.props.arrEliteDoctor,
            })
        }
    }

    componentDidMount() {
        this.props.loadEliteDoctors();
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

    handleViewDetailArticleOfADoctor = (doctor) => {
        console.log("Check this doctor: ", doctor);
        this.props.history.push(`/detail-doctor-article/doctor/${doctor.id}`);
    }

    render() {
        let arrEliteDoctor = this.props.eliteDoctorsData;
        let { language } = this.props;
        const isMobile = window.innerWidth <= 430;
        let settings = {
            dots: isMobile ? false : true,
            infinite: false,
            slidesToShow: 4,
            slidesToScroll: 4,
            nextArrow: <this.SampleNextArrow />,  // Sử dụng SampleNextArrow
            prevArrow: <this.SamplePrevArrow />,  // Sử dụng SamplePrevArrow
            autoplay: false,
            className: 'elite-doctor-section-slider',
            // dotsClass: 'elite-doctor-section-dots-of-slider',
            autoplaySpeed: 8000,
            speed: 1000,
            pauseOnHover: true,
            // fade: true,
            // focusOnSelect: true,
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
            <div className="elite-doctor-section">
                <div className="elite-doctor-section-contents">
                    <div className="elite-doctor-section-section-title">
                        <div className="title-text">
                            <FormattedMessage id="elite-doctor-section.elite-doctor-section-title" />
                        </div>
                        <div className="spacing"></div>
                        <div className="more-detail-button"><a href="#" className="button">
                            <FormattedMessage id="elite-doctor-section.more-detail-button" />
                        </a></div>
                    </div>

                    <Slider {...settings}>


                        {arrEliteDoctor && arrEliteDoctor.length > 0 &&
                            arrEliteDoctor.map((item, index) => {
                                let imageByBase64 = '';
                                if (item.image) {
                                    imageByBase64 = Buffer.from(item.image, 'base64').toString('binary');
                                }
                                let nameInVie = `${item.positionData.value_Vie}, ${item.lastName} ${item.firstName}`;
                                let nameInEng = `${item.positionData.value_Eng}, ${item.firstName} ${item.lastName}`;
                                return (
                                    <div className="item-content" key={index}
                                        onClick={() => this.handleViewDetailArticleOfADoctor(item)}
                                    >
                                        <div className="item-of-slider">
                                            {/* <div className="image-of-item-1 image-css" */}
                                            <div className="image-css"
                                                style={{ backgroundImage: `url(${imageByBase64 ? imageByBase64 : defaultAvatar})` }}
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

                        {/* <div className="item-content">
                            <div className="item-of-slider">
                                <div className="image-of-item-1 image-css"></div>
                                <div className="item-content">Phan Piscean
                                </div>
                            </div>
                        </div>

                        <div className="item-content">
                            <div className="item-of-slider">
                                <div className="image-of-item-1 image-css"></div>
                                <div className="item-content">Phan Piscean
                                </div>
                            </div>
                        </div>

                        <div className="item-content">
                            <div className="item-of-slider">
                                <div className="image-of-item-1 image-css"></div>
                                <div className="item-content">Phan Piscean
                                </div>

                            </div>
                        </div>

                        <div className="item-content">
                            <div className="item-of-slider">
                                <div className="image-of-item-1 image-css"></div>
                                <div className="item-content">Phan Piscean
                                </div>
                            </div>
                        </div>

                        <div className="item-content">
                            <div className="item-of-slider">
                                <div className="image-of-item-1 image-css"></div>
                                <div className="item-content">Phan Piscean
                                </div>
                            </div>
                        </div> */}

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
        eliteDoctorsData: state.admin.eliteDoctors,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loadEliteDoctors: () => dispatch(actions.fetchEliteDoctors()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EliteDoctorSection));
