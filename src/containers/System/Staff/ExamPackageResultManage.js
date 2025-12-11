import React from "react";
import "./ExamPackageResultManage.scss";
import { Search, Save, CheckCircle, AlertCircle, User, Calendar, Clock, ArrowLeft, ChevronRight, Mail, Phone } from "lucide-react";

class ExamPackageResultManage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: "packages", // packages, patients, form
            selectedPackage: null,
            selectedPatient: null,
            searchQuery: "",
            testResults: {},
            savedStatus: "",
            packages: [
                {
                    id: "PKG001",
                    name: "Khám tổng quát cơ bản",
                    specialty: "Khám sức khỏe tổng quát",
                    image: "🏥",
                    pendingCount: 5,
                },
                {
                    id: "PKG002",
                    name: "Khám tim mạch chuyên sâu",
                    specialty: "Tim mạch",
                    image: "❤️",
                    pendingCount: 3,
                },
                {
                    id: "PKG003",
                    name: "Khám nội tiết - Đái tháo đường",
                    specialty: "Nội tiết",
                    image: "💉",
                    pendingCount: 4,
                },
                {
                    id: "PKG004",
                    name: "Khám tiêu hóa",
                    specialty: "Tiêu hóa",
                    image: "🫁",
                    pendingCount: 2,
                },
                {
                    id: "PKG005",
                    name: "Khám tiêu hóa",
                    specialty: "Tiêu hóa",
                    image: "🫁",
                    pendingCount: 2,
                },
            ],
            patients: {
                PKG001: [
                    {
                        id: "PT001",
                        name: "Nguyễn Văn An",
                        email: "nguyenvanan@email.com",
                        phoneNumber: "0912345678",
                        gender: "Nam",
                        examDate: "2024-12-11 09:00",
                        statusId: "S2",
                    },
                    {
                        id: "PT002",
                        name: "Trần Thị Bình",
                        email: "tranthib@email.com",
                        phoneNumber: "0987654321",
                        gender: "Nữ",
                        examDate: "2024-12-11 09:30",
                        statusId: "S2",
                    },
                    {
                        id: "PT003",
                        name: "Lê Văn Cường",
                        email: "levanc@email.com",
                        phoneNumber: "0901234567",
                        gender: "Nam",
                        examDate: "2024-12-11 10:00",
                        statusId: "S3",
                    },
                    {
                        id: "PT004",
                        name: "Phạm Thị Dung",
                        email: "phamthid@email.com",
                        phoneNumber: "0923456789",
                        gender: "Nữ",
                        examDate: "2024-12-11 10:30",
                        statusId: "S2",
                    },
                    {
                        id: "PT005",
                        name: "Hoàng Văn Em",
                        email: "hoangvane@email.com",
                        phoneNumber: "0934567890",
                        gender: "Nam",
                        examDate: "2024-12-11 11:00",
                        statusId: "S2",
                    },
                ],
                PKG002: [
                    {
                        id: "PT006",
                        name: "Đỗ Thị Phương",
                        email: "dothip@email.com",
                        phoneNumber: "0945678901",
                        gender: "Nữ",
                        examDate: "2024-12-11 14:00",
                        statusId: "S2",
                    },
                    {
                        id: "PT007",
                        name: "Vũ Văn Giang",
                        email: "vuvang@email.com",
                        phoneNumber: "0956789012",
                        gender: "Nam",
                        examDate: "2024-12-11 14:30",
                        statusId: "S2",
                    },
                    {
                        id: "PT008",
                        name: "Bùi Thị Hà",
                        email: "buithih@email.com",
                        phoneNumber: "0967890123",
                        gender: "Nữ",
                        examDate: "2024-12-11 15:00",
                        statusId: "S2",
                    },
                ],
            },
            testTemplate: {
                sections: [
                    {
                        title: "Huyết học (CBC)",
                        fields: [
                            { code: "WBC", label: "Bạch cầu (WBC)", unit: "10^9/L", normal_range: "4.0 - 11.0", value: null },
                            { code: "RBC", label: "Hồng cầu (RBC)", unit: "10^12/L", normal_range: "Nam: 4.5–6.0 / Nữ: 4.0–5.4", value: null },
                            { code: "HGB", label: "Hemoglobin (HGB)", unit: "g/dL", normal_range: "Nam: 13–17 / Nữ: 12–15", value: null },
                            { code: "HCT", label: "Hematocrit (HCT)", unit: "%", normal_range: "Nam: 40–52 / Nữ: 36–48", value: null },
                            { code: "PLT", label: "Tiểu cầu (PLT)", unit: "10^9/L", normal_range: "150 – 450", value: null },
                        ],
                    },
                    {
                        title: "Sinh hóa máu",
                        fields: [
                            { code: "GLU", label: "Đường huyết (Glucose)", unit: "mmol/L", normal_range: "3.9 – 6.4", value: null },
                            { code: "URE", label: "Urea", unit: "mmol/L", normal_range: "2.5 – 7.1", value: null },
                            { code: "CRE", label: "Creatinine", unit: "µmol/L", normal_range: "Nam: 62–115 / Nữ: 53–97", value: null },
                            { code: "CHOL", label: "Cholesterol toàn phần", unit: "mmol/L", normal_range: "< 5.2", value: null },
                            { code: "TRIG", label: "Triglyceride", unit: "mmol/L", normal_range: "< 1.7", value: null },
                        ],
                    },
                ],
            },
        };
    }

    handleSelectPackage = (pkg) => {
        this.setState({
            selectedPackage: pkg,
            currentView: "patients",
            searchQuery: "",
        });
    };

    handleSelectPatient = (patient) => {
        this.setState({
            selectedPatient: patient,
            currentView: "form",
            testResults: {},
        });
    };

    handleBackToPackages = () => {
        this.setState({
            currentView: "packages",
            selectedPackage: null,
            selectedPatient: null,
            searchQuery: "",
            testResults: {},
            savedStatus: "",
        });
    };

    handleBackToPatients = () => {
        this.setState({
            currentView: "patients",
            selectedPatient: null,
            testResults: {},
            savedStatus: "",
        });
    };

    handleValueChange = (sectionIndex, fieldIndex, value) => {
        this.setState((prevState) => ({
            testResults: {
                ...prevState.testResults,
                [`${sectionIndex}-${fieldIndex}`]: value,
            },
        }));
    };

    handleSave = () => {
        this.setState({ savedStatus: "saved" });
        setTimeout(() => {
            this.setState({ savedStatus: "" });
        }, 2000);
    };

    handleComplete = () => {
        const { selectedPatient } = this.state;
        if (window.confirm(`Xác nhận hoàn thành khám và gửi kết quả cho bệnh nhân ${selectedPatient.name}?`)) {
            this.setState({ savedStatus: "completed" });
            setTimeout(() => {
                this.handleBackToPatients();
            }, 1500);
        }
    };

    isValueAbnormal = (value, normalRange) => {
        if (!value || !normalRange) return false;
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return false;

        if (normalRange.includes("–")) {
            const ranges = normalRange.split("/").map((r) => r.trim());
            for (let range of ranges) {
                const match = range.match(/([\d.]+)\s*–\s*([\d.]+)/);
                if (match) {
                    const [, min, max] = match;
                    if (numValue >= parseFloat(min) && numValue <= parseFloat(max)) {
                        return false;
                    }
                }
            }
            return true;
        }

        if (normalRange.startsWith("<")) {
            const max = parseFloat(normalRange.replace("<", "").trim());
            return numValue >= max;
        }

        return false;
    };

    renderPackagesView() {
        const { packages, searchQuery } = this.state;
        const filteredPackages = packages.filter((pkg) => pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) || pkg.specialty.toLowerCase().includes(searchQuery.toLowerCase()));

        return (
            <div className="packages-view">
                <div className="packages-header">
                    <h2 className="packages-title">Danh sách gói khám</h2>
                    <p className="packages-subtitle">Chọn gói khám để xem danh sách bệnh nhân cần nhập kết quả</p>
                </div>

                <div className="packages-search">
                    <div className="search-wrapper">
                        <Search className="search-icon" />
                        <input type="text" placeholder="Tìm kiếm gói khám..." value={searchQuery} onChange={(e) => this.setState({ searchQuery: e.target.value })} className="search-input" />
                    </div>
                </div>

                <div className="packages-grid">
                    {filteredPackages.map((pkg) => (
                        <div key={pkg.id} onClick={() => this.handleSelectPackage(pkg)} className="package-card">
                            <div className="card-header">
                                <div className="card-image">{pkg.image}</div>
                                <div className="card-info">
                                    <h3 className="package-name">{pkg.name}</h3>
                                    <p className="package-specialty">{pkg.specialty}</p>

                                    <div className="card-row">
                                        <div className="pending-badge">
                                            <Clock className="clock-icon" />
                                            {pkg.pendingCount} bệnh nhân chờ
                                        </div>
                                        <ChevronRight className="arrow-icon" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    renderPatientsView() {
        const { selectedPackage, patients, searchQuery } = this.state;
        const packagePatients = patients[selectedPackage.id] || [];
        const filteredPatients = packagePatients.filter((patient) => patient.name.toLowerCase().includes(searchQuery.toLowerCase()) || patient.email.toLowerCase().includes(searchQuery.toLowerCase()) || patient.phoneNumber.includes(searchQuery));

        return (
            <div className="patients-view">
                <button onClick={this.handleBackToPackages} className="back-button">
                    <ArrowLeft className="back-icon" />
                    Quay lại danh sách gói khám
                </button>

                <div className="selected-package-card">
                    <div className="package-header">
                        <div className="package-image">{selectedPackage.image}</div>
                        <div className="package-info">
                            <h2 className="package-title">{selectedPackage.name}</h2>
                            <p className="package-subtitle">{selectedPackage.specialty}</p>
                        </div>
                    </div>
                </div>

                <div className="patients-search">
                    <div className="search-wrapper">
                        <Search className="search-icon" />
                        <input type="text" placeholder="Tìm kiếm bệnh nhân..." value={searchQuery} onChange={(e) => this.setState({ searchQuery: e.target.value })} className="search-input" />
                    </div>
                </div>

                <div className="patients-list">
                    {filteredPatients.map((patient) => (
                        <div key={patient.id} onClick={() => this.handleSelectPatient(patient)} className="patient-card">
                            <div className="patient-card-inner">
                                <div className="patient-info-left">
                                    <div className="patient-avatar">
                                        <User className="avatar-icon" />
                                    </div>

                                    <div className="patient-info">
                                        <h3 className="patient-name">{patient.name}</h3>

                                        <div className="patient-details-grid">
                                            <div className="detail-row">
                                                <Mail className="detail-icon" />
                                                {patient.email}
                                            </div>

                                            <div className="detail-row">
                                                <Phone className="detail-icon" />
                                                {patient.phoneNumber}
                                            </div>

                                            <div className="detail-row">
                                                <User className="detail-icon" />
                                                {patient.gender}
                                            </div>

                                            <div className="detail-row">
                                                <Calendar className="detail-icon" />
                                                {patient.examDate}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="patient-status">
                                    {patient.statusId === "S3" ? <span className="status-done">Đã hoàn thành</span> : <span className="status-pending">Chờ kết quả</span>}

                                    <ChevronRight className="arrow-icon" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    renderFormView() {
        const { selectedPatient, testTemplate, testResults, savedStatus } = this.state;

        return (
            <div className="form-container">
                <button onClick={this.handleBackToPatients} className="form-back-btn">
                    <ArrowLeft className="icon-back" />
                    Quay lại danh sách bệnh nhân
                </button>

                <div className="form-card">
                    <div className="form-header">
                        <h2 className="form-header-title">Nhập kết quả xét nghiệm</h2>

                        <div className="form-header-grid">
                            <div className="form-header-item">
                                <span className="label">Họ tên:</span>
                                <div className="value">{selectedPatient.name}</div>
                            </div>

                            <div className="form-header-item">
                                <span className="label">Giới tính:</span>
                                <div className="value">{selectedPatient.gender}</div>
                            </div>

                            <div className="form-header-item">
                                <span className="label">Ngày khám:</span>
                                <div className="value">{selectedPatient.examDate}</div>
                            </div>

                            <div className="form-header-item">
                                <span className="label">Email:</span>
                                <div className="value">{selectedPatient.email}</div>
                            </div>

                            <div className="form-header-item">
                                <span className="label">Số điện thoại:</span>
                                <div className="value">{selectedPatient.phoneNumber}</div>
                            </div>
                        </div>
                    </div>

                    <div className="form-body">
                        {testTemplate.sections.map((section, sIdx) => (
                            <div key={sIdx} className="form-section">
                                <h3 className="form-section-title">{section.title}</h3>

                                <div className="form-section-fields">
                                    {section.fields.map((field, fIdx) => {
                                        const key = `${sIdx}-${fIdx}`;
                                        const val = testResults[key] || "";
                                        const abnormal = this.isValueAbnormal(val, field.normal_range);

                                        return (
                                            <div key={fIdx} className={`form-field ${abnormal ? "abnormal" : ""}`}>
                                                <div className="field-info">
                                                    <label className="field-label">{field.label}</label>
                                                    <div className="field-normal-range">Bình thường: {field.normal_range}</div>
                                                </div>

                                                <div className="field-input-wrapper">
                                                    <input type="text" value={val} onChange={(e) => this.handleValueChange(sIdx, fIdx, e.target.value)} className="field-input" placeholder="Giá trị" />
                                                    {abnormal && <AlertCircle className="field-warning-icon" />}
                                                </div>

                                                <div className="field-unit">{field.unit}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="form-footer">
                        <div className="form-footer-status">
                            {savedStatus === "saved" && (
                                <span className="status saved">
                                    <CheckCircle className="status-icon" />
                                    Đã lưu kết quả thành công
                                </span>
                            )}

                            {savedStatus === "completed" && (
                                <span className="status completed">
                                    <CheckCircle className="status-icon" />
                                    Đã hoàn thành và gửi kết quả cho bệnh nhân
                                </span>
                            )}
                        </div>

                        <div className="form-footer-actions">
                            <button onClick={this.handleSave} className="btn-save">
                                <Save className="btn-icon" />
                                Lưu tạm
                            </button>

                            <button onClick={this.handleComplete} className="btn-complete">
                                <CheckCircle className="btn-icon" />
                                Hoàn thành khám
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const { currentView } = this.state;

        return (
            <div className="exam-package-result-manage-layout-wrapper">
                <div className="layout-header">
                    <div className="layout-header-container">
                        <h1 className="layout-title">Hệ thống quản lý kết quả xét nghiệm</h1>
                        <p className="layout-subtitle">Nhập và quản lý kết quả xét nghiệm cho bệnh nhân</p>
                    </div>
                </div>

                <div className="layout-body">
                    {currentView === "packages" && this.renderPackagesView()}
                    {currentView === "patients" && this.renderPatientsView()}
                    {currentView === "form" && this.renderFormView()}
                </div>
            </div>
        );
    }
}

export default ExamPackageResultManage;
