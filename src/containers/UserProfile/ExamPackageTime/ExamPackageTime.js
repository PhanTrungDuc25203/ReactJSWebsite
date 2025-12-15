import React, { Component } from "react";
import { connect } from "react-redux";
import "./ExamPackageTime.scss";
import { withRouter } from "react-router";
import * as actions from "../../../store/actions";
import moment from "moment";
import queryString from "query-string";
import { getPatientExamPackageTimeService } from "../../../services/userService";

class ExamPackageTime extends Component {
    constructor(props) {
        super(props);
        this.state = {
            examSchedules: [],
            isLoading: true,
            historyOrHandling: "handling",
            currentUser: "",
            showResultModal: false,
            selectedSchedule: null,
        };
    }

    async componentDidMount() {
        const { currentUser } = this.props;
        console.log("check patient: ", this.props.currentUser);

        if (currentUser) {
            this.setState({ currentUser });
            await this.fetchExamSchedules(currentUser.id);
        }
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.currentUser !== this.props.currentUser) {
            const { currentUser } = this.props;
            if (currentUser) {
                this.setState({ currentUser });
                await this.fetchExamSchedules(currentUser.id);
            }
        }
        if (prevProps.activeTab !== this.props.activeTab) {
            this.fetchExamSchedules();
        }
    }

    fetchExamSchedules = async (patientId) => {
        try {
            this.setState({ isLoading: true });

            let response = await getPatientExamPackageTimeService(patientId);
            if (response && response.errCode === 0) {
                this.setState({
                    examSchedules: response.bookingData,
                    isLoading: false,
                });
            }
        } catch (error) {
            console.error("Error fetching exam schedules:", error);
            this.setState({ isLoading: false });
        }
    };

    handleViewResult = (schedule) => {
        this.setState({
            selectedSchedule: schedule,
            showResultModal: true,
        });
    };

    closeModal = () => {
        this.setState({
            showResultModal: false,
            selectedSchedule: null,
        });
    };

    formatDate = (dateString) => {
        return moment(dateString).format("DD/MM/YYYY");
    };

    evaluateResultStatus = (value, normalRange) => {
        if (value === null || !normalRange) return "unknown";

        const numericValue = parseFloat(value);
        if (isNaN(numericValue)) return "unknown";

        // Dạng: < 5.2
        const lessThanMatch = normalRange.match(/<\s*([\d.]+)/);
        if (lessThanMatch) {
            const max = parseFloat(lessThanMatch[1]);
            return numericValue <= max ? "normal" : "high";
        }

        // Dạng: > 40
        const greaterThanMatch = normalRange.match(/>\s*([\d.]+)/);
        if (greaterThanMatch) {
            const min = parseFloat(greaterThanMatch[1]);
            return numericValue >= min ? "normal" : "low";
        }

        // Dạng: 4.0 - 11.0 hoặc 150 – 450
        const rangeMatch = normalRange.match(/([\d.]+)\s*[-–]\s*([\d.]+)/);
        if (rangeMatch) {
            const min = parseFloat(rangeMatch[1]);
            const max = parseFloat(rangeMatch[2]);

            if (numericValue < min) return "low";
            if (numericValue > max) return "high";
            return "normal";
        }

        // Không phân tích được
        return "unknown";
    };

    buildExamResultData = (examPackageResult) => {
        if (!examPackageResult?.template) return [];

        let template = {};
        let result = {};

        try {
            template = JSON.parse(examPackageResult.template);
            result = examPackageResult.result ? JSON.parse(examPackageResult.result) : {};
        } catch (e) {
            console.error("Invalid template/result JSON", e);
            return [];
        }

        return template.sections.map((section, sectionIndex) => ({
            title: section.title,
            fields: section.fields.map((field, fieldIndex) => {
                const key = `${sectionIndex}-${fieldIndex}`;

                return {
                    ...field,
                    value: result[key] ?? null,
                };
            }),
        }));
    };

    renderScheduleItem = (schedule) => {
        const id = schedule?.id;

        const statusId = schedule?.statusId;
        const resultStatus = schedule?.examPackageResult?.status;

        const isExamDone = statusId === "S3";
        const canViewResult = isExamDone && resultStatus === "DONE";
        const isResultPending = isExamDone && resultStatus !== "DONE";

        const statusText = statusId === "S1" ? "Chưa xác nhận" : statusId === "S2" ? "Chờ khám" : "Đã khám";

        const statusClass = isExamDone ? "completed" : "pending";

        return (
            <div key={id} className="schedule-item">
                <div className="schedule-header">
                    <h3 className="package-name">{schedule?.examPackage?.name}</h3>

                    <span className={`status-badge ${statusClass}`}>{statusText}</span>
                </div>

                <div className="schedule-content">
                    <div className="info-row">
                        <i className="fas fa-hospital"></i>
                        <div className="info-text">
                            <strong>Cơ sở y tế</strong>
                            <span>{schedule?.examPackage?.medicalFacilityPackage?.name}</span>
                            <span className="address">{schedule?.examPackage?.medicalFacilityPackage?.address}</span>
                        </div>
                    </div>

                    <div className="info-row">
                        <i className="fas fa-calendar-alt"></i>
                        <div className="info-text">
                            <strong>Ngày khám</strong>
                            <span className={moment(schedule?.date).isSame(moment(), "day") ? "highlight-today" : ""}>{this.formatDate(schedule?.date)}</span>
                        </div>
                    </div>

                    <div className="info-row">
                        <i className="fas fa-clock"></i>
                        <div className="info-text">
                            <strong>Khung giờ</strong>
                            <span>{schedule?.examPackageTimeTypeData?.value_Vie}</span>
                        </div>
                    </div>
                </div>

                <div className="schedule-actions">
                    {canViewResult && (
                        <button className="btn btn-result" onClick={() => this.handleViewResult(schedule)}>
                            <i className="fas fa-file-medical"></i>
                            Xem kết quả
                        </button>
                    )}

                    {isResultPending && (
                        <div className="result-pending">
                            <i className="fas fa-hourglass-half"></i>
                            Kết quả đang được xử lý
                        </div>
                    )}
                </div>
            </div>
        );
    };

    renderExamResult = (schedule) => {
        const sections = this.buildExamResultData(schedule?.examPackageResult);

        if (!sections.length) {
            return <div>Không có dữ liệu kết quả</div>;
        }

        return (
            <div className="exam-result-container">
                {sections.map((section, sIdx) => (
                    <div key={sIdx} className="exam-section">
                        <h3 className="section-title">{section.title}</h3>

                        <table className="result-table">
                            <thead>
                                <tr>
                                    <th>Chỉ số</th>
                                    <th>Kết quả</th>
                                    <th>Đơn vị</th>
                                    <th>Giá trị bình thường</th>
                                </tr>
                            </thead>
                            <tbody>
                                {section.fields.map((field, fIdx) => {
                                    const status = this.evaluateResultStatus(field.value, field.normal_range);

                                    return (
                                        <tr key={fIdx} className={`result-row ${status}`}>
                                            <td>{field.label}</td>
                                            <td>{field.value !== null ? field.value : "--"}</td>
                                            <td>{field.unit}</td>
                                            <td>{field.normal_range}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        );
    };

    render() {
        const { examSchedules, isLoading } = this.state;
        const { historyOrHandling } = this.state;

        return (
            <div className="exam-package-time-container">
                <div className="schedule-header-section">
                    <div className="exam-package-time-title">Lịch khám của tôi</div>
                </div>

                {isLoading ? (
                    <div className="loading-container">
                        <i className="fas fa-spinner fa-spin"></i>
                        <span>Đang tải dữ liệu...</span>
                    </div>
                ) : examSchedules.length === 0 ? (
                    <div className="empty-state">
                        <i className="fas fa-calendar-times"></i>
                        <h3>Chưa có lịch khám nào</h3>
                        <p>Bạn chưa đặt lịch khám hoặc mua gói khám nào</p>
                    </div>
                ) : (
                    <div className="schedules-list">{examSchedules.map((schedule) => this.renderScheduleItem(schedule))}</div>
                )}
                {this.state.showResultModal && (
                    <div className="exam-result-modal-overlay">
                        <div className="exam-result-modal">
                            <div className="modal-header">
                                <h3>Kết quả khám bệnh</h3>
                                <button onClick={this.closeModal}>×</button>
                            </div>
                            <div className="modal-body">{this.renderExamResult(this.state.selectedSchedule)}</div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    language: state.app.language,
});

const mapDispatchToProps = (dispatch) => ({
    processLogout: () => dispatch(actions.processLogout()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ExamPackageTime));
