import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./DoctorScheduleComponent.scss";
import { withRouter } from "react-router";
import { getAllUsersToDisplayInReact, createNewUserService, deleteUserService, editUserService } from "../../../services/userService";
import { emitter } from "../../../utils/emitter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
import { LANGUAGES } from "../../../utils";
import DoctorScheduleSection from "../DetailDoctor/DoctorScheduleSection";
import { getInforAndArticleForADoctor } from "../../../services/userService";
import DoctorExtraInforSection from "../DetailDoctor/DoctorExtraInforSection";
import { path } from "../../../utils";
import defaultAvatar from "../../../assets/images/default-avatar-circle.png";

class DoctorScheduleComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            doctorDetails: [],
        };
    }

    async componentDidMount() {
        // console.log("Check props from parent: ", this.props);
        let res = await getInforAndArticleForADoctor(this.props.doctorId);
        if (res && res.errCode === 0) {
            this.setState({
                doctorDetails: res.data,
            });
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {}

    handleViewDetailDoctor = (doctorId) => {
        const detailPath = path.DETAIL_DOCTOR_ARTICLE.replace(":id", doctorId);
        this.props.history.push(detailPath);
    };

    render() {
        let { doctorDetails } = this.state;
        // console.log("Check doctor data: ", doctorDetails);
        let { language } = this.props;
        let nameInVie = "";
        let nameInEng = "";
        if (doctorDetails && doctorDetails.positionData) {
            nameInVie = `${doctorDetails.positionData.value_Vie}, ${doctorDetails.lastName} ${doctorDetails.firstName}`;
            nameInEng = `${doctorDetails.positionData.value_Eng}, ${doctorDetails.firstName} ${doctorDetails.lastName}`;
        }

        return (
            <div className="doctor-schedule-component">
                <div className="left-content">
                    <div
                        className="avatar avatar-css"
                        style={{
                            backgroundImage: `url(${doctorDetails.image ? doctorDetails.image : defaultAvatar})`,
                        }}
                    ></div>
                    <div className="doctor-information">
                        <div className="name" onClick={() => this.handleViewDetailDoctor(doctorDetails.id)}>
                            {language === LANGUAGES.VI ? nameInVie : nameInEng}
                        </div>
                        <div className="description">
                            {doctorDetails && doctorDetails.ArticleMarkdown && doctorDetails.ArticleMarkdown.description && (
                                <span>
                                    {doctorDetails.ArticleMarkdown.description}
                                    <br></br>
                                    <div className="address">
                                        <FontAwesomeIcon icon={faMapLocationDot} className="location-icon" />
                                        {language === LANGUAGES.VI ? doctorDetails.Doctor_infor.provinceTypeData.value_Vie : doctorDetails.Doctor_infor.provinceTypeData.value_Eng}
                                    </div>
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="right-content">
                    <div className="schedule">
                        <DoctorScheduleSection selectedDoctorId={doctorDetails && doctorDetails.id ? doctorDetails.id : -1} />
                    </div>
                    <div className="doctor-extra-information">
                        <DoctorExtraInforSection selectedDoctorId={doctorDetails && doctorDetails.id ? doctorDetails.id : -1} />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DoctorScheduleComponent));
