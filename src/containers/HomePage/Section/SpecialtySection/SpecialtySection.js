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
// import "slick-carousel/slick/slick-theme.css";

class SpecialtySection extends Component {


    render() {
        const settings = {
            dots: true,
            infinite: true,
            slidesToShow: 2,
            slidesToScroll: 2,
        };
        return (
            <div className="specialty-section">
                <div className="specialty-contents">
                    <Slider {...settings}>
                        <div>
                            <h1>A</h1>
                        </div>
                        <div>
                            <h1>B</h1>
                        </div>
                        <div>
                            <h1>C</h1>
                        </div>
                        <div>
                            <h1>D</h1>
                        </div>
                    </Slider>
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

export default connect(mapStateToProps, mapDispatchToProps)(SpecialtySection);
