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
import { saveAppointmentHistory, saveClinicalReportContentToDatabase, cancelBookedAppointmentAPI } from "../../../services/userService";
import defaultAvatar from "../../../assets/images/default-avatar-circle.png";
import Swal from "sweetalert2";
import { FormattedMessage } from "react-intl";
import { BASE_CLINICAL_REPORT, CLINICAL_RESULT_BY_SPECIALTY } from "../../../utils/clinicalReportTemplates";

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
            isCancelled: false, // Trạng thái đã hủy
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
                    // ✅ Check nếu statusId = S4 (đã hủy)
                    isCancelled: statusId === "S4",
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
            const { appointmentDate, appointmentTimeFrame, isCancelled } = this.state;

            // ✅ Không cho phép xác nhận nếu đã hủy
            if (isCancelled) {
                toast.error("Không thể xác nhận lịch hẹn đã bị hủy!");
                return;
            }

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
            const { appointmentId, meetPatientId, appointmentDate, appointmentTimeFrame, patientInfor, fileContent, paymentStatus, paymentMethod, statusId, isCancelled } = this.state;

            // ✅ Không cho phép thanh toán nếu đã hủy
            if (isCancelled) {
                toast.error("Không thể xác nhận thanh toán cho lịch hẹn đã bị hủy!");
                return;
            }

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

    // ✅ HÀM HỦY LỊCH HẸN MỚI
    handleCancelAppointment = async () => {
        const { appointmentId, patientInfor, isCancelled } = this.state;
        const { language } = this.props;
        const isVI = language === LANGUAGES.VI;

        // Không cho hủy nếu đã hủy rồi
        if (isCancelled) {
            toast.info(isVI ? "Lịch hẹn này đã bị hủy trước đó!" : "This appointment has already been cancelled!");
            return;
        }

        // Hiển thị popup yêu cầu nhập mã ID
        const result = await Swal.fire({
            title: isVI ? "Xác nhận hủy lịch hẹn" : "Confirm Appointment Cancellation",
            html: `
                <p>${isVI ? "Để xác nhận hủy lịch hẹn, vui lòng nhập" : "To confirm cancellation, please enter"} <strong>${isVI ? "Mã ID lịch hẹn" : "Appointment ID"}</strong>:</p>
                <input type="text" id="appointment-id-input" class="swal2-input" placeholder="${isVI ? "Nhập mã ID lịch hẹn" : "Enter appointment ID"}" style="width: 80%; font-size: 16px;">
                <p style="margin-top: 15px; color: #666; font-size: 14px;">${isVI ? "Mã ID lịch hẹn hiện tại" : "Current appointment ID"}: <strong style="color: #d32f2f;">${appointmentId}</strong></p>
            `,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: isVI ? "Xác nhận hủy" : "Confirm Cancel",
            cancelButtonText: isVI ? "Đóng" : "Close",
            confirmButtonColor: "#d32f2f",
            cancelButtonColor: "#6c757d",
            preConfirm: () => {
                const inputValue = document.getElementById("appointment-id-input").value;
                if (!inputValue) {
                    Swal.showValidationMessage(isVI ? "Vui lòng nhập mã ID lịch hẹn!" : "Please enter appointment ID!");
                    return false;
                }
                if (inputValue !== appointmentId.toString()) {
                    Swal.showValidationMessage(isVI ? "Mã ID không đúng! Vui lòng kiểm tra lại." : "Incorrect ID! Please check again.");
                    return false;
                }
                return inputValue;
            },
        });

        // Nếu người dùng nhấn Cancel hoặc đóng popup
        if (!result.isConfirmed) {
            return;
        }

        // Nếu mã ID đúng, tiến hành hủy
        try {
            // 🔹 GỌI API HỦY LỊCH HẸN
            const response = await cancelBookedAppointmentAPI({
                appointmentId: appointmentId,
                patientId: this.state.meetPatientId,
                doctorEmail: this.props.match.params.email,
                patientEmail: patientInfor.email,
                language: language,
            });

            if (response && response.errCode === 0) {
                toast.success(isVI ? "Đã hủy lịch hẹn thành công!" : "Appointment cancelled successfully!");
                this.setState({
                    isCancelled: true,
                    statusId: "S4",
                });

                Swal.fire({
                    title: isVI ? "Đã hủy thành công!" : "Cancelled Successfully!",
                    html: `
            <p>${isVI ? "Lịch hẹn" : "Appointment"} <strong>#${appointmentId}</strong> ${isVI ? "đã bị hủy" : "has been cancelled"}.</p>
            <p>${isVI ? "Email thông báo đã được gửi đến bệnh nhân" : "Notification email has been sent to the patient"}: <strong>${patientInfor.email}</strong></p>
        `,
                    icon: "success",
                    confirmButtonText: "OK",
                });
            } else {
                toast.error(response.errMessage || (isVI ? "Hủy lịch thất bại!" : "Cancel failed!"));
            }

            // 📌 TẠM THỜI DEMO THÀNH CÔNG (bỏ comment phần API ở trên khi đã có backend)
            toast.success(isVI ? "Đã hủy lịch hẹn thành công!" : "Appointment cancelled successfully!");
            this.setState({
                isCancelled: true,
                statusId: "S4",
            });

            // Hiển thị thông báo đã gửi email
            Swal.fire({
                title: isVI ? "Đã hủy thành công!" : "Cancelled Successfully!",
                html: `
                    <p>${isVI ? "Lịch hẹn" : "Appointment"} <strong>#${appointmentId}</strong> ${isVI ? "đã bị hủy" : "has been cancelled"}.</p>
                    <p>${isVI ? "Email thông báo đã được gửi đến bệnh nhân" : "Notification email has been sent to the patient"}: <strong>${patientInfor.email}</strong></p>
                `,
                icon: "success",
                confirmButtonText: "OK",
            });
        } catch (error) {
            console.error("Error cancelling appointment:", error);
            toast.error(isVI ? "Có lỗi xảy ra khi hủy lịch hẹn!" : "An error occurred while cancelling appointment!");
        }
    };

    generatePatientReport = (actionFrom) => {
        const { fileContent, patientInfor, patientBirthday, patientAddress, appointmentDate, appointmentTimeFrame, appointmentId, examReason } = this.state;

        // Nếu đã có sẵn thì dùng lại
        if (fileContent) {
            if (actionFrom !== "anotherFunction") {
                this.setState({ isModalOpen: true });
            }
            return;
        }

        // 🔑 Xác định chuyên khoa bác sĩ
        const doctorSpecialty = this.props?.currentUser?.Doctor_infor?.specialtyId || "GENERAL";

        // Base (I → IV)
        const baseContent = BASE_CLINICAL_REPORT({
            patientInfor,
            patientBirthday,
            patientAddress,
            appointmentDate,
            appointmentTimeFrame,
            appointmentId,
            examReason,
        });

        // Phần V theo chuyên khoa
        const specialtyResult = CLINICAL_RESULT_BY_SPECIALTY[doctorSpecialty]?.() || CLINICAL_RESULT_BY_SPECIALTY.GENERAL();

        const finalReport = baseContent + specialtyResult;

        if (actionFrom === "anotherFunction") {
            this.setState({ fileContent: finalReport });
        } else {
            this.setState({
                fileContent: finalReport,
                isModalOpen: true,
            });
        }
    };

    render() {
        let { scheduleStatus, appointmentId, meetPatientId, patientInfor, appointmentDate, appointmentTimeFrame, patientBirthday, patientAddress, paymentStatus, statusId, isCancelled } = this.state;
        const { language } = this.props;
        let patientImageByBase64 = "";
        const isVI = language === LANGUAGES.VI;
        if (patientInfor && patientInfor.image) {
            patientImageByBase64 = Buffer.from(patientInfor.image, "base64").toString("binary");
        }

        // ✅ Chỉ hiển thị nút hủy khi statusId = S2 (chưa khám)
        const showCancelButton = statusId === "S2" && !isCancelled;

        return (
            <div className={`appointment-item-for-doctor-interface ${isCancelled ? "cancelled-appointment" : ""}`}>
                {/* ✅ NÚT HỦY LỊCH HẸN Ở GÓC PHẢI TRÊN */}
                {showCancelButton && (
                    <button className="cancel-appointment-button" onClick={this.handleCancelAppointment} title={isVI ? "Hủy lịch hẹn" : "Cancel Appointment"}>
                        <i className="fas fa-times-circle"></i>
                    </button>
                )}

                {/* ✅ BADGE HIỂN THỊ ĐÃ HỦY */}
                {isCancelled && (
                    <div className="cancelled-badge">
                        <i className="fas fa-ban"></i> {isVI ? "ĐÃ HỦY" : "CANCELLED"}
                    </div>
                )}

                <div className="patient-avatar-and-appointment-time-container">
                    <div
                        className="patient-avatar-section"
                        style={{
                            backgroundImage: `url(${patientImageByBase64 ? patientImageByBase64 : defaultAvatar})`,
                        }}
                    ></div>
                    <label className="appointment-time-label">
                        <FormattedMessage id="user-profile.appointment-page.doctor.appointment-time" />
                    </label>
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
                        <label className="appointment-item-for-doctor-label">
                            <FormattedMessage id="user-profile.appointment-page.doctor.appointment-id" />
                        </label>
                        <span className="appointment-item-for-doctor-content">{appointmentId && appointmentId}</span>
                    </div>
                    <div className="patient-name">
                        <label className="appointment-item-for-doctor-label">
                            <FormattedMessage id="user-profile.appointment-page.doctor.patient" />
                        </label>
                        <span className="appointment-item-for-doctor-content">
                            {patientInfor && patientInfor.lastName ? patientInfor.lastName : ""}
                            {patientInfor && patientInfor.firstName ? " " + patientInfor.firstName : ""}
                        </span>
                        {". "}
                        <label>ID:</label> {meetPatientId && meetPatientId}
                    </div>
                    <div className="patient-phone-number">
                        <label className="appointment-item-for-doctor-label">
                            <FormattedMessage id="user-profile.appointment-page.doctor.phonenumber" />
                        </label>
                        <span className="appointment-item-for-doctor-content">{patientInfor && patientInfor.phoneNumber && patientInfor.phoneNumber}</span>
                    </div>
                    <div className="patient-email">
                        <label className="appointment-item-for-doctor-label">
                            <FormattedMessage id="user-profile.appointment-page.doctor.email" />
                        </label>
                        <span className="appointment-item-for-doctor-content">{patientInfor && patientInfor.email && patientInfor.email}</span>
                    </div>
                    <div className="patient-birthday">
                        <label className="appointment-item-for-doctor-label">
                            <FormattedMessage id="user-profile.appointment-page.doctor.dob" />
                        </label>
                        <span className="appointment-item-for-doctor-content">{patientBirthday && patientBirthday}</span>
                    </div>
                    <div className="patient-address">
                        <label className="appointment-item-for-doctor-label">
                            <FormattedMessage id="user-profile.appointment-page.doctor.address" />
                        </label>
                        <span className="appointment-item-for-doctor-content">{patientAddress && patientAddress}</span>
                    </div>
                    <div className="file-icon" onClick={this.generatePatientReport}>
                        <label className="appointment-item-for-doctor-label">
                            <FormattedMessage id="user-profile.appointment-page.doctor.medical-report" />
                        </label>
                        <i className="fas fa-file-alt"></i> <FormattedMessage id="user-profile.appointment-page.doctor.edit-report" />
                    </div>

                    <div className="done-button-container-for-doctor">
                        <div className="button-wrapper-1">
                            <button
                                className={`done-button ${this.state.isAppointmentDoneButtonState}`}
                                onClick={this.handleIsAppointmentDoneButtonClick}
                                disabled={this.state.isAppointmentDoneButtonState === "validate" || isCancelled}
                                data-waiting={isVI ? "Chờ khám" : "Waiting"}
                                data-done={isVI ? "Đã khám" : "Completed"}
                            />
                        </div>
                        <div className="button-wrapper-2">
                            <button
                                className={`paid-button ${this.state.isPaymentDoneButtonState}`}
                                onClick={this.handleIsPaymentDoneButtonClick}
                                disabled={this.state.paymentMethod !== "PM3" || isCancelled}
                                data-unpaid={isVI ? "Chưa thanh toán" : "Unpaid"}
                                data-paid={isVI ? "Đã thanh toán" : "Paid"}
                            />
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
