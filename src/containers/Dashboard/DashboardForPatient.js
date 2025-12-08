import React, { useState } from "react";
import { Calendar, Clock, MapPin, Bell, User, Activity, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import "./Dashboard.scss";

const DashboardForPatient = () => {
    const [activeHealthTab, setActiveHealthTab] = useState("bmi");

    // BMI State
    const [weight, setWeight] = useState("");
    const [height, setHeight] = useState("");
    const [bmiResult, setBmiResult] = useState(null);

    // WHR State
    const [waist, setWaist] = useState("");
    const [hip, setHip] = useState("");
    const [gender, setGender] = useState("male");
    const [whrResult, setWhrResult] = useState(null);

    // Dữ liệu lịch hẹn chờ khám
    const pendingAppointments = [
        {
            id: 1,
            doctor: "BS. Nguyễn Văn An",
            specialty: "Tim mạch",
            date: "15/12/2024",
            time: "09:00",
            location: "Phòng khám Đa khoa Việt Nam",
            address: "123 Nguyễn Huệ, Q.1, TP.HCM",
        },
        {
            id: 2,
            doctor: "BS. Trần Thị Bình",
            specialty: "Nội tổng quát",
            date: "20/12/2024",
            time: "14:30",
            location: "Bệnh viện Trung ương",
            address: "456 Lê Lợi, Q.1, TP.HCM",
        },
        {
            id: 3,
            doctor: "BS. Lê Minh Tuấn",
            specialty: "Da liễu",
            date: "22/12/2024",
            time: "10:15",
            location: "Phòng khám Chuyên khoa Da",
            address: "789 Trần Hưng Đạo, Q.5, TP.HCM",
        },
    ];

    // Thống kê
    const stats = {
        totalAppointments: 12,
        pendingAppointments: 3,
        completedAppointments: 8,
        cancelledAppointments: 1,
    };

    // Thống kê lượt khám hàng tháng (6 tháng gần nhất)
    const monthlyStats = [
        { month: "Tháng 7", visits: 1 },
        { month: "Tháng 8", visits: 2 },
        { month: "Tháng 9", visits: 1 },
        { month: "Tháng 10", visits: 3 },
        { month: "Tháng 11", visits: 2 },
        { month: "Tháng 12", visits: 3 },
    ];

    // Thống kê bác sĩ
    const doctorStats = [
        { name: "BS. Nguyễn Văn An", specialty: "Tim mạch", visits: 5, color: "#50b8db" },
        { name: "BS. Trần Thị Bình", specialty: "Nội tổng quát", visits: 3, color: "#3b9bb8" },
        { name: "BS. Lê Văn Cường", specialty: "Tai Mũi Họng", visits: 2, color: "#6366f1" },
        { name: "BS. Phạm Thị Dung", specialty: "Da liễu", visits: 2, color: "#8b5cf6" },
    ];

    // Thống kê cơ sở y tế
    const facilityStats = [
        { name: "Phòng khám Đa khoa Việt Nam", address: "123 Nguyễn Huệ, Q.1", visits: 6, color: "#50b8db" },
        { name: "Bệnh viện Trung ương", address: "456 Lê Lợi, Q.1", visits: 3, color: "#3b9bb8" },
        { name: "Phòng khám Chuyên khoa Da", address: "789 Trần Hưng Đạo, Q.5", visits: 2, color: "#6366f1" },
        { name: "Bệnh viện Nhi đồng 1", address: "341 Sư Vạn Hạnh, Q.10", visits: 1, color: "#8b5cf6" },
    ];

    // Tính BMI
    const calculateBMI = () => {
        if (!weight || !height) return;

        const heightInMeters = parseFloat(height) / 100;
        const bmi = (parseFloat(weight) / (heightInMeters * heightInMeters)).toFixed(1);

        let category = "";
        let advice = "";
        let color = "";

        if (bmi < 18.5) {
            category = "Thiếu cân";
            advice = "Bạn nên tăng cường dinh dưỡng và tập luyện để đạt cân nặng lý tưởng. Nên gặp bác sĩ dinh dưỡng để có chế độ ăn phù hợp.";
            color = "#3b82f6";
        } else if (bmi >= 18.5 && bmi < 23) {
            category = "Bình thường";
            advice = "Tuyệt vời! Cân nặng của bạn đang ở mức lý tưởng. Hãy duy trì chế độ ăn uống lành mạnh và tập thể dục đều đặn.";
            color = "#10b981";
        } else if (bmi >= 23 && bmi < 25) {
            category = "Thừa cân";
            advice = "Bạn đang có dấu hiệu thừa cân. Nên điều chỉnh chế độ ăn, tăng cường vận động và theo dõi sức khỏe định kỳ.";
            color = "#f59e0b";
        } else if (bmi >= 25 && bmi < 30) {
            category = "Béo phì độ I";
            advice = "Cân nặng của bạn đang ở mức béo phì độ I. Nên tham khảo ý kiến bác sĩ để có kế hoạch giảm cân an toàn và hiệu quả.";
            color = "#f97316";
        } else {
            category = "Béo phì độ II";
            advice = "Bạn đang ở mức béo phì độ II, cần gặp bác sĩ chuyên khoa để được tư vấn và điều trị kịp thời, tránh các biến chứng về sức khỏe.";
            color = "#ef4444";
        }

        setBmiResult({ value: bmi, category, advice, color });
    };

    // Tính WHR
    const calculateWHR = () => {
        if (!waist || !hip) return;

        const whr = (parseFloat(waist) / parseFloat(hip)).toFixed(2);

        let risk = "";
        let advice = "";
        let color = "";

        if (gender === "male") {
            if (whr < 0.9) {
                risk = "Thấp";
                advice = "Tỷ lệ vòng eo/hông của bạn ở mức tốt. Hãy duy trì lối sống lành mạnh để giữ được chỉ số này.";
                color = "#10b981";
            } else if (whr >= 0.9 && whr < 1.0) {
                risk = "Trung bình";
                advice = "Tỷ lệ vòng eo/hông của bạn ở mức trung bình. Nên tăng cường vận động và chú ý chế độ ăn để cải thiện.";
                color = "#f59e0b";
            } else {
                risk = "Cao";
                advice = "Tỷ lệ vòng eo/hông của bạn ở mức cao, nguy cơ mắc bệnh tim mạch và đái tháo đường tăng. Nên gặp bác sĩ để được tư vấn.";
                color = "#ef4444";
            }
        } else {
            if (whr < 0.8) {
                risk = "Thấp";
                advice = "Tỷ lệ vòng eo/hông của bạn ở mức tốt. Hãy duy trì lối sống lành mạnh để giữ được chỉ số này.";
                color = "#10b981";
            } else if (whr >= 0.8 && whr < 0.85) {
                risk = "Trung bình";
                advice = "Tỷ lệ vòng eo/hông của bạn ở mức trung bình. Nên tăng cường vận động và chú ý chế độ ăn để cải thiện.";
                color = "#f59e0b";
            } else {
                risk = "Cao";
                advice = "Tỷ lệ vòng eo/hông của bạn ở mức cao, nguy cơ mắc bệnh tim mạch và đái tháo đường tăng. Nên gặp bác sĩ để được tư vấn.";
                color = "#ef4444";
            }
        }

        setWhrResult({ value: whr, risk, advice, color });
    };

    return (
        <div className="dashboard-container">
            {/* Header */}
            <div className="dashboard-header">
                <div className="header-left">
                    <h1>Dashboard Bệnh Nhân</h1>
                    <p>Quản lý lịch khám và theo dõi sức khỏe</p>
                </div>
                <div className="header-right">
                    <button className="notification-btn">
                        <Bell size={20} color="#64748b" />
                        <span className="notification-badge">2</span>
                    </button>
                    <div className="user-info">
                        <div className="user-avatar">NT</div>
                        <div className="user-details">
                            <h3>Nguyễn Văn Thành</h3>
                            <p>Bệnh nhân</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <div className="stat-card">
                    <h4>Tổng lịch hẹn</h4>
                    <div className="value">{stats.totalAppointments}</div>
                </div>
                <div className="stat-card">
                    <h4>Chờ khám</h4>
                    <div className="value">{stats.pendingAppointments}</div>
                </div>
                <div className="stat-card">
                    <h4>Đã hoàn thành</h4>
                    <div className="value">{stats.completedAppointments}</div>
                </div>
                <div className="stat-card">
                    <h4>Đã hủy</h4>
                    <div className="value">{stats.cancelledAppointments}</div>
                </div>
            </div>

            {/* Main Content */}
            <div className="content-grid">
                {/* Appointments */}
                <div className="appointments-section">
                    <div className="section-header">
                        <Calendar className="section-icon" size={24} />
                        <h2>Lịch hẹn chờ khám</h2>
                    </div>
                    <div className="appointments-list">
                        {pendingAppointments.map((appointment) => (
                            <div key={appointment.id} className="appointment-card">
                                <div className="appointment-header">
                                    <div className="doctor-avatar">BS</div>
                                    <div className="appointment-info">
                                        <h3>{appointment.doctor}</h3>
                                        <div className="specialty">{appointment.specialty}</div>
                                    </div>
                                </div>
                                <div className="appointment-details">
                                    <div className="detail-row">
                                        <Calendar className="detail-icon" size={16} />
                                        <span>{appointment.date}</span>
                                        <Clock className="detail-icon" size={16} style={{ marginLeft: "1rem" }} />
                                        <span>{appointment.time}</span>
                                    </div>
                                    <div className="detail-row">
                                        <MapPin className="detail-icon" size={16} />
                                        <span>{appointment.location}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Health Calculator */}
                <div className="health-calculator">
                    <div className="section-header">
                        <Activity className="section-icon" size={24} />
                        <h2>Đánh giá sức khỏe</h2>
                    </div>

                    <div className="health-tabs">
                        <button className={`tab-btn ${activeHealthTab === "bmi" ? "active" : ""}`} onClick={() => setActiveHealthTab("bmi")}>
                            Chỉ số BMI
                        </button>
                        <button className={`tab-btn ${activeHealthTab === "whr" ? "active" : ""}`} onClick={() => setActiveHealthTab("whr")}>
                            Tỷ lệ Eo/Hông
                        </button>
                    </div>

                    {activeHealthTab === "bmi" && (
                        <div className="calculator-content">
                            <div className="form-group">
                                <label>Cân nặng</label>
                                <div className="input-suffix">
                                    <input type="number" placeholder="Nhập cân nặng" value={weight} onChange={(e) => setWeight(e.target.value)} />
                                    <span className="suffix">kg</span>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Chiều cao</label>
                                <div className="input-suffix">
                                    <input type="number" placeholder="Nhập chiều cao" value={height} onChange={(e) => setHeight(e.target.value)} />
                                    <span className="suffix">cm</span>
                                </div>
                            </div>
                            <button className="calculate-btn" onClick={calculateBMI} disabled={!weight || !height}>
                                Tính toán BMI
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
                                            <h4>Phân loại</h4>
                                            <div className="category" style={{ color: bmiResult.color }}>
                                                {bmiResult.category}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="result-advice">
                                        <AlertCircle size={20} color={bmiResult.color} style={{ flexShrink: 0, marginTop: "2px" }} />
                                        <p>{bmiResult.advice}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeHealthTab === "whr" && (
                        <div className="calculator-content">
                            <div className="form-group">
                                <label>Giới tính</label>
                                <select value={gender} onChange={(e) => setGender(e.target.value)}>
                                    <option value="male">Nam</option>
                                    <option value="female">Nữ</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Vòng eo</label>
                                <div className="input-suffix">
                                    <input type="number" placeholder="Nhập vòng eo" value={waist} onChange={(e) => setWaist(e.target.value)} />
                                    <span className="suffix">cm</span>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Vòng hông</label>
                                <div className="input-suffix">
                                    <input type="number" placeholder="Nhập vòng hông" value={hip} onChange={(e) => setHip(e.target.value)} />
                                    <span className="suffix">cm</span>
                                </div>
                            </div>
                            <button className="calculate-btn" onClick={calculateWHR} disabled={!waist || !hip}>
                                Tính toán WHR
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
                                            <h4>Mức rủi ro</h4>
                                            <div className="category" style={{ color: whrResult.color }}>
                                                {whrResult.risk}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="result-advice">
                                        <AlertCircle size={20} color={whrResult.color} style={{ flexShrink: 0, marginTop: "2px" }} />
                                        <p>{whrResult.advice}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Statistics Section */}
            <div className="statistics-section">
                <div className="section-header">
                    <TrendingUp className="section-icon" size={24} />
                    <h2>Thống kê chi tiết</h2>
                </div>

                <div className="stats-content">
                    {/* Monthly Visits */}
                    <div>
                        <h3 style={{ fontSize: "1.1rem", color: "#1e293b", fontWeight: 600, marginBottom: "1rem" }}>Lượt khám hàng tháng</h3>
                        <div className="monthly-chart">
                            {monthlyStats.map((stat, index) => (
                                <div key={index} className="chart-bar-wrapper">
                                    <div className="chart-bar" style={{ height: `${(stat.visits / Math.max(...monthlyStats.map((s) => s.visits))) * 160}px` }}>
                                        <span className="chart-value">{stat.visits}</span>
                                    </div>
                                    <span className="chart-label">{stat.month}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Doctors */}
                    <div>
                        <h3 style={{ fontSize: "1.1rem", color: "#1e293b", fontWeight: 600, marginBottom: "1rem" }}>Bác sĩ thường gặp</h3>
                        <div className="ranking-list">
                            {doctorStats.map((doctor, index) => (
                                <div key={index} className="ranking-item" style={{ borderLeftColor: doctor.color }}>
                                    <div className="ranking-number" style={{ background: doctor.color }}>
                                        {index + 1}
                                    </div>
                                    <div className="ranking-info">
                                        <h4>{doctor.name}</h4>
                                        <p>{doctor.specialty}</p>
                                    </div>
                                    <div className="ranking-badge">{doctor.visits} lượt</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Facilities */}
                    <div>
                        <h3 style={{ fontSize: "1.1rem", color: "#1e293b", fontWeight: 600, marginBottom: "1rem" }}>Cơ sở y tế thường đến</h3>
                        <div className="ranking-list">
                            {facilityStats.map((facility, index) => (
                                <div key={index} className="ranking-item" style={{ borderLeftColor: facility.color }}>
                                    <div className="ranking-number" style={{ background: facility.color }}>
                                        {index + 1}
                                    </div>
                                    <div className="ranking-info">
                                        <h4>{facility.name}</h4>
                                        <p>{facility.address}</p>
                                    </div>
                                    <div className="ranking-badge">{facility.visits} lượt</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardForPatient;
