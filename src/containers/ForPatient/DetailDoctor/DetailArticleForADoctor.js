import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import HomePageHeader from '../../HomePage/HomePageHeader/HomePageHeader';
import './DetailArticleForADoctor.scss';
import HomeFooter from '../../HomePage/HomeFooter/HomeFooter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import { getInforAndArticleForADoctor } from '../../../services/userService';
import defaultAvatar from '../../../assets/images/default-avatar-circle.png'
import { LANGUAGES } from '../../../utils';
import DoctorScheduleSection from './DoctorScheduleSection';

class DetailArticleForADoctor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            doctorDetails: {},
        }
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let res = await getInforAndArticleForADoctor(id);
            console.log("Check api get article: ", res);
            if (res && res.errCode === 0) {
                this.setState({
                    doctorDetails: res.data,
                })
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    render() {
        // const { systemMenuPath, isLoggedIn } = this.props;
        let { doctorDetails } = this.state;
        // console.log('This doctor: ', this.state.doctorDetails)
        let { language } = this.props;
        let nameInVie = '';
        let nameInEng = '';
        if (doctorDetails && doctorDetails.positionData) {
            nameInVie = `${doctorDetails.positionData.value_Vie}, ${doctorDetails.lastName} ${doctorDetails.firstName}`;
            nameInEng = `${doctorDetails.positionData.value_Eng}, ${doctorDetails.firstName} ${doctorDetails.lastName}`;
        }

        return (
            <React.Fragment>
                <HomePageHeader isShowBanner={false} />
                <div className="doctor-article-container">
                    <div className="avatar-and-general-introduction">
                        <div className="left-content">
                            <div className="avatar-css"
                                style={{
                                    backgroundImage: `url(${doctorDetails.image
                                        ? doctorDetails.image
                                        : defaultAvatar
                                        })`
                                }}
                            >

                            </div>
                        </div>
                        <div className="right-content">
                            <div className="general-introduction">
                                <div className="name-and-position">
                                    {language === LANGUAGES.VI ? nameInVie : nameInEng}
                                </div>
                                <div className="general-information">
                                    {doctorDetails && doctorDetails.ArticleMarkdown && doctorDetails.ArticleMarkdown.description &&
                                        <span>
                                            {doctorDetails.ArticleMarkdown.description}
                                            <br></br>
                                            <FontAwesomeIcon icon={faMapLocationDot} className="location-icon" />
                                            Hà Nội
                                        </span>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="booking-time-and-exam-location">
                        <div className="left-content-timeframe">
                            <DoctorScheduleSection
                                selectedDoctorId={doctorDetails && doctorDetails.id ? doctorDetails.id : -1}
                            />
                        </div>
                        <div className="right-content-location">

                        </div>

                    </div>
                    <div className="curriculum-vitae">
                        {doctorDetails && doctorDetails.ArticleMarkdown && doctorDetails.ArticleMarkdown.htmlContent &&
                            <div dangerouslySetInnerHTML={{ __html: doctorDetails.ArticleMarkdown.htmlContent }} className="doctor-CV-html"></div>
                        }

                    </div>
                    <div className="feedback-and-comment">
                        comment
                    </div>
                </div>
                <HomeFooter />
            </React.Fragment >

        );
    }
}

const mapStateToProps = state => {
    return {
        // systemMenuPath: state.app.systemMenuPath,
        // isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailArticleForADoctor);
