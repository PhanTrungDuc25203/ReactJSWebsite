import React, { useState, useEffect, useMemo, Fragment, Suspense } from 'react';
import { connect } from "react-redux";
import HomePageHeader from '../../HomePage/HomePageHeader/HomePageHeader';
import './DetailArticleForADoctor.scss';
import HomeFooter from '../../HomePage/HomeFooter/HomeFooter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import { getInforAndArticleForADoctor } from '../../../services/userService';
import defaultAvatar from '../../../assets/images/default-avatar-circle.png';
import { LANGUAGES } from '../../../utils';
import CustomScrollbars from '../../../components/CustomScrollbars';

// Lazy load for sections
const DoctorScheduleSection = React.lazy(() => import('./DoctorScheduleSection'));
const DoctorExtraInforSection = React.lazy(() => import('./DoctorExtraInforSection'));

const DetailArticleForADoctor = (props) => {
    const [doctorDetails, setDoctorDetails] = useState({});

    const { language } = props;

    useEffect(() => {
        const fetchDoctorDetails = async () => {
            if (props.match && props.match.params && props.match.params.id) {
                let id = props.match.params.id;
                let res = await getInforAndArticleForADoctor(id);
                if (res && res.errCode === 0) {
                    setDoctorDetails(res.data);
                }
            }
        };

        fetchDoctorDetails();
    }, [props.match.params.id]); // Dependency array ensures it only re-fetches when ID changes

    // Memoize the name to avoid re-calculating unnecessarily
    const nameInVie = useMemo(() => {
        if (doctorDetails && doctorDetails.positionData) {
            return `${doctorDetails.positionData.value_Vie}, ${doctorDetails.lastName} ${doctorDetails.firstName}`;
        }
        return '';
    }, [doctorDetails]);

    const nameInEng = useMemo(() => {
        if (doctorDetails && doctorDetails.positionData) {
            return `${doctorDetails.positionData.value_Eng}, ${doctorDetails.firstName} ${doctorDetails.lastName}`;
        }
        return '';
    }, [doctorDetails]);
    return (
        <Fragment>
            <CustomScrollbars style={{ height: '100vh', width: '100%' }}>
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
                                }}>
                            </div>
                        </div>
                        <div className="right-content">
                            <div className="general-introduction">
                                <div className="name-and-position">
                                    {language === LANGUAGES.VI ? nameInVie : nameInEng}
                                </div>
                                <div className="general-information">
                                    {doctorDetails?.ArticleMarkdown?.description &&
                                        <span>
                                            {doctorDetails.ArticleMarkdown.description}
                                            <br />
                                            <FontAwesomeIcon icon={faMapLocationDot} className="location-icon" />
                                            {language === LANGUAGES.VI ? doctorDetails.Doctor_infor.provinceTypeData.value_Vie : doctorDetails.Doctor_infor.provinceTypeData.value_Eng}
                                        </span>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="booking-time-and-exam-location">
                        <Suspense fallback={<div>Loading schedule...</div>}>
                            <div className="left-content-timeframe">
                                <DoctorScheduleSection selectedDoctorId={doctorDetails.id || -1} />
                            </div>
                        </Suspense>
                        <Suspense fallback={<div>Loading extra info...</div>}>
                            <div className="right-content-location">
                                <DoctorExtraInforSection selectedDoctorId={doctorDetails.id || -1} />
                            </div>
                        </Suspense>
                    </div>
                    <div className="curriculum-vitae">
                        {doctorDetails?.ArticleMarkdown?.htmlContent &&
                            <div dangerouslySetInnerHTML={{ __html: doctorDetails.ArticleMarkdown.htmlContent }} className="doctor-CV-html"></div>
                        }
                    </div>
                    <div className="feedback-and-comment">
                        comment
                    </div>
                </div>
                <HomeFooter />
            </CustomScrollbars>
        </Fragment>
    );
};

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

export default connect(mapStateToProps)(DetailArticleForADoctor);
