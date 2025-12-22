import { connect } from "react-redux";
import React, { Component } from "react";
import "../SearchPage.scss";
import { path } from "../../../../utils";
import { withRouter } from "react-router";

class DoctorResult extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {}

    componentDidUpdate(prevProps, prevState, snapshot) {}

    handleViewDetailDoctor = (doctorId) => {
        const detailPath = path.DETAIL_DOCTOR_ARTICLE.replace(":id", doctorId);
        this.props.history.push(detailPath);
    };

    render() {
        let { doctorResult } = this.props;

        if (!doctorResult || !doctorResult.data) {
            return null;
        }

        return (
            <div className="doctor-result-container">
                <p className="result-section-title">Bác sĩ</p>
                {doctorResult.data.map((item) => {
                    let imageByBase64 = "";
                    if (item.User.image && item.User.image.data) {
                        imageByBase64 = Buffer.from(item.User.image, "base64").toString("binary");
                    }

                    return (
                        <div key={item.id} className="result-item" onClick={() => this.handleViewDetailDoctor(item.id)}>
                            <div
                                className="result-image"
                                style={{
                                    backgroundImage: `url(${imageByBase64})`,
                                }}
                            ></div>
                            <div className="text-container">
                                <div className="result-name">{item.User.positionData.value_Vie + ", " + item.User.lastName + " " + item.User.firstName}</div>
                                <div className="result-content">
                                    {item.User.Doctor_specialty_medicalFacility?.medicalFacilityDoctorAndSpecialty?.name || ""}
                                    {" - "}
                                    {item.User.Doctor_specialty_medicalFacility?.Specialty?.name || ""}
                                </div>
                            </div>
                        </div>
                    );
                })}
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DoctorResult));
