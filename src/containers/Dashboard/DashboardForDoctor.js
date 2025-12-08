import React, { useState } from "react";
import { Calendar, Clock, User, Users, CheckCircle, XCircle, Bell, Activity, TrendingUp, FileText, Phone, MapPin, Search } from "lucide-react";
import "./Dashboard.scss";

const DashboardForDoctor = () => {
    const [selectedDate, setSelectedDate] = useState("Hôm nay");

    // Lịch hẹn hôm nay
    const todayAppointments = [
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
            time: "09:00",
            reason: "Đau ngực, khó thở",
            status: "confirmed",
            phone: "0912345678",
        },
        {
            id: 3,
            patient: "Lê Văn Hùng",
            age: 52,
            gender: "Nam",
            time: "10:30",
            reason: "Tái khám sau phẫu thuật",
            status: "waiting",
            phone: "0923456789",
        },
        {
            id: 4,
            patient: "Phạm Thị Lan",
            age: 41,
            gender: "Nữ",
            time: "14:00",
            reason: "Kiểm tra huyết áp",
            status: "confirmed",
            phone: "0934567890",
        },
        {
            id: 5,
            patient: "Hoàng Minh Tuấn",
            age: 38,
            gender: "Nam",
            time: "15:30",
            reason: "Khám tổng quát",
            status: "pending",
            phone: "0945678901",
        },
    ];

    // Thống kê
    const stats = {
        totalPatients: 156,
        todayAppointments: 5,
        completedToday: 2,
        pendingAppointments: 3,
    };

    // Thống kê bệnh nhân theo tháng (6 tháng gần nhất)
    const monthlyPatients = [
        { month: "Tháng 7", patients: 22 },
        { month: "Tháng 8", patients: 28 },
        { month: "Tháng 9", patients: 24 },
        { month: "Tháng 10", patients: 31 },
        { month: "Tháng 11", patients: 26 },
        { month: "Tháng 12", patients: 25 },
    ];

    // Top bệnh nhân thường xuyên
    const frequentPatients = [
        { name: "Nguyễn Văn Thành", age: 35, visits: 8, lastVisit: "01/12/2024", color: "#50b8db" },
        { name: "Trần Thị Mai", age: 28, visits: 6, lastVisit: "28/11/2024", color: "#3b9bb8" },
        { name: "Lê Văn Hùng", age: 52, visits: 5, lastVisit: "25/11/2024", color: "#6366f1" },
        { name: "Phạm Thị Lan", age: 41, visits: 4, lastVisit: "20/11/2024", color: "#8b5cf6" },
    ];

    // Lý do khám phổ biến
    const commonReasons = [
        { reason: "Khám định kỳ", count: 45, color: "#50b8db" },
        { reason: "Đau ngực", count: 28, color: "#3b9bb8" },
        { reason: "Khó thở", count: 22, color: "#6366f1" },
        { reason: "Tái khám", count: 18, color: "#8b5cf6" },
    ];

    const getStatusColor = (status) => {
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

    const getStatusText = (status) => {
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

    return (
        <div className="doctor-dashboard">
            {/* Header */}
            <div className="dashboard-header">
                <div className="header-left">
                    <h1>Dashboard Bác Sĩ</h1>
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
                            <h3>BS. Nguyễn Văn An</h3>
                            <p>Chuyên khoa Tim mạch</p>
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

            {/* Main Content */}
            <div className="main-content">
                {/* Today's Appointments */}
                <div className="appointments-section">
                    <div className="section-header">
                        <div className="section-title">
                            <Calendar className="section-icon" size={24} />
                            <h2>Lịch khám</h2>
                        </div>
                        <div className="date-selector">
                            <button className={`date-btn ${selectedDate === "Hôm nay" ? "active" : ""}`} onClick={() => setSelectedDate("Hôm nay")}>
                                Hôm nay
                            </button>
                            <button className={`date-btn ${selectedDate === "Tuần này" ? "active" : ""}`} onClick={() => setSelectedDate("Tuần này")}>
                                Tuần này
                            </button>
                            <button className={`date-btn ${selectedDate === "Tháng này" ? "active" : ""}`} onClick={() => setSelectedDate("Tháng này")}>
                                Tháng này
                            </button>
                        </div>
                    </div>

                    <div className="appointments-list">
                        {todayAppointments.map((appointment) => (
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
                                        <span className="status-badge" style={{ background: getStatusColor(appointment.status) }}>
                                            {getStatusText(appointment.status)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="quick-actions">
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
            </div>

            {/* Statistics Section */}
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
                        <h3 style={{ fontSize: "1.1rem", color: "#1e293b", fontWeight: 600, marginBottom: "1rem" }}>Bệnh nhân theo tháng</h3>
                        <div className="monthly-chart">
                            {monthlyPatients.map((stat, index) => (
                                <div key={index} className="chart-bar-wrapper">
                                    <div className="chart-bar" style={{ height: `${(stat.patients / Math.max(...monthlyPatients.map((s) => s.patients))) * 160}px` }}>
                                        <span className="chart-value">{stat.patients}</span>
                                    </div>
                                    <span className="chart-label">{stat.month}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Frequent Patients */}
                    <div>
                        <h3 style={{ fontSize: "1.1rem", color: "#1e293b", fontWeight: 600, marginBottom: "1rem" }}>Bệnh nhân thường xuyên</h3>
                        <div className="ranking-list">
                            {frequentPatients.map((patient, index) => (
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
                        <h3 style={{ fontSize: "1.1rem", color: "#1e293b", fontWeight: 600, marginBottom: "1rem" }}>Lý do khám phổ biến</h3>
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
};

export default DashboardForDoctor;
