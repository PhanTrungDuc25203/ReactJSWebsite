import React, { Component } from "react";
import { Calendar, Clock, User, Users, CheckCircle, XCircle, Bell, Activity, TrendingUp, FileText, Phone, MapPin, Search } from "lucide-react";
import "./Dashboard.scss";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import ScheduleTable from "../../components/ScheduleTable/ScheduleTable";
import { getAllRelativeBookingsOfCurrentSystemUserService, getDoctorStatisticMonthlyPatientsService, getDoctorAppointmentsTodayOverviewStatisticsService } from "../../services/userService";
import { switchLanguageOfWebsite } from "../../store/actions";
import * as actions from "../../store/actions";
/* global Temporal */

class DashboardForDoctor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedDate: "Hôm nay",
            doctorSpecialtyAndWorkplace: "",
            appointmentsPerPage: 5,
            currentPage: 1,
            events: [],

            todayAppointments: [
                {
                    id: 1,
                    patient: "Nguyễn Văn Thành",
                    age: 35,
                    gender: "Nam",
                    time: "08:00",
                    reason: "Khám định kỳ tim mạch",
                    status: "confirmed",
                    phone: "0901234567",
                },
                {
                    id: 2,
                    patient: "Trần Thị Mai",
                    age: 28,
                    gender: "Nữ",
                    time: "08:30",
                    reason: "Đau ngực, khó thở",
                    status: "confirmed",
                    phone: "0912345678",
                },
                {
                    id: 3,
                    patient: "Lê Văn Hùng",
                    age: 52,
                    gender: "Nam",
                    time: "09:00",
                    reason: "Tái khám sau phẫu thuật",
                    status: "waiting",
                    phone: "0923456789",
                },
                {
                    id: 4,
                    patient: "Phạm Thị Lan",
                    age: 41,
                    gender: "Nữ",
                    time: "09:30",
                    reason: "Kiểm tra huyết áp",
                    status: "confirmed",
                    phone: "0934567890",
                },
                {
                    id: 5,
                    patient: "Hoàng Minh Tuấn",
                    age: 38,
                    gender: "Nam",
                    time: "10:00",
                    reason: "Khám tổng quát",
                    status: "pending",
                    phone: "0945678901",
                },
                {
                    id: 6,
                    patient: "Đỗ Thị Hương",
                    age: 45,
                    gender: "Nữ",
                    time: "10:30",
                    reason: "Đau đầu, chóng mặt",
                    status: "confirmed",
                    phone: "0956789012",
                },
                {
                    id: 7,
                    patient: "Bùi Văn Nam",
                    age: 33,
                    gender: "Nam",
                    time: "11:00",
                    reason: "Khám sức khỏe định kỳ",
                    status: "pending",
                    phone: "0967890123",
                },
                {
                    id: 8,
                    patient: "Vũ Thị Thu",
                    age: 29,
                    gender: "Nữ",
                    time: "14:00",
                    reason: "Kiểm tra tim mạch",
                    status: "confirmed",
                    phone: "0978901234",
                },
                {
                    id: 9,
                    patient: "Ngô Văn Đức",
                    age: 48,
                    gender: "Nam",
                    time: "14:30",
                    reason: "Tái khám sau điều trị",
                    status: "waiting",
                    phone: "0989012345",
                },
                {
                    id: 10,
                    patient: "Đinh Thị Nga",
                    age: 36,
                    gender: "Nữ",
                    time: "15:00",
                    reason: "Khám định kỳ",
                    status: "confirmed",
                    phone: "0990123456",
                },
                {
                    id: 11,
                    patient: "Trịnh Văn Phong",
                    age: 42,
                    gender: "Nam",
                    time: "15:30",
                    reason: "Đau ngực thường xuyên",
                    status: "pending",
                    phone: "0901234568",
                },
                {
                    id: 12,
                    patient: "Lý Thị Hà",
                    age: 31,
                    gender: "Nữ",
                    time: "16:00",
                    reason: "Khó thở khi gắng sức",
                    status: "confirmed",
                    phone: "0912345679",
                },
                {
                    id: 13,
                    patient: "Phan Văn Tùng",
                    age: 55,
                    gender: "Nam",
                    time: "16:30",
                    reason: "Kiểm tra sau mổ tim",
                    status: "waiting",
                    phone: "0923456780",
                },
            ],

            stats: {
                totalPatients: "",
                todayAppointments: "",
                completedToday: "",
                pendingAppointments: "",
            },

            monthlyPatients: [],

            frequentPatients: [],

            commonReasons: [
                { reason: "Khám định kỳ", count: 45, color: "#50b8db" },
                { reason: "Đau ngực", count: 28, color: "#3b9bb8" },
                { reason: "Khó thở", count: 22, color: "#6366f1" },
                { reason: "Tái khám", count: 18, color: "#8b5cf6" },
            ],

            monthlyRevenue: [],
        };
    }

    async componentDidMount() {
        if (this.props?.userInfo?.id) {
            try {
                let todayOverviewStatisticsResponse = await getDoctorAppointmentsTodayOverviewStatisticsService(this.props.userInfo.id);
                let monthlyPatientStatisticsResponse = await getDoctorStatisticMonthlyPatientsService(this.props.userInfo.id);
                if (todayOverviewStatisticsResponse && todayOverviewStatisticsResponse.errCode === 0) {
                    this.setState({
                        stats: {
                            totalPatients: todayOverviewStatisticsResponse.data.totalPatients,
                            todayAppointments: todayOverviewStatisticsResponse.data.todayAppointments,
                            completedToday: todayOverviewStatisticsResponse.data.completedToday,
                            pendingAppointments: todayOverviewStatisticsResponse.data.pendingAppointments,
                        },
                        doctorSpecialtyAndWorkplace: todayOverviewStatisticsResponse.data.doctorSpecialtyAndWorkplace,
                    });
                }
                if (monthlyPatientStatisticsResponse && monthlyPatientStatisticsResponse.errCode === 0) {
                    this.setState({
                        monthlyPatients: monthlyPatientStatisticsResponse.data.monthlyPatients,
                        frequentPatients: monthlyPatientStatisticsResponse.data.frequentPatients,
                        monthlyRevenue: monthlyPatientStatisticsResponse.data.monthlyRevenue,
                    });
                }
            } catch (error) {
                console.error("Error getting doctor appointments statistic:", error);
            }
        }
        if (this.props?.userInfo?.email) {
            const userEmail = this.props.userInfo.email;
            const bookingRes = await getAllRelativeBookingsOfCurrentSystemUserService(userEmail, true);

            if (bookingRes && bookingRes.errCode === 0) {
                const doctorAppointments = bookingRes.data.doctorHasAppointmentWithPatients || [];
                const patientAppointments = bookingRes.data.patientHasAppointmentWithDoctors || [];
                const roleId = this.props.userInfo?.roleId;

                const allAppointments = [...doctorAppointments, ...patientAppointments];

                const combineDateTime = (dateStr, timeStr) => {
                    if (!dateStr || !timeStr) return null;
                    const [hour, minute] = timeStr.split(":").map(Number);
                    const dateObj = new Date(dateStr);
                    const yyyy = dateObj.getFullYear();
                    const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
                    const dd = String(dateObj.getDate()).padStart(2, "0");
                    const hh = String(hour).padStart(2, "0");
                    const mi = String(minute).padStart(2, "0");
                    return `${yyyy}-${mm}-${dd}T${hh}:${mi}:00`;
                };

                const now = Temporal.Now.zonedDateTimeISO("UTC");

                const mappedEvents = allAppointments
                    .map((item, index) => {
                        const timeRange = item.appointmentTimeTypeData?.value_Vie || "";
                        const [startTime, endTime] = timeRange.split(" - ");
                        if (!startTime || !endTime) return null;

                        const startBase = combineDateTime(item.date, startTime);
                        const endBase = combineDateTime(item.date, endTime);
                        if (!startBase || !endBase) return null;

                        try {
                            const startIsoWithZone = `${startBase}+00:00[UTC]`;
                            const endIsoWithZone = `${endBase}+00:00[UTC]`;
                            const startZoned = Temporal.ZonedDateTime.from(startIsoWithZone);
                            const endZoned = Temporal.ZonedDateTime.from(endIsoWithZone);

                            // Xác định màu theo thời gian
                            const diffHours = (startZoned.epochMilliseconds - now.epochMilliseconds) / (1000 * 60 * 60);
                            let calendarId = "future";
                            if (endZoned.epochMilliseconds < now.epochMilliseconds) {
                                calendarId = "past";
                            } else if (diffHours <= 24 && diffHours > 0) {
                                calendarId = "soon";
                            }

                            if (roleId === "R2") {
                                const patient = item.patientHasAppointmentWithDoctors;
                                const patientName = patient ? `${patient.lastName || ""} ${patient.firstName || ""}`.trim() : "Bệnh nhân chưa xác định";

                                return {
                                    id: String(item.id || index + 1),
                                    title: `Khám cho bệnh nhân ${patientName}`,
                                    start: startZoned,
                                    end: endZoned,
                                    description: item.examReason,
                                    location: item?.doctorHasAppointmentWithPatients?.address,
                                    calendarId, // màu sự kiện
                                };
                            } else if (roleId === "R3") {
                                const doctor = item.doctorHasAppointmentWithPatients;
                                const doctorName = doctor ? `${doctor.lastName || ""} ${doctor.firstName || ""}`.trim() : "Bác sĩ chưa xác định";

                                return {
                                    id: String(item.id || index + 1),
                                    title: `Khám với BS. ${doctorName}`,
                                    start: startZoned,
                                    end: endZoned,
                                    location: doctor?.address || "Không có địa chỉ",
                                    calendarId,
                                };
                            }

                            return null;
                        } catch (err) {
                            console.error("Lỗi chuyển đổi thời gian:", err);
                            return null;
                        }
                    })
                    .filter(Boolean);

                this.setState({
                    combinedAppointments: { doctorAppointments, patientAppointments },
                    events: mappedEvents,
                });
            }
        }
    }

    getStatusColor = (status) => {
        switch (status) {
            case "confirmed":
                return "#10b981";
            case "waiting":
                return "#f59e0b";
            case "pending":
                return "#6b7280";
            case "completed":
                return "#3b82f6";
            default:
                return "#6b7280";
        }
    };

    getStatusText = (status) => {
        switch (status) {
            case "confirmed":
                return "Đã xác nhận";
            case "waiting":
                return "Đang chờ";
            case "pending":
                return "Chờ duyệt";
            case "completed":
                return "Hoàn thành";
            default:
                return status;
        }
    };

    getInitials = (firstName, lastName) => {
        if (!firstName && !lastName) return "";
        const first = firstName ? firstName.charAt(0).toUpperCase() : "";
        const last = lastName ? lastName.charAt(0).toUpperCase() : "";
        return first + last;
    };

    handlePageChange = (pageNumber) => {
        this.setState({ currentPage: pageNumber });
    };

    setSelectedDate = (date) => {
        this.setState({ selectedDate: date });
    };

    formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

    render() {
        const { monthlyRevenue, events, appointmentsPerPage, currentPage, selectedDate, doctorSpecialtyAndWorkplace, todayAppointments, stats, monthlyPatients, frequentPatients, commonReasons } = this.state;
        const indexOfLastAppointment = currentPage * appointmentsPerPage;
        const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
        const currentAppointments = todayAppointments.slice(indexOfFirstAppointment, indexOfLastAppointment);
        const totalPages = Math.ceil(todayAppointments.length / appointmentsPerPage);
        const colors = ["#50b8db", "#3b9bb8", "#6366f1", "#8b5cf6"];
        const rankedFrequentPatients = frequentPatients.map((p, i) => ({
            ...p,
            color: colors[i] || "#ccc", // fallback nếu quá 4 người
        }));
        const totalRevenue = monthlyRevenue?.reduce((sum, item) => sum + item.revenue, 0);
        const currentMonthRevenue = monthlyRevenue[monthlyRevenue?.length - 1]?.revenue;
        const lastMonthRevenue = monthlyRevenue[monthlyRevenue?.length - 2]?.revenue;
        const revenueGrowth = (((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100).toFixed(1);

        return (
            <div className="doctor-dashboard">
                {/* Header */}
                <div className="dashboard-header">
                    <div className="header-left">
                        <h1>Xin chào, chúc bạn một ngày tốt lành</h1>
                        <p>Quản lý lịch khám và bệnh nhân</p>
                    </div>
                    <div className="header-right">
                        <button className="notification-btn">
                            <Bell size={20} color="#64748b" />
                            <span className="notification-badge">3</span>
                        </button>
                        <div className="doctor-info">
                            <div className="doctor-avatar">BS</div>
                            <div className="doctor-details">
                                <h3>
                                    BS. {this.props?.userInfo?.lastName} {this.props?.userInfo?.firstName}
                                </h3>
                                <p>
                                    {doctorSpecialtyAndWorkplace?.Specialty?.name}. {doctorSpecialtyAndWorkplace?.medicalFacilityDoctorAndSpecialty?.name}{" "}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <h4>Tổng bệnh nhân</h4>
                        <div className="value">{stats.totalPatients}</div>
                    </div>
                    <div className="stat-card">
                        <h4>Lịch hẹn hôm nay</h4>
                        <div className="value">{stats.todayAppointments}</div>
                    </div>
                    <div className="stat-card">
                        <h4>Đã khám hôm nay</h4>
                        <div className="value">{stats.completedToday}</div>
                    </div>
                    <div className="stat-card">
                        <h4>Chờ xử lý</h4>
                        <div className="value">{stats.pendingAppointments}</div>
                    </div>
                </div>

                <div className="statistics-section" style={{ marginBottom: "2rem" }}>
                    <div className="section-header">
                        <div className="section-title">
                            <TrendingUp className="section-icon" size={24} />
                            <h2>Tổng quan doanh thu</h2>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "2rem", marginTop: "1.5rem" }}>
                        {/* Left Column - Revenue Cards */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                            {/* Total Revenue Card */}
                            <div
                                style={{
                                    background: "linear-gradient(135deg, #50b8db, #3b9bb8)",
                                    padding: "1.75rem",
                                    borderRadius: "12px",
                                    color: "white",
                                    boxShadow: "0 4px 12px rgba(80, 184, 219, 0.3)",
                                }}
                            >
                                <div style={{ fontSize: "0.9rem", opacity: 0.9, marginBottom: "0.5rem" }}>Tổng doanh thu (6 tháng)</div>
                                <div style={{ fontSize: "1.75rem", fontWeight: "700", marginBottom: "0.5rem" }}>{this.formatCurrency(totalRevenue)}</div>
                                <div style={{ fontSize: "0.85rem", opacity: 0.8 }}>Trung bình: {this.formatCurrency(totalRevenue / 6)}/tháng</div>
                            </div>

                            {/* Current Month Revenue */}
                            <div
                                style={{
                                    background: "white",
                                    padding: "1.75rem",
                                    borderRadius: "12px",
                                    border: "2px solid #e2e8f0",
                                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                                }}
                            >
                                <div style={{ fontSize: "0.9rem", color: "#64748b", marginBottom: "0.5rem" }}>Doanh thu tháng này</div>
                                <div style={{ fontSize: "1.75rem", fontWeight: "700", color: "#1e293b", marginBottom: "0.5rem" }}>{this.formatCurrency(currentMonthRevenue)}</div>
                                <div
                                    style={{
                                        fontSize: "0.85rem",
                                        color: revenueGrowth >= 0 ? "#10b981" : "#ef4444",
                                        fontWeight: "600",
                                    }}
                                >
                                    {revenueGrowth >= 0 ? "↑" : "↓"} {Math.abs(revenueGrowth)}% so với tháng trước
                                </div>
                            </div>

                            {/* Average Revenue per Patient */}
                            <div
                                style={{
                                    background: "white",
                                    padding: "1.75rem",
                                    borderRadius: "12px",
                                    border: "2px solid #e2e8f0",
                                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                                }}
                            >
                                <div style={{ fontSize: "0.9rem", color: "#64748b", marginBottom: "0.5rem" }}>TB doanh thu/bệnh nhân</div>
                                <div style={{ fontSize: "1.75rem", fontWeight: "700", color: "#1e293b", marginBottom: "0.5rem" }}>{this.formatCurrency(currentMonthRevenue / monthlyRevenue[monthlyRevenue?.length - 1]?.patients)}</div>
                                <div style={{ fontSize: "0.85rem", color: "#64748b" }}>Tháng {monthlyRevenue[monthlyRevenue?.length - 1]?.month}</div>
                            </div>
                        </div>

                        {/* Right Column - Revenue Chart */}
                        <div
                            style={{
                                background: "white",
                                padding: "1.75rem",
                                borderRadius: "12px",
                                border: "2px solid #e2e8f0",
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                            }}
                        >
                            <h3 style={{ fontSize: "1.1rem", color: "#1e293b", fontWeight: 600, marginBottom: "1.5rem" }}>Biểu đồ doanh thu 6 tháng</h3>
                            <div className="monthly-chart" style={{ height: "280px" }}>
                                {monthlyRevenue?.map((stat, index) => (
                                    <div key={index} className="chart-bar-wrapper">
                                        <div className="chart-bar" style={{ height: `${(stat.revenue / Math.max(...monthlyRevenue?.map((s) => s.revenue))) * 220}px` }}>
                                            <span className="chart-value" style={{ whiteSpace: "nowrap", fontSize: "0.8rem" }}>
                                                {(stat.revenue / 1000000).toFixed(0)}tr
                                            </span>
                                        </div>
                                        <span className="chart-label">{stat.month.replace("Tháng ", "T")}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main content */}
                {/* <div className="main-content"> */}
                {/* Today's Appointments */}
                {/* <div className="appointments-section"> */}
                {/* <div className="section-header">
                            <div className="section-title">
                                <Calendar className="section-icon" size={24} />
                                <h2>Lịch khám</h2>
                            </div>
                            <div className="date-selector">
                                <button className={`date-btn ${selectedDate === "Hôm nay" ? "active" : ""}`} onClick={() => this.setSelectedDate("Hôm nay")}>
                                    Hôm nay
                                </button>
                                <button className={`date-btn ${selectedDate === "Tuần này" ? "active" : ""}`} onClick={() => this.setSelectedDate("Tuần này")}>
                                    Tuần này
                                </button>
                                <button className={`date-btn ${selectedDate === "Tháng này" ? "active" : ""}`} onClick={() => this.setSelectedDate("Tháng này")}>
                                    Tháng này
                                </button>
                            </div>
                        </div>

                        <div className="appointments-list">
                            {currentAppointments.map((appointment) => (
                                <div key={appointment.id} className="appointment-item">
                                    <div className="appointment-header">
                                        <div className="patient-info-wrapper">
                                            <div className="patient-avatar">{appointment.patient.split(" ").slice(-1)[0].charAt(0)}</div>
                                            <div className="patient-info">
                                                <h3>{appointment.patient}</h3>
                                                <div className="patient-meta">
                                                    <span>{appointment.age} tuổi</span>
                                                    <span>•</span>
                                                    <span>{appointment.gender}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="time-badge">
                                            <Clock size={16} />
                                            {appointment.time}
                                        </div>
                                    </div>

                                    <div className="appointment-details">
                                        <div className="detail-row">
                                            <FileText className="detail-icon" size={16} />
                                            <span>Lý do khám: {appointment.reason}</span>
                                        </div>
                                        <div className="detail-row">
                                            <Phone className="detail-icon" size={16} />
                                            <span>{appointment.phone}</span>
                                        </div>
                                    </div>

                                    {appointment.status === "pending" && (
                                        <div className="appointment-actions">
                                            <button className="action-btn accept">
                                                <CheckCircle size={16} style={{ display: "inline", marginRight: "0.25rem" }} />
                                                Chấp nhận
                                            </button>
                                            <button className="action-btn reject">
                                                <XCircle size={16} style={{ display: "inline", marginRight: "0.25rem" }} />
                                                Từ chối
                                            </button>
                                        </div>
                                    )}

                                    {appointment.status === "confirmed" && (
                                        <div className="appointment-actions">
                                            <button className="action-btn complete">
                                                <CheckCircle size={16} style={{ display: "inline", marginRight: "0.25rem" }} />
                                                Hoàn thành khám
                                            </button>
                                        </div>
                                    )}

                                    {appointment.status === "waiting" && (
                                        <div style={{ marginTop: "0.75rem" }}>
                                            <span className="status-badge" style={{ background: this.getStatusColor(appointment.status) }}>
                                                {this.getStatusText(appointment.status)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div> */}
                {/* <ScheduleTable ref={this.scheduleRef} events={events} defaultView="week" highlightEventId={this.state.highlightEventId} /> */}

                {/* Pagination */}
                {/* <div className="pagination">
                            <button className="pagination-btn" onClick={() => this.handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                                ← Trước
                            </button>

                            {[...Array(totalPages)].map((_, index) => (
                                <button key={index + 1} className={`pagination-btn ${currentPage === index + 1 ? "active" : ""}`} onClick={() => this.handlePageChange(index + 1)}>
                                    {index + 1}
                                </button>
                            ))}

                            <button className="pagination-btn" onClick={() => this.handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                                Sau →
                            </button>

                            <span className="pagination-info">
                                Hiển thị {indexOfFirstAppointment + 1}-{Math.min(indexOfLastAppointment, todayAppointments.length)} / {todayAppointments.length} lịch hẹn
                            </span>
                        </div> */}
                {/* </div> */}

                {/* Quick actions */}
                {/* <div className="quick-actions">
                        <div className="section-title">
                            <Activity className="section-icon" size={24} />
                            <h2>Thao tác nhanh</h2>
                        </div>
                        <div className="action-grid">
                            <div className="action-card">
                                <div className="action-icon">
                                    <Users size={24} color="white" />
                                </div>
                                <h4>Danh sách bệnh nhân</h4>
                            </div>

                            <div className="action-card">
                                <div className="action-icon">
                                    <Calendar size={24} color="white" />
                                </div>
                                <h4>Xem lịch làm việc</h4>
                            </div>

                            <div className="action-card">
                                <div className="action-icon">
                                    <FileText size={24} color="white" />
                                </div>
                                <h4>Hồ sơ bệnh án</h4>
                            </div>

                            <div className="action-card">
                                <div className="action-icon">
                                    <TrendingUp size={24} color="white" />
                                </div>
                                <h4>Báo cáo thống kê</h4>
                            </div>
                        </div>
                    </div>
                </div> */}

                {/* Statistics */}
                <div className="statistics-section">
                    <div className="section-header">
                        <div className="section-title">
                            <TrendingUp className="section-icon" size={24} />
                            <h2>Thống kê chi tiết</h2>
                        </div>
                    </div>

                    <div className="stats-content">
                        {/* Monthly Patients */}
                        <div>
                            <h3 className="stat-subtitle">Bệnh nhân theo tháng</h3>
                            <div className="monthly-chart">
                                {monthlyPatients.map((stat, index) => {
                                    const max = Math.max(...monthlyPatients.map((s) => s.patients));
                                    const height = (stat.patients / max) * 160;

                                    return (
                                        <div key={index} className="chart-bar-wrapper">
                                            <div className="chart-bar" style={{ height: `${height}px` }}>
                                                <span className="chart-value">{stat.patients}</span>
                                            </div>
                                            <span className="chart-label">{stat.month}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Frequent Patients */}
                        <div>
                            <h3 className="stat-subtitle">Bệnh nhân thường xuyên</h3>
                            <div className="ranking-list">
                                {rankedFrequentPatients.map((patient, index) => (
                                    <div key={index} className="ranking-item" style={{ borderLeftColor: patient.color }}>
                                        <div className="ranking-number" style={{ background: patient.color }}>
                                            {index + 1}
                                        </div>

                                        <div className="ranking-info">
                                            <h4>{patient.name}</h4>
                                            <p>
                                                {patient.age} tuổi • Khám gần nhất: {patient.lastVisit}
                                            </p>
                                        </div>

                                        <div className="ranking-badge">{patient.visits} lượt</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Common Reasons */}
                        <div>
                            <h3 className="stat-subtitle">Lý do khám phổ biến</h3>
                            <div className="ranking-list">
                                {commonReasons.map((item, index) => (
                                    <div key={index} className="ranking-item" style={{ borderLeftColor: item.color }}>
                                        <div className="ranking-number" style={{ background: item.color }}>
                                            {index + 1}
                                        </div>
                                        <div className="ranking-info">
                                            <h4>{item.reason}</h4>
                                            <p>Tần suất xuất hiện cao</p>
                                        </div>
                                        <div className="ranking-badge">{item.count} ca</div>
                                    </div>
                                ))}
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DashboardForDoctor));
