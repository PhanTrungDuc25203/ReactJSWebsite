import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import './AppointmentItemForDoctorInfterface.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { LANGUAGES, CommonUtils } from '../../../utils';
import _ from 'lodash';
import { withRouter } from 'react-router';
import * as actions from "../../../store/actions";
import { MoonLoader } from 'react-spinners';
import { getAllUsersToDisplayInReact } from '../../../services/userService';
import moment from 'moment';
import Modal from 'react-modal';
import fileDownload from 'js-file-download';
import { saveAs } from 'file-saver'; // để lưu file
import ModalPatientReport from './ModalPatientReport';
import { toast } from 'react-toastify';
import { saveAppointmentHistory } from '../../../services/userService';

class AppointmentItemForDoctorInfterface extends Component {

    constructor(props) {
        super(props);
        this.state = {
            scheduleStatus: '',
            appointmentId: '',
            meetPatientId: '',
            appointmentDate: '',
            appointmentTimeFrame: '',
            patientBirthday: '',
            patientInfor: {},
            buttonState: '',
            isModalOpen: false,
            fileContent: '',
        }
    }

    async componentDidMount() {
        if (this.props && this.props.meetPatientId && this.props.appointmentDate && this.props.appointmentTimeFrame && this.props.appointmentId && this.props.scheduleStatus) {
            let patientInfor = await getAllUsersToDisplayInReact(this.props.meetPatientId);
            if (patientInfor && patientInfor.errCode === 0) {
                this.setState({
                    scheduleStatus: this.props.scheduleStatus,
                    appointmentId: this.props.appointmentId,
                    meetPatientId: this.props.meetPatientId,
                    appointmentDate: this.props.appointmentDate,
                    appointmentTimeFrame: this.props.appointmentTimeFrame,
                    patientBirthday: this.props.patientBirthday,
                    patientInfor: patientInfor.users
                })
            }
        }
        this.generatePatientReport('anotherFunction');
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.meetPatientId !== this.props.meetPatientId &&
            prevProps.appointmentDate !== this.props.appointmentDate &&
            prevProps.appointmentTimeFrame !== this.props.appointmentTimeFrame &&
            prevProps.appointmentId !== this.props.appointmentId &&
            prevProps.scheduleStatus !== this.props.scheduleStatus
        ) {
            let patientInfor = await getAllUsersToDisplayInReact(this.props.meetPatientId);
            if (patientInfor && patientInfor.errCode === 0) {
                this.setState({
                    scheduleStatus: this.props.scheduleStatus,
                    appointmentId: this.props.appointmentId,
                    meetPatientId: this.props.meetPatientId,
                    appointmentDate: this.props.appointmentDate,
                    appointmentTimeFrame: this.props.appointmentTimeFrame,
                    patientBirthday: this.props.patientBirthday,
                    patientInfor: patientInfor.users
                })
            }
        }
    }

    openModal = () => {
        this.setState({ isModalOpen: true });
    }

    closeModal = () => {
        this.setState({ isModalOpen: false });
    }

    handleFileContentChange = (event) => {
        this.setState({ fileContent: event.target.value });
    }

    saveFile = () => {
        const { fileContent } = this.state;
        this.setState({ fileContent });
        fileDownload(fileContent, 'Updated_Patient_Report.txt');
        this.setState({ isModalOpen: false });
    }

    saveFileButNotDownload = () => {
        const { fileContent } = this.state;
        this.setState({ fileContent });
        this.setState({ isModalOpen: false });
    }

    handleConfirmButtonClick = async () => {
        try {
            this.generatePatientReport('anotherFunction');

            const { appointmentId, meetPatientId, appointmentDate, appointmentTimeFrame, patientInfor, fileContent } = this.state;
            const doctorEmail = this.props.match.params.email;
            const patientEmail = patientInfor.email;
            const description = 'S3';

            console.log("check fileContent before convert: ", fileContent);
            const base64File = Buffer.from(fileContent, 'utf-8').toString('base64');
            console.log("check fileContent after convert: ", base64File);

            // Chuẩn bị dữ liệu để gửi tới API
            if (doctorEmail && patientEmail && description && base64File) {
                const historyData = {
                    patientEmail,
                    doctorEmail,
                    description,
                    files: base64File
                };
                // Gọi API lưu lịch sử cuộc hẹn
                let response = await saveAppointmentHistory(historyData);

                if (response && response.errCode === 0) {
                    toast.success(`Xác nhận bệnh nhân ${patientInfor.email} đã khám`);
                } else {
                    toast.error(`Lỗi! Không thể lưu lịch sử khám bệnh này!`);
                }
            } else {
                toast.error(`Lỗi! Thiếu thông tin cần lưu!`);
            }

            // Đổi class cho nút xác nhận lịch khám
            this.setState({
                buttonState: 'onclic'
            });

            setTimeout(() => {
                this.setState({
                    buttonState: '',
                });
                this.setState({
                    buttonState: 'validate',
                });
            }, 2250);
        } catch (error) {
            console.error('Có lỗi xảy ra khi xử lý:', error);
        }
    }

    generatePatientReport = (actionFrom) => {
        const { fileContent, appointmentId, meetPatientId, patientInfor, appointmentDate, appointmentTimeFrame, patientBirthday } = this.state;

        // Tạo nội dung cho file báo cáo
        let reportContent = fileContent ? fileContent : `
            Thông tin bệnh nhân:
                - Mã số cuộc hẹn: ${appointmentId || 'Không có'}
                - Bệnh nhân: ${patientInfor ? (patientInfor.lastName + ' ' + patientInfor.firstName) : 'Không có'}
                - ID Bệnh nhân: ${meetPatientId || 'Không có'}
                - Số điện thoại bệnh nhân: ${patientInfor.phoneNumber || 'Không có'}
                - Email bệnh nhân: ${patientInfor.email || 'Không có'}
                - Ngày sinh: ${patientBirthday || 'Không có'}
                - Ngày hẹn: ${appointmentDate || 'Không có'}
                - Khung giờ hẹn: ${appointmentTimeFrame || 'Không có'}
            Thông tin bác sĩ: (Bác sĩ tự điền thông tin nếu cần thiết)
                - Thanh toán (VND):
                             ( $ ):
                - Khám với bác sĩ:
                - Chuyên khoa Bác sĩ:
                - Địa chỉ Bác sĩ:
            Kết quả khám bênh (đã khám): (Bác sĩ tự điền thông tin nếu cần thiết)
                - Chuẩn đoán: 
                            
                - Phương pháp điều trị:

        `;
        if (actionFrom === 'anotherFunction') {
            this.setState({ fileContent: reportContent });
        } else {
            this.setState({ fileContent: reportContent, isModalOpen: true });
        }

    }

    render() {
        let { scheduleStatus, appointmentId, meetPatientId, patientInfor, appointmentDate, appointmentTimeFrame, patientBirthday } = this.state;

        return (
            <div className="appointment-item-for-doctor-interface">
                <div className="appointment-item-for-doctor-info">
                    <div className="appointment-id">
                        <label>Mã số cuộc hẹn:</label> {' '}
                        {appointmentId && appointmentId}
                    </div>
                    <div className="patient-name">
                        <label>Bệnh nhân: </label>{' '}{patientInfor && patientInfor.lastName ? patientInfor.lastName : ''}
                        {patientInfor && patientInfor.firstName ? ' ' + patientInfor.firstName : ''}
                        {'. '}<label>ID:</label>{' '}
                        {meetPatientId && meetPatientId}
                    </div>
                    <div className="patient-phone-number">
                        <label>Số điện thoại của bệnh nhân: </label>{' '}{patientInfor && patientInfor.phoneNumber && patientInfor.phoneNumber}
                    </div>
                    <div className="patient-email">
                        <label>Địa chỉ email của bệnh nhân: </label>{' '}{patientInfor && patientInfor.email && patientInfor.email}
                    </div>
                    <div className="patient-birthday">
                        <label>Ngày sinh của bệnh nhân: </label>{' '}{patientBirthday && patientBirthday}
                    </div>
                    <div className="patient-date">
                        <label>Ngày hẹn: </label>{' '}{appointmentDate && appointmentDate}
                    </div>
                    <div className="patient-timeframe">
                        <label>Khung giờ hẹn: </label>{' '}{appointmentTimeFrame && appointmentTimeFrame}
                    </div>
                    <div className="file-icon" onClick={this.generatePatientReport}>
                        <i className="fas fa-file-alt"></i> Báo cáo khám bệnh
                    </div>
                </div>
                <div className="done-button-container-for-doctor">
                    <button
                        className={`done-button ${this.state.buttonState}`}
                        onClick={this.handleConfirmButtonClick}
                    >

                    </button>
                </div>

                <ModalPatientReport
                    isOpen={this.state.isModalOpen}
                    onRequestClose={this.closeModal}
                    className={'edit-patient-report-modal'}
                    createNewUser={this.createNewUser}
                    fileContent={this.state.fileContent}
                    handleFileContentChange={this.handleFileContentChange}
                    generatePatientReport={this.generatePatientReport}
                    saveFile={this.saveFile}
                    saveFileButNotDownload={this.saveFileButNotDownload}
                />
            </div >
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
        processLogout: () => dispatch(actions.processLogout()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppointmentItemForDoctorInfterface));
