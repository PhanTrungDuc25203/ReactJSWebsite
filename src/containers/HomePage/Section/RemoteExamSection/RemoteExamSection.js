import React, { Component } from "react";
import { connect } from "react-redux";
import "./RemoteExamSection.scss";
import { withRouter } from "react-router";
import * as actions from "../../../../store/actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FormattedMessage } from "react-intl";
import { LANGUAGES, path } from "../../../../utils";
import { switchLanguageOfWebsite } from "../../../../store/actions";

class RemoteExamSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrRemoteSpecialty: [],
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.remoteSpecialtiesData !== this.props.remoteSpecialtiesData) {
      this.setState({
        arrRemoteSpecialty: this.props.remoteSpecialtiesData,
      });
    }
  }

  componentDidMount() {
    this.props.loadRemoteSpecialties();
  }

  handleViewDetailArticleOfASpecialty = (specialty) => {
    // console.log("Check this doctor: ", doctor);
    this.props.history.push(`/detail-specialty-article/${specialty.id}`);
  };

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
    let arrRemoteSpecialty = this.state.arrRemoteSpecialty;
    let { language } = this.props;
    const isMobile = window.innerWidth <= 430;
    const settings = {
      dots: isMobile ? false : true,
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 3,
      nextArrow: <this.SampleNextArrow />, // Sử dụng SampleNextArrow
      prevArrow: <this.SamplePrevArrow />, // Sử dụng SamplePrevArrow
      autoplay: true,
      className: "remote-exam-section-slider",
      autoplaySpeed: 10000,
      speed: 1000,
      pauseOnHover: true,
      pauseOnDotsHover: true,
      responsive: [
        {
          breakpoint: 430,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
          },
        },
      ],
    };

    return (
      <div className="remote-exam-section">
        <div className="remote-exam-section-contents">
          <div className="remote-exam-section-title-section">
            <div className="title-text">
              <FormattedMessage id="remote-exam-section.remote-exam-section-title" />
            </div>
            <div className="more-detail-button">
              <a href="#" className="button">
                <FormattedMessage id="remote-exam-section.button-more-detail" />
              </a>
            </div>
          </div>

          <Slider {...settings}>
            {arrRemoteSpecialty &&
              arrRemoteSpecialty.length > 0 &&
              arrRemoteSpecialty.slice(0, 15).map((item, index) => {
                let imageByBase64 = "";
                if (item.specialtyImage) {
                  imageByBase64 = Buffer.from(
                    item.specialtyImage,
                    "base64"
                  ).toString("binary");
                }
                let nameInVie = `${item.name}`;
                let nameInEng = `${item.name}`;
                return (
                  <div
                    className="item-content"
                    key={index}
                    onClick={() =>
                      this.handleViewDetailArticleOfASpecialty(item)
                    }
                  >
                    <div className="item-of-slider">
                      <div
                        className="image-css"
                        style={{ backgroundImage: `url(${imageByBase64})` }}
                      ></div>
                      <div className="item-content">
                        {language === LANGUAGES.VI ? nameInVie : nameInEng}
                      </div>
                    </div>
                  </div>
                );
              })}
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
    remoteSpecialtiesData: state.admin?.remoteSpecialties || [],
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadRemoteSpecialties: () => dispatch(actions.fetchRemoteSpecialties()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(RemoteExamSection)
);
