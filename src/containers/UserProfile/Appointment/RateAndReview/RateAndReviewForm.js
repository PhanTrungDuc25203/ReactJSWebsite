import React, { Component } from "react";
import { saveRateAndReviewAboutDoctorOrPackageService, getRateAndReviewAboutDoctorService } from "../../../../services/userService";
import { FormattedMessage } from "react-intl";

class RateAndReviewModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userEmail: props.userEmail || "",
            doctorEmail: props.doctorEmail || "",
            appointmentId: props.appointmentData?.id || "",
            rating: 5,
            content: "",
            images: [],
        };
    }

    async componentDidMount() {
        const appointmentId = this.props.appointmentData?.id;
        if (!appointmentId) return;

        try {
            const res = await getRateAndReviewAboutDoctorService({ appointmentId });

            if (res?.errCode === 0 && res.data) {
                let { userEmail, doctorEmail, appointmentId, rating, content, images } = res.data;

                let parsedImages = [];
                try {
                    if (typeof images === "string") {
                        parsedImages = JSON.parse(images);
                    } else if (Array.isArray(images)) {
                        parsedImages = images;
                    }
                } catch (e) {
                    console.error("Error parsing images:", e);
                    parsedImages = [];
                }

                this.setState({
                    userEmail: userEmail || "",
                    doctorEmail: doctorEmail || "",
                    appointmentId: appointmentId || "",
                    rating: rating || 5,
                    content: content || "",
                    images: parsedImages.map((img) => ({
                        previewUrl: img.image,
                        file: null,
                        name: img.name || "",
                        mimeType: img.mimeType || "image/png",
                    })),
                });
            }
        } catch (error) {
            console.error("Error in componentDidMount:", error);
        }
    }

    handleInputChange = (event, field) => {
        this.setState({ [field]: event.target.value });
    };

    handleRatingChange = (event) => {
        this.setState({ rating: parseInt(event.target.value, 10) });
    };

    handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        this.setState((prevState) => {
            const newImages = [
                ...prevState.images,
                ...files.map((file) => ({
                    previewUrl: URL.createObjectURL(file),
                    file,
                    name: file.name,
                    mimeType: file.type,
                })),
            ].slice(0, 4);

            return { images: newImages };
        });
    };

    handleRemoveImage = (index) => {
        this.setState((prevState) => {
            const newImages = [...prevState.images];
            newImages.splice(index, 1);
            return { images: newImages };
        });
    };

    fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (err) => reject(err);
        });
    };

    handleSubmit = async () => {
        const imageData = await Promise.all(
            this.state.images.map(async (img) => {
                if (img.file) {
                    const base64 = await this.fileToBase64(img.file);
                    return {
                        image: base64,
                        mimeType: img.file.type,
                        name: img.file.name,
                    };
                }
                return {
                    image: img.previewUrl,
                    mimeType: img.mimeType,
                    name: img.name,
                };
            })
        );

        const rateAndReviewData = {
            userEmail: this.state.userEmail,
            doctorEmail: this.state.doctorEmail,
            appointmentId: this.state.appointmentId,
            rating: this.state.rating,
            content: this.state.content,
            images: imageData,
        };

        try {
            let response = await saveRateAndReviewAboutDoctorOrPackageService(rateAndReviewData);
        } catch (error) {}

        this.props.toggleUserModal();
    };

    render() {
        if (!this.props.isOpen) return null;

        // 🔥 FIX: tạo group name riêng cho từng appointment
        const radioGroupName = `feedback-${this.state.appointmentId}`;

        return (
            <div className="custom-modal-overlay">
                <div className="custom-modal">
                    <div className="custom-modal-body">
                        {/* Rating */}
                        <div className="form-group rating">
                            <div className="feedback">
                                <label className="angry">
                                    <input type="radio" value="1" name={radioGroupName} checked={this.state.rating === 1} onChange={this.handleRatingChange} />
                                    <div>
                                        <svg className="eye left">
                                            <use xlinkHref="#eye" />
                                        </svg>
                                        <svg className="eye right">
                                            <use xlinkHref="#eye" />
                                        </svg>
                                        <svg className="mouth">
                                            <use xlinkHref="#mouth" />
                                        </svg>
                                    </div>
                                </label>

                                <label className="sad">
                                    <input type="radio" value="2" name={radioGroupName} checked={this.state.rating === 2} onChange={this.handleRatingChange} />
                                    <div>
                                        <svg className="eye left">
                                            <use xlinkHref="#eye" />
                                        </svg>
                                        <svg className="eye right">
                                            <use xlinkHref="#eye" />
                                        </svg>
                                        <svg className="mouth">
                                            <use xlinkHref="#mouth" />
                                        </svg>
                                    </div>
                                </label>

                                <label className="ok">
                                    <input type="radio" value="3" name={radioGroupName} checked={this.state.rating === 3} onChange={this.handleRatingChange} />
                                    <div></div>
                                </label>

                                <label className="good">
                                    <input type="radio" value="4" name={radioGroupName} checked={this.state.rating === 4} onChange={this.handleRatingChange} />
                                    <div>
                                        <svg className="eye left">
                                            <use xlinkHref="#eye" />
                                        </svg>
                                        <svg className="eye right">
                                            <use xlinkHref="#eye" />
                                        </svg>
                                        <svg className="mouth">
                                            <use xlinkHref="#mouth" />
                                        </svg>
                                    </div>
                                </label>

                                <label className="happy">
                                    <input type="radio" value="5" name={radioGroupName} checked={this.state.rating === 5} onChange={this.handleRatingChange} />
                                    <div>
                                        <svg className="eye left">
                                            <use xlinkHref="#eye" />
                                        </svg>
                                        <svg className="eye right">
                                            <use xlinkHref="#eye" />
                                        </svg>
                                    </div>
                                </label>

                                {/* SVG */}
                                <svg xmlns="http://www.w3.org/2000/svg" style={{ display: "none" }}>
                                    <symbol viewBox="0 0 7 4" id="eye">
                                        <path d="M1,1 C1.8333,2.1667 2.6667,2.75 3.5,2.75 C4.3333,2.75 5.1667,2.1667 6,1"></path>
                                    </symbol>
                                    <symbol viewBox="0 0 18 7" id="mouth">
                                        <path d="M1,5.5 C3.6667,2.5 6.3333,1 9,1 C11.6667,1 14.3333,2.5 17,5.5"></path>
                                    </symbol>
                                </svg>
                            </div>
                        </div>

                        {/* Nội dung */}
                        <div className="form-group review-content">
                            <label>
                                <FormattedMessage id="user-profile.appointment-page.rate-and-review.title" />
                            </label>
                            <textarea rows="4" value={this.state.content} onChange={(e) => this.handleInputChange(e, "content")} />
                        </div>

                        {/* Upload ảnh */}
                        <div className="form-group image-upload">
                            <label>
                                <FormattedMessage id="user-profile.appointment-page.rate-and-review.image" />
                            </label>
                            <div className="image-preview-container">
                                {this.state.images.map((img, index) => (
                                    <div key={index} className="image-preview">
                                        <img src={img.previewUrl} alt={`preview-${index}`} />
                                        <button type="button" className="remove-btn" onClick={() => this.handleRemoveImage(index)}>
                                            &times;
                                        </button>
                                    </div>
                                ))}
                                {this.state.images.length < 4 && (
                                    <label className="image-upload-box">
                                        <input type="file" accept="image/*" multiple onChange={this.handleImageChange} style={{ display: "none" }} />
                                        <i className="fa fa-camera" aria-hidden="true"></i>
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="custom-modal-footer">
                        <button className="submit-btn" onClick={this.handleSubmit}>
                            <FormattedMessage id="user-profile.appointment-page.rate-and-review.send" />
                        </button>
                        <button className="cancel-btn" onClick={this.props.toggleUserModal}>
                            <FormattedMessage id="user-profile.appointment-page.rate-and-review.cancel" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default RateAndReviewModal;
