import React, { Component } from "react";
import { connect } from "react-redux";
import "./RecentDiseaseSection.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {} from "@fortawesome/free-brands-svg-icons";
import {} from "@fortawesome/fontawesome-free-webfonts";
import {} from "@fortawesome/fontawesome-svg-core";
import {} from "@fortawesome/free-regular-svg-icons";
import { faTooth, faHeartPulse, faSuitcaseMedical, faStethoscope, faCheck } from "@fortawesome/free-solid-svg-icons";
import {} from "@fortawesome/free-solid-svg-icons";
import {} from "@fortawesome/react-fontawesome";
import { FormattedMessage } from "react-intl";
import { LANGUAGES } from "../../../../utils";
import { switchLanguageOfWebsite } from "../../../../store/actions";

class RecentDiseaseSection extends Component {
    render() {
        return (
            <div className="recent-disease-section">
                <div className="recent-disease-section-title">
                    <FormattedMessage id="recent-disease-section.recent-disease-section-title" />
                </div>
                <div className="recent-disease-section-contents">
                    <div className="left-contents">
                        <iframe
                            width="697"
                            height="392"
                            src="https://www.youtube.com/embed/Jz2Pyf_Mu5U"
                            title="Triệu chứng bệnh bạch hầu - Căn bệnh đang bùng phát tại nhiều tỉnh thành | VTV24"
                            // style={{ border: "none",  }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        ></iframe>
                    </div>
                    <div className="right-contents">
                        <div className="information-source">
                            <div className="ensurance-text">
                                <FontAwesomeIcon icon={faCheck} className="fontawesome-icon" />
                                <FormattedMessage id="recent-disease-section.guaranty-text-1" />
                            </div>
                            <div className="ensurance-text">
                                <FontAwesomeIcon icon={faCheck} className="fontawesome-icon" />
                                <FormattedMessage id="recent-disease-section.guaranty-text-2" />
                            </div>
                            <div className="ensurance-text">
                                <FontAwesomeIcon icon={faCheck} className="fontawesome-icon" />
                                <FormattedMessage id="recent-disease-section.guaranty-text-3" />
                            </div>
                            <div className="source-image">
                                <a href="https://moh.gov.vn/" target="_blank" rel="noopener noreferrer" className="source-1 image-css">
                                    {/* <div className="source-1 image-css"></div> */}
                                </a>
                                <a href="https://vtv.vn/tim-kiem.htm?type=3&keywords=b%E1%BB%87nh" target="_blank" rel="noopener noreferrer" className="source-2 image-css">
                                    {/* <div className="source-2 image-css"></div> */}
                                </a>
                                <a href="https://timkiem.vnexpress.net/?search_q=b%E1%BA%A1ch%20h%E1%BA%A7u%27&cate_code=&media_type=all&latest=&fromdate=&todate=&date_format=all&" target="_blank" rel="noopener noreferrer" className="source-3 image-css special-image-css">
                                    {/* <div className="source-3 image-css special-image-css"></div> */}
                                </a>
                                <a href="https://dantri.com.vn/tim-kiem/b%E1%BA%A1ch+h%E1%BA%A7u.htm" target="_blank" rel="noopener noreferrer" className="source-4 image-css">
                                    {/* <div className="source-4 image-css"></div> */}
                                </a>
                            </div>
                        </div>
                    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(RecentDiseaseSection);
