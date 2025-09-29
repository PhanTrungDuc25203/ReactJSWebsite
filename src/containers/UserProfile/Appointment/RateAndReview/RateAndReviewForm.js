import React, { Component } from "react";

class RateAndReviewModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: props.currentUserId || "",
            doctorId: props.appointmentData?.doctorId || "",
            packageId: props.appointmentData?.packageId || "",
            appointmentId: props.appointmentData?.appointmentId || "",
            rating: 5,
            content: "",
            images: [], // chỉ dùng mảng images, không tách image/mimeType nữa
        };
    }

    handleInputChange = (event, field) => {
        this.setState({ [field]: event.target.value });
    };

    handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        this.setState((prevState) => ({
            images: [...prevState.images, ...files],
        }));
    };

    handleRemoveImage = (index) => {
        this.setState((prevState) => {
            const newImages = [...prevState.images];
            newImages.splice(index, 1);
            return { images: newImages };
        });
    };

    handleSubmit = () => {
        console.log("Review data:", this.state);
        // TODO: Gọi API lưu review
        this.props.toggleUserModal();
    };

    render() {
        if (!this.props.isOpen) return null; // nếu modal đóng thì không render

        return (
            <div className="custom-modal-overlay">
                <div className="custom-modal">
                    <div className="custom-modal-body">
                        {/* Rating */}
                        <div className="form-group rating">
                            <div className="feedback">
                                <label className="angry">
                                    <input type="radio" value="1" name="feedback" />
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
                                    <input type="radio" value="2" name="feedback" />
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
                                    <input type="radio" value="3" name="feedback" />
                                    <div></div>
                                </label>
                                <label className="good">
                                    <input type="radio" value="4" name="feedback" defaultChecked />
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
                                    <input type="radio" value="5" name="feedback" />
                                    <div>
                                        <svg className="eye left">
                                            <use xlinkHref="#eye" />
                                        </svg>
                                        <svg className="eye right">
                                            <use xlinkHref="#eye" />
                                        </svg>
                                    </div>
                                </label>

                                {/* SVG symbol definitions */}
                                <svg xmlns="http://www.w3.org/2000/svg" style={{ display: "none" }}>
                                    <symbol viewBox="0 0 7 4" id="eye">
                                        <path d="M1,1 C1.83333333,2.16666667 2.66666667,2.75 3.5,2.75 C4.33333333,2.75 5.16666667,2.16666667 6,1"></path>
                                    </symbol>
                                    <symbol viewBox="0 0 18 7" id="mouth">
                                        <path d="M1,5.5 C3.66666667,2.5 6.33333333,1 9,1 C11.6666667,1 14.3333333,2.5 17,5.5"></path>
                                    </symbol>
                                </svg>
                            </div>
                        </div>

                        {/* Nội dung */}
                        <div className="form-group review-content">
                            <label>Nhận xét của bạn về dịch vụ thăm khám</label>
                            <textarea rows="4" value={this.state.content} onChange={(e) => this.handleInputChange(e, "content")} />
                        </div>

                        {/* Upload ảnh */}
                        <div className="form-group image-upload">
                            <label>Hình ảnh (tùy chọn, tối đa 3 ảnh)</label>
                            <div className="image-preview-container">
                                {/* Ô add hình ảnh */}

                                {/* Hiển thị preview các hình ảnh */}
                                {this.state.images.map((img, index) => (
                                    <div key={index} className="image-preview">
                                        <img src={URL.createObjectURL(img)} alt={`preview-${index}`} />
                                        <button type="button" className="remove-btn" onClick={() => this.handleRemoveImage(index)}>
                                            &times;
                                        </button>
                                    </div>
                                ))}
                                <label className="image-upload-box">
                                    <input type="file" accept="image/*" multiple onChange={this.handleImageChange} style={{ display: "none" }} />
                                    <i className="fa fa-camera" aria-hidden="true"></i>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="custom-modal-footer">
                        <button className="submit-btn" onClick={this.handleSubmit}>
                            Gửi nhận xét
                        </button>
                        <button className="cancel-btn" onClick={this.props.toggleUserModal}>
                            Hủy
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default RateAndReviewModal;
