import React, { Component } from "react";
import { connect } from "react-redux";
import "./HomeFooter.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {} from "@fortawesome/free-brands-svg-icons";
import {} from "@fortawesome/fontawesome-free-webfonts";
import {} from "@fortawesome/fontawesome-svg-core";
import {} from "@fortawesome/free-regular-svg-icons";
import { faTooth, faHeartPulse, faSuitcaseMedical, faStethoscope } from "@fortawesome/free-solid-svg-icons";
import {} from "@fortawesome/free-solid-svg-icons";
import {} from "@fortawesome/react-fontawesome";
import { FormattedMessage } from "react-intl";
import { LANGUAGES } from "../../../utils";
import { switchLanguageOfWebsite } from "../../../store/actions";

class HomeFooter extends Component {
    render() {
        return (
            <div className="homepage-footer">
                <footer className="footer">
                    <div className="container">
                        <div className="row">
                            <div className="footer-col">
                                <h4>
                                    <b>
                                        <FormattedMessage id="footer.company" />
                                    </b>
                                </h4>
                                <ul>
                                    <li>
                                        <a href="#">
                                            <FormattedMessage id="footer.infor" />
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <FormattedMessage id="footer.service" />
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <FormattedMessage id="footer.security-term" />
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <FormattedMessage id="footer.branch" />
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="footer-col">
                                <h4>
                                    <b>
                                        <FormattedMessage id="footer.used-technology" />
                                    </b>
                                </h4>
                                <ul>
                                    <li>
                                        <a href="https://nodejs.org/fr" target="_blank">
                                            <FormattedMessage id="footer.tech-1" />
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://expressjs.com/" target="_blank">
                                            <FormattedMessage id="footer.tech-2" />
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://react.dev/" target="_blank">
                                            <FormattedMessage id="footer.tech-3" />
                                        </a>
                                    </li>
                                    {/* <li><a href="#">order status</a></li>
                                    <li><a href="#">payment options</a></li> */}
                                </ul>
                            </div>
                            <div className="footer-col">
                                <h4>
                                    <b>
                                        <FormattedMessage id="footer.title" />
                                    </b>
                                </h4>
                                <div className="about-me-briefly-content">
                                    <FormattedMessage id="footer.present-1" />
                                    <span className="highlight-my-name">
                                        <FormattedMessage id="footer.my-nick-name" />
                                    </span>
                                    <FormattedMessage id="footer.present-2" />
                                </div>
                                {/* <ul>
                                    <li><a href="#">watch</a></li>
                                    <li><a href="#">bag</a></li>
                                    <li><a href="#">shoes</a></li>
                                    <li><a href="#">dress</a></li>
                                </ul> */}
                            </div>
                            <div className="footer-col">
                                <h4>
                                    <b>
                                        <FormattedMessage id="footer.follow" />
                                    </b>
                                </h4>
                                <div className="social-links">
                                    <a href="#">
                                        <i className="fab fa-facebook-f"></i>
                                    </a>
                                    <a href="#">
                                        <i className="fab fa-twitter"></i>
                                    </a>
                                    <a href="#">
                                        <i className="fab fa-instagram"></i>
                                    </a>
                                    <a href="#">
                                        <i className="fab fa-linkedin-in"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="home-footer">
                        <p>&copy; 2024-Medical care.</p>
                        <a href="#" target="_blank">
                            &#8594; <FormattedMessage id="footer.check-out-me" />
                        </a>
                    </div>
                </footer>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
