import React, { Component } from "react";
import { Calendar, Clock, MapPin, Bell, CalendarArrowDown, CalendarX, User, Activity, TrendingUp, AlertCircle, CheckCircle, CalendarCheck } from "lucide-react";
import "./Dashboard.scss";
import moment from "moment";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { getPatientAppointmentsOverviewStatisticsService, getPatientAppointmentsNearestService, getPatientAppointmentsMonthlyVisitsService, getPatientFrequentVisitsMedicalFacilitiesAndDoctorsService } from "../../services/userService";
import * as actions from "../../store/actions";
import { LANGUAGES } from "../../utils";
import { switchLanguageOfWebsite } from "../../store/actions";
import { FormattedMessage, injectIntl } from "react-intl";

class DashboardForPatient extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeHealthTab: "bmi",

            // BMI
            weight: "",
            height: "",
            bmiResult: null,

            // WHR
            waist: "",
            hip: "",
            gender: "male",
            whrResult: null,

            // Data mock
            nearestUpcomingAppointments: [],

            stats: {
                totalAppointments: "",
                upcomingAppointments: "",
                completedAppointments: "",
                cancelledAppointments: "",
            },

            monthlyStats: [],

            frequentlyVisitDoctorStats: [],

            frequentlyVisitFacilityStats: [],
        };
    }

    async componentDidMount() {
        if (this.props?.userInfo?.id) {
            try {
                let overviewStatisticResponse = await getPatientAppointmentsOverviewStatisticsService(this.props.userInfo.id);
                let nearestApointmentsResponse = await getPatientAppointmentsNearestService(this.props.userInfo.id);
                let monthlyVisitsResponse = await getPatientAppointmentsMonthlyVisitsService(this.props.userInfo.id);
                let frequentlyVisitsResponse = await getPatientFrequentVisitsMedicalFacilitiesAndDoctorsService(this.props.userInfo.id);
                if (overviewStatisticResponse && overviewStatisticResponse.errCode === 0) {
                    this.setState({
                        stats: {
                            totalAppointments: overviewStatisticResponse.data.totalAppointments,
                            upcomingAppointments: overviewStatisticResponse.data.upcomingAppointments,
                            completedAppointments: overviewStatisticResponse.data.completedAppointments,
                            cancelledAppointments: overviewStatisticResponse.data.cancelledAppointments,
                        },
                    });
                }

                if (nearestApointmentsResponse && nearestApointmentsResponse.errCode === 0) {
                    this.setState({
                        nearestUpcomingAppointments: nearestApointmentsResponse.data,
                    });
                }

                if (monthlyVisitsResponse && monthlyVisitsResponse.errCode === 0) {
                    this.setState({
                        monthlyStats: monthlyVisitsResponse.data.monthlyStats,
                    });
                }

                if (frequentlyVisitsResponse && frequentlyVisitsResponse.errCode === 0) {
                    this.setState({
                        frequentlyVisitDoctorStats: frequentlyVisitsResponse.topDoctors,
                        frequentlyVisitFacilityStats: frequentlyVisitsResponse.topMedicalFacilities,
                    });
                }
            } catch (error) {
                console.error("Error getting patient appointments overview statistic:", error);
            }
        }
    }

    // ------------------------------
    //        BMI CALCULATION
    // ------------------------------
    calculateBMI = () => {
        const { weight, height } = this.state;
        const { language } = this.props;
        if (!weight || !height) return;

        const heightInMeters = parseFloat(height) / 100;
        const bmi = (parseFloat(weight) / (heightInMeters * heightInMeters)).toFixed(1);

        let category = "";
        let advice = "";
        let color = "";

        if (bmi < 18.5) {
            category = language === LANGUAGES.VI ? "Thiếu cân" : "Underweight";
            advice = language === LANGUAGES.VI ? "Bạn nên tăng cường dinh dưỡng và tập luyện để đạt cân nặng lý tưởng." : "You should improve your nutrition and exercise regularly.";
            color = "#3b82f6";
        } else if (bmi >= 18.5 && bmi < 23) {
            category = language === LANGUAGES.VI ? "Bình thường" : "Normal";
            advice = language === LANGUAGES.VI ? "Cân nặng lý tưởng. Hãy duy trì chế độ ăn uống lành mạnh." : "Your weight is ideal. Maintain a healthy lifestyle.";
            color = "#10b981";
        } else if (bmi >= 23 && bmi < 25) {
            category = language === LANGUAGES.VI ? "Thừa cân" : "Overweight";
            advice = language === LANGUAGES.VI ? "Nên điều chỉnh chế độ ăn và tăng cường vận động." : "Adjust your diet and increase physical activity.";
            color = "#f59e0b";
        } else if (bmi >= 25 && bmi < 30) {
            category = language === LANGUAGES.VI ? "Béo phì độ I" : "Obesity Class I";
            advice = language === LANGUAGES.VI ? "Cần lập kế hoạch giảm cân an toàn." : "You should plan a safe weight loss program.";
            color = "#f97316";
        } else {
            category = language === LANGUAGES.VI ? "Béo phì độ II" : "Obesity Class II";
            advice = language === LANGUAGES.VI ? "Cần gặp bác sĩ chuyên khoa để được tư vấn." : "Consult a specialist doctor for proper guidance.";
            color = "#ef4444";
        }

        this.setState({
            bmiResult: { value: bmi, category, advice, color },
        });
    };

    // ------------------------------
    //        WHR CALCULATION
    // ------------------------------
    calculateWHR = () => {
        const { waist, hip, gender } = this.state;
        const { language } = this.props;

        if (!waist || !hip) return;

        const whr = (parseFloat(waist) / parseFloat(hip)).toFixed(2);

        let risk = "";
        let advice = "";
        let color = "";

        if (gender === "male") {
            if (whr < 0.9) {
                risk = language === LANGUAGES.VI ? "Thấp" : "Low";
                advice = language === LANGUAGES.VI ? "Chỉ số tốt, hãy duy trì." : "Good indicator, keep maintaining your current lifestyle.";
                color = "#10b981";
            } else if (whr < 1.0) {
                risk = language === LANGUAGES.VI ? "Trung bình" : "Moderate";
                advice = language === LANGUAGES.VI ? "Nên tập luyện và điều chỉnh dinh dưỡng." : "You should exercise more and adjust your diet.";
                color = "#f59e0b";
            } else {
                risk = language === LANGUAGES.VI ? "Cao" : "High";
                advice = language === LANGUAGES.VI ? "Nguy cơ cao, nên gặp bác sĩ." : "High risk, you should consult a doctor.";
                color = "#ef4444";
            }
        } else {
            if (whr < 0.8) {
                risk = language === LANGUAGES.VI ? "Thấp" : "Low";
                advice = language === LANGUAGES.VI ? "Chỉ số tốt, tiếp tục duy trì." : "Good indicator, keep maintaining it.";
                color = "#10b981";
            } else if (whr < 0.85) {
                risk = language === LANGUAGES.VI ? "Trung bình" : "Moderate";
                advice = language === LANGUAGES.VI ? "Cần điều chỉnh chế độ ăn và tập luyện." : "You should adjust your diet and exercise regularly.";
                color = "#f59e0b";
            } else {
                risk = language === LANGUAGES.VI ? "Cao" : "High";
                advice = language === LANGUAGES.VI ? "Nguy cơ cao, nên tham vấn bác sĩ." : "High risk, consider consulting a doctor.";
                color = "#ef4444";
            }
        }

        this.setState({
            whrResult: { value: whr, risk, advice, color },
        });
    };

    getInitials = (firstName, lastName) => {
        if (!firstName && !lastName) return "";
        const first = firstName ? firstName.charAt(0).toUpperCase() : "";
        const last = lastName ? lastName.charAt(0).toUpperCase() : "";
        return first + last;
    };

    render() {
        const { activeHealthTab, weight, height, bmiResult, waist, hip, gender, whrResult, nearestUpcomingAppointments, stats, monthlyStats, frequentlyVisitDoctorStats, frequentlyVisitFacilityStats } = this.state;

        return (
            <div className="dashboard-container">
                {/* Header */}
                <div className="dashboard-header">
                    <div className="header-left">
                        <h1>
                            <FormattedMessage id="dashboard.header.patient-greeting" />
                        </h1>
                        <p>
                            <FormattedMessage id="dashboard.header.patient-sub-title" />
                        </p>
                    </div>
                    <div className="header-right">
                        <button className="notification-btn">
                            <Bell size={20} color="#64748b" />
                            <span className="notification-badge">2</span>
                        </button>
                        <div className="user-info">
                            <div className="user-avatar"> {this.getInitials(this.props?.userInfo?.firstName, this.props?.userInfo?.lastName)}</div>
                            <div className="user-details">
                                <h3>
                                    {this.props?.userInfo?.firstName} {this.props?.userInfo?.lastName}
                                </h3>
                                <p>
                                    <FormattedMessage id="dashboard.header.patient-role" />
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="left-content">
                            <h4>
                                <FormattedMessage id="dashboard.stat.total" />
                            </h4>
                            <div className="value">{stats?.totalAppointments}</div>
                        </div>
                        <div className="right-content">
                            <Calendar size={30} className="normal" />
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="left-content">
                            <h4>
                                <FormattedMessage id="dashboard.stat.pending" />
                            </h4>
                            <div className="value">{stats?.upcomingAppointments}</div>
                        </div>
                        <div className="right-content">
                            <CalendarArrowDown size={30} className="pending" />
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="left-content">
                            <h4>
                                <FormattedMessage id="dashboard.stat.done" />
                            </h4>
                            <div className="value">{stats?.completedAppointments}</div>
                        </div>
                        <div className="right-content">
                            <CalendarCheck size={30} className="done" />
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="left-content">
                            <h4>
                                <FormattedMessage id="dashboard.stat.cancel" />
                            </h4>
                            <div className="value">{stats?.cancelledAppointments}</div>
                        </div>
                        <div className="right-content">
                            <CalendarX size={30} className="cancel" />
                        </div>
                    </div>
                </div>

                {/* Main */}
                <div className="content-grid">
                    {/* Appointments */}
                    <div className="appointments-section">
                        <div className="section-header">
                            <Calendar className="section-icon" size={24} />
                            <h2>
                                <FormattedMessage id="dashboard.nearest-appointments" />
                            </h2>
                        </div>

                        <div className="appointments-list">
                            {nearestUpcomingAppointments.map((appointment) => (
                                <div key={appointment.id} className="appointment-card">
                                    <div className="appointment-header">
                                        <div className="doctor-avatar">
                                            <FormattedMessage id="dashboard.doctor" />
                                        </div>
                                        <div className="appointment-info">
                                            <h3>
                                                {appointment?.doctorHasAppointmentWithPatients?.lastName} {appointment?.doctorHasAppointmentWithPatients?.firstName}
                                            </h3>
                                            <div className="specialty">{appointment?.doctorHasAppointmentWithPatients?.Doctor_specialty_medicalFacility?.Specialty?.name}</div>
                                        </div>
                                    </div>
                                    <div className="appointment-details">
                                        <div className="detail-row">
                                            <Calendar size={16} className="detail-icon" />
                                            <span>{moment(appointment?.date).format("DD-MM-YYYY")}</span>

                                            <Clock size={16} className="detail-icon" style={{ marginLeft: "1rem" }} />
                                            <span>{appointment?.appointmentTimeTypeData?.value_Vie}</span>
                                        </div>

                                        <div className="detail-row">
                                            <MapPin size={16} className="detail-icon" />
                                            <span>{appointment?.doctorHasAppointmentWithPatients?.Doctor_specialty_medicalFacility?.medicalFacilityDoctorAndSpecialty?.name}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Health calculator */}
                    <div className="health-calculator">
                        <div className="section-header">
                            <Activity className="section-icon" size={24} />
                            <h2>
                                <FormattedMessage id="dashboard.evaluate-health" />
                            </h2>
                        </div>

                        <div className="health-tabs">
                            <button className={`tab-btn ${activeHealthTab === "bmi" ? "active" : ""}`} onClick={() => this.setState({ activeHealthTab: "bmi" })}>
                                <FormattedMessage id="dashboard.bmi" />
                            </button>
                            <button className={`tab-btn ${activeHealthTab === "whr" ? "active" : ""}`} onClick={() => this.setState({ activeHealthTab: "whr" })}>
                                <FormattedMessage id="dashboard.waist/hip" />
                            </button>
                        </div>

                        {/* BMI */}
                        {activeHealthTab === "bmi" && (
                            <div className="calculator-content">
                                <div className="form-group">
                                    <label>
                                        <FormattedMessage id="dashboard.form.weight" />
                                    </label>
                                    <div className="input-suffix">
                                        <FormattedMessage id="dashboard.form.weight-placeholder">{(text) => <input type="number" placeholder={text} value={weight} onChange={(e) => this.setState({ weight: e.target.value })} />}</FormattedMessage>
                                        <span className="suffix">kg</span>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>
                                        <FormattedMessage id="dashboard.form.height" />
                                    </label>
                                    <div className="input-suffix">
                                        <FormattedMessage id="dashboard.form.height-placeholder">{(text) => <input type="number" placeholder={text} value={height} onChange={(e) => this.setState({ height: e.target.value })} />}</FormattedMessage>
                                        <span className="suffix">cm</span>
                                    </div>
                                </div>

                                <button className="calculate-btn" disabled={!weight || !height} onClick={this.calculateBMI}>
                                    <FormattedMessage id="dashboard.form.bmi-result-btn" />
                                </button>

                                {bmiResult && (
                                    <div className="result-card" style={{ borderColor: bmiResult.color }}>
                                        <div className="result-header">
                                            <div>
                                                <div className="result-value" style={{ color: bmiResult.color }}>
                                                    {bmiResult.value}
                                                </div>
                                            </div>
                                            <div className="result-category">
                                                <h4>
                                                    <FormattedMessage id="dashboard.form.classify" />
                                                </h4>
                                                <div className="category" style={{ color: bmiResult.color }}>
                                                    {bmiResult.category}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="result-advice">
                                            <AlertCircle size={20} color={bmiResult.color} />
                                            <p>{bmiResult.advice}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* WHR */}
                        {activeHealthTab === "whr" && (
                            <div className="calculator-content">
                                <div className="form-group">
                                    <label>
                                        <FormattedMessage id="dashboard.form.gender" />
                                    </label>
                                    <select value={gender} onChange={(e) => this.setState({ gender: e.target.value })}>
                                        <FormattedMessage id="dashboard.form.male">{(text) => <option value="male">{text}</option>}</FormattedMessage>
                                        <FormattedMessage id="dashboard.form.female">{(text) => <option value="female">{text}</option>}</FormattedMessage>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>
                                        <FormattedMessage id="dashboard.form.waist-circumference" />
                                    </label>
                                    <div className="input-suffix">
                                        <FormattedMessage id="dashboard.form.waist-circumference-placeholder">{(text) => <input type="number" placeholder={text} value={waist} onChange={(e) => this.setState({ waist: e.target.value })} />}</FormattedMessage>

                                        <span className="suffix">cm</span>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>
                                        <FormattedMessage id="dashboard.form.hip-circumference" />
                                    </label>
                                    <div className="input-suffix">
                                        <FormattedMessage id="dashboard.form.hip-circumference-placeholder">{(text) => <input type="number" placeholder={text} value={hip} onChange={(e) => this.setState({ hip: e.target.value })} />}</FormattedMessage>
                                        <span className="suffix">cm</span>
                                    </div>
                                </div>

                                <button className="calculate-btn" disabled={!waist || !hip} onClick={this.calculateWHR}>
                                    Tính WHR
                                </button>

                                {whrResult && (
                                    <div className="result-card" style={{ borderColor: whrResult.color }}>
                                        <div className="result-header">
                                            <div>
                                                <div className="result-value" style={{ color: whrResult.color }}>
                                                    {whrResult.value}
                                                </div>
                                            </div>
                                            <div className="result-category">
                                                <h4>
                                                    <FormattedMessage id="dashboard.form.risk" />
                                                </h4>
                                                <div className="category" style={{ color: whrResult.color }}>
                                                    {whrResult.risk}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="result-advice">
                                            <AlertCircle size={20} color={whrResult.color} />
                                            <p>{whrResult.advice}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Statistics */}
                <div className="statistics-section">
                    <div className="section-header">
                        <TrendingUp className="section-icon" size={24} />
                        <h2>
                            <FormattedMessage id="dashboard.statistic.title" />
                        </h2>
                    </div>

                    <div className="stats-content">
                        {/* Monthly stats */}
                        <div>
                            <h3 className="section-title">
                                <FormattedMessage id="dashboard.statistic.appointments-every-month" />
                            </h3>
                            <div className="monthly-chart">
                                {monthlyStats.map((stat, index) => (
                                    <div key={index} className="chart-bar-wrapper">
                                        <div
                                            className="chart-bar"
                                            style={{
                                                height: `${(stat?.visits / Math.max(...monthlyStats.map((s) => s.visits))) * 160}px`,
                                            }}
                                        >
                                            <span className="chart-value">{stat?.visits}</span>
                                        </div>
                                        <span className="chart-label">{stat?.month}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Doctor ranking */}
                        <div>
                            <h3 className="section-title">
                                <FormattedMessage id="dashboard.statistic.frequent-doctor" />
                            </h3>
                            <div className="ranking-list">
                                {frequentlyVisitDoctorStats?.map((doctor, index) => {
                                    const rankColors = ["#50b8db", "#3b9bb8", "#6366f1", "#8b5cf6"];
                                    const color = rankColors[index] || "#ccc";

                                    return (
                                        <div key={index} className="ranking-item" style={{ borderLeftColor: color }}>
                                            <div className="ranking-number" style={{ background: color }}>
                                                {index + 1}
                                            </div>

                                            <div className="ranking-info">
                                                <h4>
                                                    {doctor?.doctorInfo?.lastName} {doctor?.doctorInfo?.firstName}
                                                </h4>
                                                <p>{doctor?.specialty?.name}</p>
                                            </div>

                                            <div className="ranking-badge">
                                                {doctor?.visits}
                                                {` `}
                                                <FormattedMessage id="dashboard.statistic.turn" />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Facility ranking */}
                        <div>
                            <h3 className="section-title">
                                <FormattedMessage id="dashboard.statistic.frequent-medical-facility" />
                            </h3>
                            <div className="ranking-list">
                                {frequentlyVisitFacilityStats?.map((facility, index) => {
                                    const rankColors = ["#50b8db", "#3b9bb8", "#6366f1", "#8b5cf6"];
                                    const color = rankColors[index] || "#ccc";

                                    return (
                                        <div key={index} className="ranking-item" style={{ borderLeftColor: color }}>
                                            <div className="ranking-number" style={{ background: color }}>
                                                {index + 1}
                                            </div>

                                            <div className="ranking-info">
                                                <h4>{facility?.facilityInfo?.name}</h4>
                                                <p>{facility?.facilityInfo?.address}</p>
                                            </div>

                                            <div className="ranking-badge">
                                                {facility?.visits}
                                                {` `}
                                                <FormattedMessage id="dashboard.statistic.turn" />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        userInfo: state.user.userInfo,
        isProfileIncomplete: state.user.isProfileIncomplete,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        switchLanguageOfWebsite: (language) => dispatch(switchLanguageOfWebsite(language)),
        processLogout: () => dispatch(actions.processLogout()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(injectIntl(DashboardForPatient)));
