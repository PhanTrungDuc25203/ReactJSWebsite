import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { getRateAndReviewAboutDoctorService } from "../../../services/userService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import "./FeedbackAndComment.scss";
import defaultAvatar from "../../../assets/images/default-avatar-circle.png";
import Lightbox from "react-image-lightbox";
import moment from "moment";
import { FormattedMessage } from "react-intl";

class FeedbackAndComment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            feedbackAndComments: [],
            averageRating: null,
            isLightBoxOpen: false,
            lightboxImages: [],
            photoIndex: 0,
        };
    }

    async componentDidMount() {
        await this.fetchFeedback();
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.doctorId !== this.props.doctorId) {
            await this.fetchFeedback();
        }
    }

    fetchFeedback = async () => {
        try {
            let doctorId = this.props.doctorId;
            if (!doctorId || doctorId === -1) return;

            let res = await getRateAndReviewAboutDoctorService({ doctorId });

            if (res && res.errCode === 0) {
                const averageRating = res.averageRating || 0;

                const parsedData = res.data.map((item) => {
                    let images = [];
                    try {
                        if (typeof item.images === "string") images = JSON.parse(item.images);
                        else if (Array.isArray(item.images)) images = item.images;
                    } catch (err) {
                        images = [];
                    }

                    return {
                        ...item,
                        images: images.map((img) => ({
                            url: img.image,
                            mimeType: img.mimeType || "image/png",
                            name: img.name || "",
                        })),
                        patientData: item.patientData || null,
                    };
                });

                this.setState({
                    feedbackAndComments: parsedData,
                    averageRating: averageRating,
                });
            }
        } catch (e) {
            console.log("Error fetch feedback: ", e);
        }
    };

    openLightbox = (images, index) => {
        const formatted = images.map((img) => this.getImageSrc(img));
        this.setState({
            isOpen: true,
            lightboxImages: formatted,
            photoIndex: index,
        });
    };

    // Convert ảnh review
    getImageSrc = (imageObj) => {
        if (!imageObj || !imageObj.url) return "";
        if (imageObj.url.startsWith("data:image")) return imageObj.url;
        return `data:${imageObj.mimeType};base64,${imageObj.url}`;
    };

    // Convert avatar blob => binary string để hiển thị
    getPatientAvatar = (patientData) => {
        if (!patientData || !patientData.image) return defaultAvatar; // <-- dùng biến import
        try {
            return Buffer.from(patientData.image, "base64").toString("binary");
        } catch (err) {
            return defaultAvatar;
        }
    };

    getPatientName = (patientData) => {
        if (!patientData) return "Ẩn danh";
        const { firstName, lastName, email } = patientData;
        if (firstName || lastName) return `${lastName || ""} ${firstName || ""}`.trim();
        if (email) return email;
        return "Ẩn danh";
    };

    getEmojiForRating = (rating) => {
        switch (rating) {
            case 1:
                return "😡";
            case 2:
                return "☹️";
            case 3:
                return "😐";
            case 4:
                return "😊";
            case 5:
                return "😁";
            default:
                return "⭐";
        }
    };

    getEmojiForAverage = (avg) => {
        if (avg >= 4.5) return "😁";
        if (avg >= 4.0) return "😊";
        if (avg >= 3.0) return "😐";
        if (avg >= 2.0) return "☹️";
        return "😊";
    };

    render() {
        const { feedbackAndComments, averageRating } = this.state;
        const reviewTime = feedbackAndComments?.length;

        return (
            <div className="feedback-and-comments-container">
                <div className="section-title">
                    <FormattedMessage id="doctor-detail-page-for-patient.rate-and-review.title" />{" "}
                    <span>
                        {reviewTime && <span className="review-time">{reviewTime} đánh giá</span>}
                        {averageRating !== null && (
                            <span className="avg-score">
                                <span className="avg-emoji">{this.getEmojiForAverage(averageRating)}</span>
                                {averageRating !== 0 ? <span>{averageRating.toFixed(1)}/5</span> : ""}
                            </span>
                        )}
                    </span>
                </div>

                {feedbackAndComments.length === 0 ? (
                    <div>
                        <FormattedMessage id="doctor-detail-page-for-patient.rate-and-review.not-have-yet" />
                    </div>
                ) : (
                    feedbackAndComments.map((item, index) => {
                        const avatarSrc = this.getPatientAvatar(item.patientData);
                        return (
                            <div key={index} className="feedback-and-comment-item">
                                <div className="feedback-header">
                                    <div
                                        className="patient-avatar"
                                        style={{
                                            backgroundImage: `url(${avatarSrc})`,
                                        }}
                                    ></div>
                                    <div className="patient-info">
                                        <div className="patient-name">
                                            {this.getPatientName(item.patientData)}{" "}
                                            <span className="appointment-date">
                                                <FontAwesomeIcon icon={faCircleCheck} />
                                                <span> </span>
                                                <FormattedMessage id="doctor-detail-page-for-patient.rate-and-review.examed-day" /> {moment(item.appointmentData?.date).format("DD/MM/YYYY")}
                                            </span>
                                        </div>
                                        {item.patientData?.email && <div className="patient-email">{item.patientData.email}</div>}
                                    </div>
                                    <div className="rating-box">
                                        <span className="rating-emoji">{this.getEmojiForRating(item.rating)}</span>
                                        <span className="rating-score">{item.rating}/5</span>
                                    </div>
                                </div>

                                <p className="patient-comment">{item?.content}</p>

                                {item.images && item.images.length > 0 && (
                                    <div className="patient-uploaded-img">
                                        {item.images.map((img, idx) => (
                                            <img key={idx} src={this.getImageSrc(img)} alt="review-img" onClick={() => this.openLightbox(item.images, idx)} className="clickable-img" />
                                        ))}
                                    </div>
                                )}

                                <hr className="feedback-separator" />
                            </div>
                        );
                    })
                )}
                {this.state.isOpen && (
                    <Lightbox
                        mainSrc={this.state.lightboxImages[this.state.photoIndex]}
                        nextSrc={this.state.lightboxImages[(this.state.photoIndex + 1) % this.state.lightboxImages.length]}
                        prevSrc={this.state.lightboxImages[(this.state.photoIndex + this.state.lightboxImages.length - 1) % this.state.lightboxImages.length]}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                        onMovePrevRequest={() =>
                            this.setState({
                                photoIndex: (this.state.photoIndex + this.state.lightboxImages.length - 1) % this.state.lightboxImages.length,
                            })
                        }
                        onMoveNextRequest={() =>
                            this.setState({
                                photoIndex: (this.state.photoIndex + 1) % this.state.lightboxImages.length,
                            })
                        }
                    />
                )}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    language: state.app.language,
});

export default withRouter(connect(mapStateToProps)(FeedbackAndComment));
