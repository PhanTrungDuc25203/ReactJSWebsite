import React, { Component } from "react";
import { connect } from "react-redux";
import "./ExamPackageTime.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { withRouter } from "react-router";
import * as actions from "../../../store/actions";
import moment from "moment";
import RateAndReviewModal from "./RateAndReview/RateAndReviewExamPackageForm";
import { LANGUAGES, CommonUtils } from "../../../utils";
import { FormattedMessage } from "react-intl";
import queryString from "query-string";
import { getPatientExamPackageTimeService } from "../../../services/userService";
import { Calendar, Hospital, Clock, MapPin, Phone, Mail, Stethoscope, FileText, CreditCard, User, BookMarked } from "lucide-react";

class ExamPackageTime extends Component {
    constructor(props) {
        super(props);
        this.state = {
            examSchedules: [],
            isLoading: true,
            filterMode: "all",
            currentUser: "",
            showResultModal: false,
            selectedSchedule: null,
            isOpenReview: false,
            hasReview: false,
            reviewRating: null,
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

    handleFilterButtonClicked = () => {
        this.setState((prev) => ({
            filterMode: prev.filterMode === "history" ? "all" : "history",
        }));
    };

    getFilteredExamSchedules = () => {
        const { examSchedules, filterMode } = this.state;

        if (filterMode === "history") {
            return examSchedules.filter((item) => item.statusId === "S3" && item.examPackageResult && item.examPackageResult.status === "DONE");
        }

        // "Tất cả" → KHÔNG lọc gì
        return examSchedules;
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
            template = typeof examPackageResult.template === "string" ? JSON.parse(examPackageResult.template) : examPackageResult.template;

            result = examPackageResult.result ? (typeof examPackageResult.result === "string" ? JSON.parse(examPackageResult.result) : examPackageResult.result) : {};
        } catch (e) {
            console.error("Invalid template/result JSON", {
                template: examPackageResult.template,
                result: examPackageResult.result,
            });
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

    openReview = (schedule) => {
        this.setState({
            isOpenReview: true,
            selectedSchedule: schedule,
        });
    };

    closeReview = () => {
        this.setState({
            isOpenReview: false,
            selectedSchedule: null,
        });
    };

    renderScheduleItem = (schedule) => {
        const id = schedule?.id;

        const statusId = schedule?.statusId;
        const resultStatus = schedule?.examPackageResult?.status;
        const filterMode = this.state.filterMode;
        const isExamDone = statusId === "S3";
        const canViewResult = isExamDone && resultStatus === "DONE";
        const isResultPending = isExamDone && resultStatus !== "DONE";

        const STATUS_TEXT = {
            [LANGUAGES.VI]: {
                S1: "Chưa xác nhận",
                S2: "Chờ khám",
                S3: "Đã khám",
            },
            [LANGUAGES.EN]: {
                S1: "Unconfirmed",
                S2: "Waiting for examination",
                S3: "Examined",
            },
        };
        const statusText = STATUS_TEXT[this.props.language]?.[statusId] || "";

        const statusClass = isExamDone ? "completed" : "pending";

        const examPackageImageByBase64 = schedule?.examPackage?.image ? Buffer.from(schedule.examPackage.image, "base64").toString("binary") : "";

        return (
            <div
                key={id}
                className="schedule-item background-image-css"
                style={{
                    backgroundImage: `linear-gradient(to left, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.99),
                            rgba(255, 255, 255, 1), rgb(255, 255, 255, 1)), url(${examPackageImageByBase64})`,
                }}
            >
                <div className="schedule-header">
                    <h3 className="package-name">{schedule?.examPackage?.name}</h3>

                    <span className={`status-badge ${statusClass}`}>{statusText}</span>
                </div>

                <div className="schedule-content">
                    <div className="info-row">
                        <Hospital size={24} className="imported-lucide-icons" />
                        {/* <i className="fas fa-hospital"></i> */}
                        <div className="info-text">
                            <strong>
                                <FormattedMessage id="user-profile.appointment-page.exam-package.medical-facility" />
                            </strong>
                            <span>{schedule?.examPackage?.medicalFacilityPackage?.name}</span>
                            <span className="address">
                                <MapPin size={16} />
                                {schedule?.examPackage?.medicalFacilityPackage?.address}
                            </span>
                        </div>
                        <Stethoscope size={24} className="imported-lucide-icons" />
                        <div className="info-text">
                            <strong>
                                <FormattedMessage id="user-profile.appointment-page.exam-package.specialty" />
                            </strong>
                            <span>{schedule?.examPackage?.examPackageHaveSpecialty?.name}</span>
                        </div>
                    </div>

                    <div className="info-row">
                        <Calendar size={24} className="imported-lucide-icons" />
                        <div className="info-text">
                            <strong>
                                <FormattedMessage id="user-profile.appointment-page.exam-package.date" />
                            </strong>
                            <span className={moment(schedule?.date).isSame(moment(), "day") ? "highlight-today" : ""}>{this.formatDate(schedule?.date)}</span>
                        </div>
                    </div>

                    <div className="info-row">
                        <Clock size={24} className="imported-lucide-icons" />
                        <div className="info-text">
                            <strong>
                                <FormattedMessage id="user-profile.appointment-page.exam-package.timeframe" />
                            </strong>
                            <span>{schedule?.examPackageTimeTypeData?.value_Vie}</span>
                        </div>
                    </div>
                </div>

                <div className="schedule-actions">
                    {canViewResult && (
                        <button className="btn btn-result" onClick={() => this.handleViewResult(schedule)}>
                            <FileText size={16} />
                            <FormattedMessage id="user-profile.appointment-page.exam-package.see-result" />
                        </button>
                    )}

                    {filterMode === "history" && (
                        <button className="review-and-comment-button" onClick={() => this.openReview(schedule)}>
                            <FontAwesomeIcon icon={faCommentDots} />
                            Đánh giá
                        </button>
                    )}

                    {isResultPending && (
                        <div className="result-pending">
                            <i className="fas fa-hourglass-half"></i>
                            <FormattedMessage id="user-profile.appointment-page.exam-package.pending-result" />
                        </div>
                    )}
                </div>
            </div>
        );
    };

    renderExamResult = (schedule) => {
        const sections = this.buildExamResultData(schedule?.examPackageResult);

        if (!sections.length) {
            return (
                <div>
                    <FormattedMessage id="user-profile.appointment-page.exam-package.no-result" />
                </div>
            );
        }

        return (
            <div className="exam-result-container">
                {sections.map((section, sIdx) => (
                    <div key={sIdx} className="exam-section">
                        <h3 className="section-title">{section.title}</h3>

                        <table className="result-table">
                            <thead>
                                <tr>
                                    <th>
                                        <FormattedMessage id="user-profile.appointment-page.exam-package.column-1" />
                                    </th>
                                    <th>
                                        <FormattedMessage id="user-profile.appointment-page.exam-package.column-2" />
                                    </th>
                                    <th>
                                        <FormattedMessage id="user-profile.appointment-page.exam-package.column-3" />
                                    </th>
                                    <th>
                                        <FormattedMessage id="user-profile.appointment-page.exam-package.column-4" />
                                    </th>
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
        const { examSchedules, isLoading, filterMode, isOpenReview } = this.state;
        const isVI = this.props.language === LANGUAGES.VI;
        const TEXT = {
            all: isVI ? "Tất cả" : "All",
            history: isVI ? "Lịch sử" : "History",
        };

        return (
            <div className="exam-package-time-container">
                <div className="schedule-header-section">
                    <div className="exam-package-time-title">
                        <FormattedMessage id="user-profile.appointment-page.exam-package.my-examination" />
                    </div>

                    <a className={filterMode === "history" ? "btn-flip-backward" : "btn-flip"} data-front={filterMode === "history" ? TEXT.history : TEXT.all} data-back={filterMode === "history" ? TEXT.all : TEXT.history} onClick={this.handleFilterButtonClicked} />
                </div>

                {isLoading ? (
                    <div className="loading-container">
                        <i className="fas fa-spinner fa-spin"></i>
                        <span>
                            <FormattedMessage id="user-profile.appointment-page.exam-package.data-fetching" />
                        </span>
                    </div>
                ) : examSchedules.length === 0 ? (
                    <div className="empty-state">
                        <i className="fas fa-calendar-times"></i>
                        <h3>
                            <FormattedMessage id="user-profile.appointment-page.exam-package.no-examination" />
                        </h3>
                        <p>
                            <FormattedMessage id="user-profile.appointment-page.exam-package.no-examination-sub-word" />
                        </p>
                    </div>
                ) : (
                    <div className="schedules-list">{this.getFilteredExamSchedules().map((schedule) => this.renderScheduleItem(schedule))}</div>
                )}
                {this.state.showResultModal && (
                    <div className="exam-result-modal-overlay">
                        <div className="exam-result-modal">
                            <div className="modal-header">
                                <h3>
                                    <FormattedMessage id="user-profile.appointment-page.exam-package.result" />
                                </h3>
                                <button onClick={this.closeModal}>×</button>
                            </div>
                            <div className="modal-body">{this.renderExamResult(this.state.selectedSchedule)}</div>
                        </div>
                    </div>
                )}
                {this.state.isOpenReview && this.state.selectedSchedule && (
                    <RateAndReviewModal
                        isOpen={this.state.isOpenReview}
                        toggleUserModal={this.closeReview}
                        schedule={this.state.selectedSchedule}
                        userEmail={this.state.currentUser?.email}
                        packageId={this.state.selectedSchedule?.examPackage?.id}
                        packageName={this.state.selectedSchedule?.examPackage?.name}
                        paidPackageId={this.state.selectedSchedule?.id}
                        onReviewSaved={(rating) => {
                            this.setState({
                                hasReview: true,
                                reviewRating: rating,
                                isOpenReview: false,
                                selectedSchedule: null,
                            });
                        }}
                    />
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
