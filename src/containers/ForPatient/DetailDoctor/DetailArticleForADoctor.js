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
                                    {/* <p>
                                        Hơn 20 năm kinh nghiệm trong lĩnh vực Tai Mũi Họng.
                                        <br></br>
                                        Giám Đốc chuyên môn Bệnh viện Đa khoa Quốc tế Nam Sài Gòn.
                                        <br></br>
                                        Bác sĩ nhận khám mọi độ tuổi.
                                        <br></br>
                                        <FontAwesomeIcon icon={faMapLocationDot} className="location-icon" />
                                        Hà Nội
                                    </p> */}
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
                        booking
                    </div>
                    <div className="curriculum-vitae">
                        {/* <p><strong>Phó Giáo sư, Tiến sĩ Phan Trung Đức</strong></p>
                        <ul>
                            <li>Bác sĩ có nhiều năm kinh nghiệm trong khám và điều trị Sản phụ khoa</li>
                            <li>Bác sĩ từng công tác tại khoa Yêu cầu, Bệnh viện Phụ sản Hà Nội</li>
                            <li>Hiện đang công tác tại phòng khám Mediplus</li>
                            <li>Bác sĩ nhận khám mọi độ tuổi</li>
                        </ul>
                        <p><strong>Nhận khám và điều trị</strong></p>
                        <ul>
                            <li>Khám và tư vấn điều trị các bệnh phụ khoa: Viêm nhiễm âm đạo, Viêm nhiễm cổ tử cung</li>
                            <li>Xử lý tổn thương bất thường tại cổ tử cung, âm đạo</li>
                            <li>Tư vấn kiến thức về sinh khỏe sinh sản cho mọi lứa tuổi, các biện pháp tránh thai</li>
                            <li>Khám và tư vấn các bất thường về phụ khoa về sinh đẻ tuổi tiền mãn kinh và mãn kinh</li>
                            <li>Khám và tư vấn tiền hôn nhân</li>
                            <li>Khám và tư vấn thai cho bà mẹ ở các mốc của thai kỳ</li>
                            <li>Tư vấn cách chăm sóc sức khỏe sinh sản ở độ tuổi vị thành niên</li>
                        </ul>
                        <p><strong>Quá trình công tác</strong></p>
                        <ul>
                            <li>Bác sĩ Sản phụ khoa, Tổ hợp Y tế Mediplus (2022 - nay)</li>
                            <li>Bác sĩ tại phòng khám yêu cầu, Bệnh viện Phụ sản Hà Nội (2006 - 2022)</li>
                        </ul> */}
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
