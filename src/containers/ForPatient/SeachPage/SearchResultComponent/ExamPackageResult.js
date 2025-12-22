import { connect } from "react-redux";
import React, { Component } from "react";
import "../SearchPage.scss";
import { path } from "../../../../utils";
import { withRouter } from "react-router";

class ExamPackageResult extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {}

    componentDidUpdate(prevProps, prevState, snapshot) {}

    handleViewDetailExamPackage = (packageId) => {
        const detailPath = path.DETAIL_EXAM_PACKAGE_ARTICLE.replace(":id", packageId);
        this.props.history.push(detailPath);
    };

    render() {
        // console.log("Check exampackage props: ", this.props.examPackageResult);
        let { examPackageResult } = this.props;

        if (!examPackageResult || !examPackageResult.data) {
            return null;
        }

        return (
            <div className="specialty-result-container">
                <p className="result-section-title">Gói khám</p>
                {examPackageResult.data.map((item) => {
                    let imageByBase64 = "";
                    if (item.image && item.image.data) {
                        imageByBase64 = Buffer.from(item.image, "base64").toString("binary");
                    }

                    return (
                        <div key={item.id} className="result-item" onClick={() => this.handleViewDetailExamPackage(item.id)}>
                            <div
                                className="result-image square-image-css"
                                style={{
                                    backgroundImage: `url(${imageByBase64})`,
                                }}
                            ></div>
                            <div className="text-container">
                                <div className="result-name">{item.name}</div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ExamPackageResult));
