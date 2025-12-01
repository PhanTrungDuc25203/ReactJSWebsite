import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./AppointmentItemForDoctorInfterface.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { LANGUAGES, CommonUtils } from "../../../utils";
import _ from "lodash";
import { withRouter } from "react-router";
import * as actions from "../../../store/actions";
import { MoonLoader } from "react-spinners";
import { getAllUsersToDisplayInReact } from "../../../services/userService";
import moment from "moment";
import Modal from "react-modal";
import fileDownload from "js-file-download";
import { saveAs } from "file-saver"; // để lưu file
import ModalPatientReport from "./ModalPatientReport";
import { toast } from "react-toastify";
import { saveAppointmentHistory, saveClinicalReportContentToDatabase } from "../../../services/userService";
import defaultAvatar from "../../../assets/images/default-avatar-circle.png";
import Swal from "sweetalert2";

class AppointmentItemForDoctorInfterface extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scheduleStatus: "",
            appointmentId: "",
            meetPatientId: "",
            appointmentDate: "",
            appointmentTimeFrame: "",
            patientBirthday: "",
            patientAddress: "",
            paymentMethod: "",
            paymentStatus: "",
            paidAmount: "",
            patientInfor: {},
            statusId: "",
            isAppointmentDoneButtonState: "",
            isPaymentDoneButtonState: "",
            isModalOpen: false,
            fileContent: "",
            examReason: "",
        };
    }

    async fetchPatientInfo() {
        const { meetPatientId, appointmentDate, appointmentTimeFrame, appointmentId, scheduleStatus, examReason, patientAddress, paymentMethod, paymentStatus, paidAmount, patientBirthday, statusId } = this.props;

        if (meetPatientId && appointmentDate && appointmentTimeFrame && appointmentId && scheduleStatus) {
            let patientInfor = await getAllUsersToDisplayInReact(meetPatientId);
            if (patientInfor && patientInfor.errCode === 0) {
                this.setState({
                    scheduleStatus,
                    appointmentId,
                    meetPatientId,
                    appointmentDate,
                    appointmentTimeFrame,
                    patientAddress,
                    paymentMethod,
                    paymentStatus,
                    paidAmount,
                    patientBirthday,
                    statusId,
                    examReason,
                    patientInfor: patientInfor.users,
                    // ✅ cập nhật lại trạng thái nút theo dữ liệu mới nhất
                    isAppointmentDoneButtonState: statusId === "S3" ? "validate" : "",
                    isPaymentDoneButtonState: paymentStatus === "PT3" ? "validate" : "",
                });
            }
        }
    }

    async componentDidMount() {
        await this.fetchPatientInfo();

        // Nếu props.files có dữ liệu, decode base64 và set vào state
        if (this.props.files && this.props.files.data) {
            const buffer = Buffer.from(this.props.files.data);
            const decodedContent = buffer.toString("utf-8"); // ← giải mã
            this.setState({ fileContent: decodedContent });
        } else {
            this.generatePatientReport("anotherFunction");
        }
    }

    async componentDidUpdate(prevProps) {
        if (
            prevProps.meetPatientId !== this.props.meetPatientId ||
            prevProps.appointmentDate !== this.props.appointmentDate ||
            prevProps.appointmentTimeFrame !== this.props.appointmentTimeFrame ||
            prevProps.appointmentId !== this.props.appointmentId ||
            prevProps.scheduleStatus !== this.props.scheduleStatus ||
            prevProps.examReason !== this.props.examReason ||
            prevProps.files !== this.props.files
        ) {
            await this.fetchPatientInfo();

            // Nếu props.files thay đổi
            if (this.props.files && this.props.files.data) {
                const buffer = Buffer.from(this.props.files.data);
                const decodedContent = buffer.toString("utf-8"); // ← giải mã
                this.setState({ fileContent: decodedContent });
            } else {
                this.generatePatientReport("anotherFunction");
            }
        }
    }

    openModal = () => {
        this.setState({ isModalOpen: true });
    };

    closeModal = () => {
        this.setState({ isModalOpen: false });
    };

    handleFileContentChange = (event) => {
        this.setState({ fileContent: event.target.value });
    };

    saveFile = async () => {
        try {
            const { fileContent, appointmentId } = this.state;

            // 🔹 Mã hóa sang base64 trước khi gửi
            const base64File = Buffer.from(fileContent, "utf-8").toString("base64");

            // 📤 Gửi lên server
            const response = await saveClinicalReportContentToDatabase({ appointmentId, base64File });

            if (response && response.errCode === 0) {
                // ✅ Thành công → tải file xuống
                fileDownload(fileContent, "Updated_Patient_Report.txt");
                toast.success("Đã lưu và tải xuống bệnh án thành công!");
            } else {
                toast.error("Lưu bệnh án thất bại!");
                console.error("API error:", response);
            }

            this.setState({ isModalOpen: false });
        } catch (error) {
            console.error("Lỗi khi lưu file:", error);
            toast.error("Không thể lưu bệnh án!");
        }
    };

    saveFileButNotDownload = async () => {
        try {
            const { fileContent, appointmentId } = this.state;

            // 🔹 Mã hóa sang base64
            const base64File = Buffer.from(fileContent, "utf-8").toString("base64");

            // 📤 Gửi lên server
            const response = await saveClinicalReportContentToDatabase({ appointmentId, base64File });

            if (response && response.errCode === 0) {
                toast.success("Đã lưu bệnh án thành công!");
            } else {
                toast.error("Lưu bệnh án thất bại!");
                console.error("API error:", response);
            }

            this.setState({ isModalOpen: false });
        } catch (error) {
            console.error("Lỗi khi lưu file:", error);
            toast.error("Không thể lưu bệnh án!");
        }
    };

    handleIsAppointmentDoneButtonClick = async () => {
        try {
            const { appointmentDate, appointmentTimeFrame } = this.state;

            const canContinue = await this.checkAppointmentTime(appointmentDate, appointmentTimeFrame);

            if (!canContinue) {
                return; // bác sĩ không đồng ý -> không làm gì
            }

            // --- BẮT ĐẦU CODE XÁC NHẬN NHƯ CŨ ---
            this.generatePatientReport("anotherFunction");

            const { appointmentId, meetPatientId, patientInfor, fileContent, paymentStatus, statusId } = this.state;

            const doctorEmail = this.props.match.params.email;
            const patientEmail = patientInfor.email;
            const description = "S3";

            const base64File = Buffer.from(fileContent, "utf-8").toString("base64");

            if (doctorEmail && patientEmail && description && base64File) {
                const historyData = {
                    appointmentId,
                    patientEmail,
                    doctorEmail,
                    appointmentDate,
                    appointmentTimeFrame,
                    paymentStatus,
                    description,
                    statusId,
                    files: base64File,
                    type: "done-confirm",
                };

                let response = await saveAppointmentHistory(historyData);

                if (response && response.errCode === 0) {
                    toast.success(`Xác nhận bệnh nhân ${patientInfor.email} đã khám`);
                    this.setState({
                        isAppointmentDoneButtonState: "validate",
                        statusId: "S3",
                    });
                } else {
                    toast.error(`Lỗi! Không thể lưu lịch sử khám bệnh này!`);
                }
            } else {
                toast.error(`Lỗi! Thiếu thông tin cần lưu!`);
            }

            this.setState({ isAppointmentDoneButtonState: "onclic" });

            setTimeout(() => {
                this.setState({ isAppointmentDoneButtonState: "" });
                this.setState({ isAppointmentDoneButtonState: "validate" });
            }, 100);
        } catch (error) {
            console.error("Có lỗi xảy ra khi xử lý:", error);
        }
    };

    checkAppointmentTime = async (appointmentDate, appointmentTimeFrame) => {
        // Parse ngày: DD-MM-YYYY
        const [day, month, year] = appointmentDate.split("-").map(Number);
        const startTimeStr = appointmentTimeFrame.split(" - ")[0];
        const [hour, minute] = startTimeStr.split(":").map(Number);

        // Tạo thời gian lịch hẹn (local time, KHÔNG lệch giờ)
        const appointmentStart = new Date(year, month - 1, day, hour, minute, 0);
        const now = new Date();

        // Nếu đã đến giờ → cho qua
        if (now >= appointmentStart) return true;

        // Format thời gian còn lại
        const formatCountdown = (secondsLeft) => {
            let d = Math.floor(secondsLeft / 86400);
            let h = Math.floor((secondsLeft % 86400) / 3600);
            let m = Math.floor((secondsLeft % 3600) / 60);
            let s = Math.floor(secondsLeft % 60);

            if (d > 0) return `${d} ngày ${h} giờ ${m} phút ${s} giây`;
            if (h > 0) return `${h} giờ ${m} phút ${s} giây`;
            if (m > 0) return `${m} phút ${s} giây`;
            return `${s} giây`;
        };

        let diffSeconds = Math.floor((appointmentStart - now) / 1000);

        // Show popup
        const result = await Swal.fire({
            title: "Chưa tới giờ khám",
            html: `
            Ca khám này của bạn sẽ bắt đầu sau:<br>
            <b id="countdown-text">${formatCountdown(diffSeconds)}</b><br><br>
            Bạn có chắc muốn xác nhận đã khám bệnh nhân này ngay bây giờ không?
        `,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Vẫn xác nhận",
            cancelButtonText: "Hủy",
            didOpen: () => {
                const countdownEl = Swal.getPopup().querySelector("#countdown-text");

                const timer = setInterval(() => {
                    diffSeconds--;

                    if (diffSeconds <= 0) {
                        countdownEl.innerHTML = "Đã đến giờ khám!";
                        clearInterval(timer);
                        return;
                    }

                    countdownEl.innerHTML = formatCountdown(diffSeconds);
                }, 1000);

                Swal.getPopup().addEventListener("swal:close", () => {
                    clearInterval(timer);
                });
            },
        });

        // Trả kết quả đúng
        return result.isConfirmed;
    };

    handleIsPaymentDoneButtonClick = async () => {
        try {
            const { appointmentId, meetPatientId, appointmentDate, appointmentTimeFrame, patientInfor, fileContent, paymentStatus, paymentMethod, statusId } = this.state;
            const doctorEmail = this.props.match.params.email;
            const patientEmail = patientInfor.email;
            const description = "S3";

            const base64File = Buffer.from(fileContent, "utf-8").toString("base64");

            if (paymentMethod !== "PM3") {
                toast.warn("Phương thức thanh toán này không thể xác nhận thủ công!");
                return;
            }

            if (paymentStatus === "PT3") {
                toast.info("Cuộc hẹn này đã được thanh toán rồi!");
                return;
            }

            // 👉 bắt đầu loading thật
            this.setState({ isPaymentDoneButtonState: "onclic" });
            if (doctorEmail && patientEmail && description && base64File) {
                const historyData = {
                    appointmentId,
                    patientEmail,
                    doctorEmail,
                    appointmentDate,
                    appointmentTimeFrame,
                    paymentStatus,
                    description,
                    statusId,
                    files: base64File,
                    type: "cash-confirm",
                };
                let response = await saveAppointmentHistory(historyData);
                if (response && response.errCode === 0) {
                    toast.success(`Đã xác nhận thanh toán cho bệnh nhân ${patientInfor.email}`);
                    this.setState({
                        isPaymentDoneButtonState: "validate",
                        paymentStatus: "PT3",
                    });
                } else {
                    toast.error("Lỗi! Không thể cập nhật trạng thái thanh toán!");
                    this.setState({ isPaymentDoneButtonState: "" });
                }
            }
        } catch (error) {
            console.error("Lỗi khi xác nhận thanh toán:", error);
            toast.error("Có lỗi xảy ra!");
            this.setState({ isPaymentDoneButtonState: "" });
        }
    };

    generatePatientReport = (actionFrom) => {
        const { fileContent, appointmentId, meetPatientId, patientInfor, appointmentDate, appointmentTimeFrame, patientBirthday, examReason } = this.state;

        // Nếu fileContent đã có (props.files), dùng luôn
        if (fileContent) {
            if (actionFrom !== "anotherFunction") {
                this.setState({ isModalOpen: true });
            }
            return;
        }

        // Nếu chưa có fileContent, tạo hardcode
        let reportContent = `
            Thông tin bệnh nhân:
                - Mã số cuộc hẹn: ${appointmentId || "Không có"}
                - Bệnh nhân: ${patientInfor ? patientInfor.lastName + " " + patientInfor.firstName : "Không có"}
                - ID Bệnh nhân: ${meetPatientId || "Không có"}
                - Số điện thoại bệnh nhân: ${patientInfor.phoneNumber || "Không có"}
                - Email bệnh nhân: ${patientInfor.email || "Không có"}
                - Ngày sinh: ${patientBirthday || "Không có"}
                - Lý do khám bệnh: ${examReason || ""}
                - Ngày hẹn: ${appointmentDate || "Không có"}
                - Khung giờ hẹn: ${appointmentTimeFrame || "Không có"}
            Thông tin bác sĩ: (Bác sĩ tự điền thông tin nếu cần thiết)
                - Thanh toán (VND):
                - Khám với bác sĩ:
                - Chuyên khoa Bác sĩ:
                - Địa chỉ Bác sĩ:
            Kết quả khám bệnh (đã khám): (Bác sĩ tự điền thông tin nếu cần thiết)
                - Chuẩn đoán:
                - Phương pháp điều trị:
            `;

        if (actionFrom === "anotherFunction") {
            this.setState({ fileContent: reportContent });
        } else {
            this.setState({ fileContent: reportContent, isModalOpen: true });
        }
    };

    render() {
        let { scheduleStatus, appointmentId, meetPatientId, patientInfor, appointmentDate, appointmentTimeFrame, patientBirthday, patientAddress, paymentStatus, statusId } = this.state;
        let patientImageByBase64 = "";
        if (patientInfor && patientInfor.image) {
            patientImageByBase64 = Buffer.from(patientInfor.image, "base64").toString("binary");
        }

        return (
            <div className="appointment-item-for-doctor-interface">
                <div className="patient-avatar-and-appointment-time-container">
                    <div
                        className="patient-avatar-section"
                        style={{
                            backgroundImage: `url(${patientImageByBase64 ? patientImageByBase64 : defaultAvatar})`,
                        }}
                    ></div>
                    <label className="appointment-time-label">Thời gian hẹn: </label>
                    <div className="patient-date">
                        <FontAwesomeIcon icon={faCalendarDays} className="appointment-time-icon" />
                        <span className="appointment-item-for-doctor-content">{appointmentDate && appointmentDate}</span>
                    </div>
                    <div className="patient-timeframe">
                        <FontAwesomeIcon icon={faClock} className="appointment-time-icon" />
                        <span className="appointment-item-for-doctor-content">{appointmentTimeFrame && appointmentTimeFrame}</span>
                    </div>
                </div>
                <div className="appointment-item-for-doctor-info">
                    <div className="appointment-id">
                        <label className="appointment-item-for-doctor-label">Mã số cuộc hẹn:</label>
                        <span className="appointment-item-for-doctor-content">{appointmentId && appointmentId}</span>
                    </div>
                    <div className="patient-name">
                        <label className="appointment-item-for-doctor-label">Bệnh nhân: </label>
                        <span className="appointment-item-for-doctor-content">
                            {patientInfor && patientInfor.lastName ? patientInfor.lastName : ""}
                            {patientInfor && patientInfor.firstName ? " " + patientInfor.firstName : ""}
                        </span>
                        {". "}
                        <label>ID:</label> {meetPatientId && meetPatientId}
                    </div>
                    <div className="patient-phone-number">
                        <label className="appointment-item-for-doctor-label">Số điện thoại: </label>
                        <span className="appointment-item-for-doctor-content">{patientInfor && patientInfor.phoneNumber && patientInfor.phoneNumber}</span>
                    </div>
                    <div className="patient-email">
                        <label className="appointment-item-for-doctor-label">Địa chỉ email: </label>
                        <span className="appointment-item-for-doctor-content">{patientInfor && patientInfor.email && patientInfor.email}</span>
                    </div>
                    <div className="patient-birthday">
                        <label className="appointment-item-for-doctor-label">Ngày sinh: </label>
                        <span className="appointment-item-for-doctor-content">{patientBirthday && patientBirthday}</span>
                    </div>
                    <div className="patient-address">
                        <label className="appointment-item-for-doctor-label">Địa chỉ: </label>
                        <span className="appointment-item-for-doctor-content">{patientAddress && patientAddress}</span>
                    </div>
                    <div className="file-icon" onClick={this.generatePatientReport}>
                        <label className="appointment-item-for-doctor-label">Bệnh án: </label>
                        <i className="fas fa-file-alt"></i> Chỉnh sửa bệnh án
                    </div>

                    <div className="done-button-container-for-doctor">
                        <div className="button-wrapper-1">
                            <button className={`done-button ${this.state.isAppointmentDoneButtonState}`} onClick={this.handleIsAppointmentDoneButtonClick}>
                                {/* <FontAwesomeIcon icon={faClipboardList} /> */}
                            </button>
                        </div>
                        <div className="button-wrapper-2">
                            <button className={`paid-button ${this.state.isPaymentDoneButtonState}`} onClick={this.handleIsPaymentDoneButtonClick} disabled={this.state.paymentMethod !== "PM3"}>
                                {/* <FontAwesomeIcon icon={faCircleExclamation} /> */}
                            </button>
                        </div>
                    </div>
                </div>

                <ModalPatientReport
                    isOpen={this.state.isModalOpen}
                    onRequestClose={this.closeModal}
                    className={"edit-patient-report-modal"}
                    createNewUser={this.createNewUser}
                    fileContent={this.state.fileContent}
                    handleFileContentChange={this.handleFileContentChange}
                    generatePatientReport={this.generatePatientReport}
                    saveFile={this.saveFile}
                    saveFileButNotDownload={this.saveFileButNotDownload}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        // systemMenuPath: state.app.systemMenuPath,
        // isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppointmentItemForDoctorInfterface));
