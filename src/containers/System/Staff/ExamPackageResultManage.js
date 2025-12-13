import React from "react";
import "./ExamPackageResultManage.scss";
import { Search, Save, CheckCircle, AlertCircle, User, Calendar, Clock, ArrowLeft, ChevronRight, Mail, Phone } from "lucide-react";
import { getResultPendingExamPackageService } from "../../../services/userService";
import moment from "moment";

class ExamPackageResultManage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: "packages", // "packages" | "patients" | "form"
            selectedPackage: null, // package object from packages[]
            selectedPatient: null, // patient object from patients[packageId]
            searchQuery: "",
            testResults: {},
            savedStatus: "",
            packages: [],
            patients: {}, // { [packageId]: [patient,...] }
            templatesMap: {}, // { [packageId]: templateObject }
            testTemplate: null, // currently selected template object (mirror of templatesMap[selectedPackage.id])
            loading: true,
        };
    }

    async componentDidMount() {
        // restore minimal ui state (ids only)
        const savedStateRaw = localStorage.getItem("EXAM_RESULT_VIEW");
        let savedState = null;
        try {
            if (savedStateRaw) savedState = JSON.parse(savedStateRaw);
        } catch (e) {
            console.warn("Invalid EXAM_RESULT_VIEW in localStorage, ignoring.");
            savedState = null;
        }

        try {
            const res = await getResultPendingExamPackageService(17);
            if (res && res.errCode === 0) {
                const raw = res.examPackageData || [];

                // build packages array
                const packages = raw.map((pkg) => ({
                    id: pkg.id,
                    name: pkg.name,
                    specialty: pkg.medicalFacilityPackage?.name || "Chưa rõ",
                    image: "🏥",
                    pendingCount: (pkg.bookings || []).filter((b) => b.statusId === "S2").length,
                }));

                // build patients map and templates map
                const patients = {};
                const templatesMap = {};

                raw.forEach((pkg) => {
                    // patients for this package
                    patients[pkg.id] = (pkg.bookings || []).map((b) => ({
                        id: b.patientId,
                        bookingId: b.id,
                        name: `${b.patientBookingExamPackageData?.firstName || ""} ${b.patientBookingExamPackageData?.lastName || ""}`.trim(),
                        email: b.patientBookingExamPackageData?.email || "",
                        phoneNumber: b.patientBookingExamPackageData?.phoneNumber || "",
                        gender: b.patientBookingExamPackageData?.gender === "M" ? "Nam" : "Nữ",
                        examDate: b.date,
                        statusId: b.statusId,
                        rawBooking: b,
                    }));

                    // parse template safely
                    const t = pkg.resultTemplates?.[0]?.template;
                    if (t) {
                        try {
                            const parsed = JSON.parse(t);
                            // minimal validation: must have sections array
                            if (parsed && Array.isArray(parsed.sections)) {
                                templatesMap[pkg.id] = parsed;
                            } else {
                                templatesMap[pkg.id] = null;
                                console.warn(`Template for package ${pkg.id} parsed but missing sections`);
                            }
                        } catch (err) {
                            templatesMap[pkg.id] = null;
                            console.error(`Error parsing template for package ${pkg.id}:`, err);
                        }
                    } else {
                        templatesMap[pkg.id] = null;
                    }
                });

                // Now restore UI state safely (only IDs stored)
                let restoredState = {
                    currentView: "packages",
                    selectedPackage: null,
                    selectedPatient: null,
                    testTemplate: null,
                };

                if (savedState && savedState.packageId) {
                    const pkgObj = packages.find((p) => p.id === savedState.packageId) || null;
                    const tpl = pkgObj ? templatesMap[pkgObj.id] || null : null;

                    if (pkgObj && tpl) {
                        // package exists and has valid template
                        restoredState.selectedPackage = pkgObj;
                        restoredState.testTemplate = tpl;

                        // try restore patient if present and valid
                        if (savedState.patientId) {
                            const pList = patients[pkgObj.id] || [];
                            const patientObj = pList.find((pt) => pt.id === savedState.patientId) || null;
                            if (patientObj) {
                                restoredState.selectedPatient = patientObj;
                                // respect saved view if it's 'form' else open patients list
                                restoredState.currentView = savedState.currentView === "form" ? "form" : "patients";
                            } else {
                                // patient not found -> open patients list
                                restoredState.currentView = "patients";
                                restoredState.selectedPatient = null;
                            }
                        } else {
                            // no patient id saved -> open patients list
                            restoredState.currentView = "patients";
                        }
                    } else {
                        // Either package missing or template missing -> go to packages list
                        restoredState.currentView = "packages";
                    }
                }

                this.setState({
                    packages,
                    patients,
                    templatesMap,
                    loading: false,
                    currentView: restoredState.currentView,
                    selectedPackage: restoredState.selectedPackage,
                    selectedPatient: restoredState.selectedPatient,
                    testTemplate: restoredState.testTemplate,
                });
            } else {
                // API returned non-ok
                this.setState({ loading: false });
            }
        } catch (err) {
            console.error("API error:", err);
            this.setState({ loading: false });
        }
    }

    // Save only ids to localStorage
    saveUIState = () => {
        const { currentView, selectedPackage, selectedPatient } = this.state;
        const uiState = {
            currentView,
            packageId: selectedPackage?.id || null,
            patientId: selectedPatient?.id || null,
        };
        try {
            localStorage.setItem("EXAM_RESULT_VIEW", JSON.stringify(uiState));
        } catch (e) {
            console.warn("Unable to save UI state to localStorage", e);
        }
    };

    handleSelectPackage = (pkg) => {
        const template = this.state.templatesMap[pkg.id] || null;
        this.setState(
            {
                selectedPackage: pkg,
                currentView: "patients",
                searchQuery: "",
                testTemplate: template,
                selectedPatient: null,
                testResults: {},
            },
            this.saveUIState
        );
    };

    handleSelectPatient = (patient) => {
        // ensure template exists before going to form; if not, show patients list
        const { selectedPackage, templatesMap } = this.state;
        const tpl = selectedPackage ? templatesMap[selectedPackage.id] || null : null;

        if (!tpl) {
            // template missing; keep user in patients view and warn
            this.setState({ savedStatus: "no-template" });
            setTimeout(() => this.setState({ savedStatus: "" }), 2500);
            return;
        }

        this.setState(
            {
                selectedPatient: patient,
                currentView: "form",
                testResults: {},
                testTemplate: tpl,
            },
            this.saveUIState
        );
    };

    handleBackToPackages = () => {
        this.setState(
            {
                currentView: "packages",
                selectedPackage: null,
                selectedPatient: null,
                searchQuery: "",
                testResults: {},
                savedStatus: "",
                testTemplate: null,
            },
            this.saveUIState
        );
    };

    handleBackToPatients = () => {
        this.setState(
            {
                currentView: "patients",
                selectedPatient: null,
                testResults: {},
                savedStatus: "",
            },
            this.saveUIState
        );
    };

    handleValueChange = (sectionIndex, fieldIndex, value) => {
        this.setState((prevState) => ({
            testResults: {
                ...prevState.testResults,
                [`${sectionIndex}-${fieldIndex}`]: value,
            },
        }));
    };

    handleComplete = () => {
        const { selectedPackage, selectedPatient, testResults, testTemplate } = this.state;

        if (!selectedPackage || !selectedPatient) {
            alert("Thiếu thông tin gói hoặc bệnh nhân.");
            return;
        }

        const payload = {
            packageId: selectedPackage.id,
            patientId: selectedPatient.id,
            bookingId: selectedPatient.bookingId,
            results: testResults,
            template: testTemplate,
        };

        console.log("Dữ liệu gửi BE:", payload);
        alert("Đã in payload vào console. Bạn tự gọi API BE nhé.");
        this.setState({ savedStatus: "completed" });
        this.saveUIState();
    };

    // Simplified abnormal detection; safe against weird normal_range strings
    isValueAbnormal = (value, normalRange) => {
        if (value === null || value === undefined || value === "") return false;
        if (!normalRange || typeof normalRange !== "string") return false;
        const numValue = parseFloat(String(value).replace(",", "."));
        if (isNaN(numValue)) return false;

        // range formats we try to handle:
        // "min - max" or "min – max" or "min–max" or "Nam: x – y / Nữ: a – b"
        // "< x"
        // If parsing fails, return false (not consider abnormal)
        try {
            // handle "< max"
            const trimmed = normalRange.trim();
            if (trimmed.startsWith("<")) {
                const max = parseFloat(trimmed.replace("<", "").trim());
                if (!isNaN(max)) return numValue >= max;
                return false;
            }

            // if contains '/', split choices (e.g., "Nam: ... / Nữ: ...")
            const parts = trimmed.split("/").map((p) => p.trim());
            for (let p of parts) {
                // find first range "number - number" or "number – number"
                const m = p.match(/([\d.]+)\s*[–-]\s*([\d.]+)/);
                if (m) {
                    const min = parseFloat(m[1]);
                    const max = parseFloat(m[2]);
                    if (!isNaN(min) && !isNaN(max)) {
                        if (numValue < min || numValue > max) {
                            // if outside any found range, keep checking other parts; only when one part matches we return false
                            // we'll return true (abnormal) only if none of the range parts contain the value
                        } else {
                            return false; // inside a valid range -> not abnormal
                        }
                    }
                } else {
                    // try single numeric comparators? ignore for now
                }
            }
            // if we reach here, no matching range contained the value => mark abnormal
            return true;
        } catch (e) {
            return false;
        }
    };

    // Views
    renderPackagesView() {
        const { packages, searchQuery, loading } = this.state;
        if (loading) {
            return <div style={{ padding: 20 }}>Đang tải danh sách gói khám...</div>;
        }

        const q = (searchQuery || "").toLowerCase();
        const filteredPackages = packages.filter((pkg) => pkg.name.toLowerCase().includes(q) || (pkg.specialty || "").toLowerCase().includes(q));

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
                                <div className="card-image">{pkg?.image}</div>
                                <div className="card-info">
                                    <h3 className="package-name">{pkg?.name}</h3>
                                    <p className="package-specialty">{pkg?.specialty}</p>

                                    <div className="card-row">
                                        <div className="pending-badge">
                                            <Clock className="clock-icon" />
                                            {pkg?.pendingCount} bệnh nhân chờ
                                        </div>
                                        <ChevronRight className="arrow-icon" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredPackages.length === 0 && <div style={{ padding: 16 }}>Không có gói khám phù hợp.</div>}
                </div>
            </div>
        );
    }

    renderPatientsView() {
        const { selectedPackage, patients, searchQuery } = this.state;
        if (!selectedPackage) {
            // safety: if user somehow landed here without package, go back to packages
            return (
                <div style={{ padding: 20 }}>
                    Gói khám không hợp lệ. <button onClick={this.handleBackToPackages}>Quay lại danh sách gói khám</button>
                </div>
            );
        }

        const packagePatients = patients[selectedPackage.id] || [];
        const q = (searchQuery || "").toLowerCase();
        const filteredPatients = packagePatients.filter((patient) => (patient.name || "").toLowerCase().includes(q) || (patient.email || "").toLowerCase().includes(q) || (patient.phoneNumber || "").includes(searchQuery || ""));

        return (
            <div className="patients-view">
                <button onClick={this.handleBackToPackages} className="back-button">
                    <ArrowLeft className="back-icon" />
                    Quay lại danh sách gói khám
                </button>

                <div className="selected-package-card">
                    <div className="package-header">
                        <div className="package-image">{selectedPackage?.image}</div>
                        <div className="package-info">
                            <h2 className="package-title">{selectedPackage?.name}</h2>
                            <p className="package-subtitle">{selectedPackage?.specialty}</p>
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
                                        <h3 className="patient-name">{patient?.name}</h3>

                                        <div className="patient-details-grid">
                                            <div className="detail-row">
                                                <Mail className="detail-icon" />
                                                {patient?.email}
                                            </div>

                                            <div className="detail-row">
                                                <Phone className="detail-icon" />
                                                {patient?.phoneNumber}
                                            </div>

                                            <div className="detail-row">
                                                <User className="detail-icon" />
                                                {patient?.gender}
                                            </div>

                                            <div className="detail-row">
                                                <Calendar className="detail-icon" />
                                                {patient?.examDate ? moment(patient.examDate).format("DD-MM-YYYY") : ""}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="patient-status">
                                    {patient?.statusId === "S3" ? <span className="status-done">Đã hoàn thành</span> : <span className="status-pending">Chờ kết quả</span>}
                                    <ChevronRight className="arrow-icon" />
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredPatients.length === 0 && <div style={{ padding: 16 }}>Không có bệnh nhân phù hợp.</div>}
                </div>
            </div>
        );
    }

    renderFormView() {
        const { selectedPatient, testTemplate, testResults, savedStatus } = this.state;

        // Guard: nếu template chưa sẵn sàng hoặc patient null, show message (không crash)
        if (!testTemplate) {
            return (
                <div style={{ padding: 20 }}>
                    Mẫu kết quả chưa sẵn sàng cho gói khám này.
                    <div style={{ marginTop: 12 }}>
                        <button onClick={this.handleBackToPatients}>Quay lại danh sách bệnh nhân</button>
                    </div>
                </div>
            );
        }

        if (!selectedPatient) {
            return (
                <div style={{ padding: 20 }}>
                    Bệnh nhân không hợp lệ.
                    <div style={{ marginTop: 12 }}>
                        <button onClick={this.handleBackToPatients}>Quay lại danh sách bệnh nhân</button>
                    </div>
                </div>
            );
        }

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
                                <div className="value">{selectedPatient?.name}</div>
                            </div>

                            <div className="form-header-item">
                                <span className="label">Giới tính:</span>
                                <div className="value">{selectedPatient?.gender}</div>
                            </div>

                            <div className="form-header-item">
                                <span className="label">Ngày khám:</span>
                                <div className="value">{selectedPatient?.examDate ? moment(selectedPatient.examDate).format("DD-MM-YYYY") : ""}</div>
                            </div>

                            <div className="form-header-item">
                                <span className="label">Email:</span>
                                <div className="value">{selectedPatient?.email}</div>
                            </div>

                            <div className="form-header-item">
                                <span className="label">Số điện thoại:</span>
                                <div className="value">{selectedPatient?.phoneNumber}</div>
                            </div>
                        </div>
                    </div>

                    <div className="form-body">
                        {testTemplate.sections.map((section, sIdx) => (
                            <div key={sIdx} className="form-section">
                                <h3 className="form-section-title">{section?.title}</h3>

                                <div className="form-section-fields">
                                    {Array.isArray(section.fields) &&
                                        section.fields.map((field, fIdx) => {
                                            const key = `${sIdx}-${fIdx}`;
                                            const val = testResults[key] || "";
                                            const abnormal = this.isValueAbnormal(val, field?.normal_range);

                                            return (
                                                <div key={fIdx} className={`form-field ${abnormal ? "abnormal" : ""}`}>
                                                    <div className="field-info">
                                                        <label className="field-label">{field?.label}</label>
                                                        <div className="field-normal-range">Bình thường: {field?.normal_range}</div>
                                                    </div>

                                                    <div className="field-input-wrapper">
                                                        <input type="text" value={val} onChange={(e) => this.handleValueChange(sIdx, fIdx, e.target.value)} className="field-input" placeholder="Giá trị" />
                                                        {abnormal && <AlertCircle className="field-warning-icon" />}
                                                    </div>

                                                    <div className="field-unit">{field?.unit}</div>
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

                            {savedStatus === "no-template" && <span className="status warning">Mẫu kết quả chưa có hoặc không hợp lệ.</span>}
                        </div>

                        <div className="form-footer-actions">
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
        console.log("DEBUG STATE:", this.state);

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
