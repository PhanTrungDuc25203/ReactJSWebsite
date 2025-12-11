import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import HomePageHeader from "../../HomePage/HomePageHeader/HomePageHeader";
import "./DetailMedicalFacility.scss";
import HomeFooter from "../../HomePage/HomeFooter/HomeFooter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapLocationDot, faRoute } from "@fortawesome/free-solid-svg-icons";
import { getInfoOfMedicalFacility } from "../../../services/userService";
import { LANGUAGES } from "../../../utils";
import CustomScrollbars from "../../../components/CustomScrollbars";
import _ from "lodash";
import { MoonLoader } from "react-spinners";
import defaultMedicalFacility from "../../../assets/images/default-medical-facility-avatar-lite-1.jpg";
import DoctorScheduleComponent from "../../ForPatient/DoctorScheduleComponent/DoctorScheduleComponent";
import PackageScheduleComponent from "../../ForPatient/PackageScheduleComponent/PackageScheduleComponent";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

class DetailMedicalFacility extends Component {
    constructor(props) {
        super(props);
        this.state = {
            medicalFacility: {},
            isLoading: true,
            spinnerType: "MoonLoader",
            color: "#123abc",
            size: 25,
            activeSection: "booking-appointment",
        };
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let res = await getInfoOfMedicalFacility(id);
            if (res && res.infor && res.infor[0]) {
                this.setState(
                    {
                        medicalFacility: res.infor[0],
                    },
                    this.initializeMap
                );
            }
        }

        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        this.setState({ activeSection: entry.target.id });
                    }
                });
            },
            { threshold: 0.1 }
        ); // Sử dụng threshold để kiểm soát khi nào sẽ kích hoạt

        // Đăng ký các mục để theo dõi
        const sections = document.querySelectorAll("#booking-appointment, #general-introduction, #equipments, #specialty-area, #location, #exam-process");
        sections.forEach((section) => this.observer.observe(section));
    }

    componentDidUpdate(prevProps, prevState, snapshot) {}

    componentWillUnmount() {
        this.observer.disconnect();
    }

    initializeMap = async () => {
        const { medicalFacility } = this.state;
        if (!medicalFacility) return;

        const { latitude, longitude, name, address } = medicalFacility;

        // Nếu thiếu lat/lon thì không load map
        if (!latitude || !longitude) {
            console.warn("Thiếu tọa độ lat/lon của cơ sở y tế");
            return;
        }

        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);

        // 1. Khởi tạo map (center tạm thời)
        this.map = L.map("map-container").setView([lat, lon], 15);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
        }).addTo(this.map);

        // 2. Fix marker default icon
        const defaultIcon = L.icon({
            iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
            iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
            shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
        });
        L.Marker.prototype.options.icon = defaultIcon;

        // 3. Marker cơ sở y tế
        L.marker([lat, lon]).addTo(this.map).bindPopup(`
        <b>${name}</b><br>${address || ""}
    `);

        // Center map
        this.map.setView([lat, lon], 15);

        // 4. Vị trí người dùng (icon mũi tên)
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(
                (pos) => {
                    const userLat = pos.coords.latitude;
                    const userLon = pos.coords.longitude;

                    const userIcon = L.icon({
                        iconUrl: "https://cdn-icons-png.flaticon.com/512/60/60525.png",
                        iconSize: [30, 30],
                        iconAnchor: [15, 15],
                    });

                    if (!this.userMarker) {
                        this.userMarker = L.marker([userLat, userLon], { icon: userIcon }).addTo(this.map);
                    } else {
                        this.userMarker.setLatLng([userLat, userLon]);
                    }
                },
                (err) => console.warn("Không lấy được vị trí người dùng", err),
                { enableHighAccuracy: true }
            );
        }

        // 5. Nút "Dẫn đường"
        const routeBtn = L.control({ position: "topleft" });
        routeBtn.onAdd = () => {
            const btn = L.DomUtil.create("button", "route-btn");
            btn.innerHTML = `➤`;
            btn.style.padding = "8px 12px";
            btn.style.background = "#007bff";
            btn.style.color = "#fff";
            btn.style.border = "none";
            btn.style.borderRadius = "6px";
            btn.style.cursor = "pointer";

            btn.onclick = () => this.startRouting(lat, lon);
            return btn;
        };
        routeBtn.addTo(this.map);
    };

    // ==========================
    // Hàm startRouting: chỉ chạy khi user bấm nút
    // ==========================
    startRouting = (destLat, destLon) => {
        if (!navigator.geolocation) {
            alert("Trình duyệt không hỗ trợ GPS");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const userLat = pos.coords.latitude;
                const userLon = pos.coords.longitude;

                // Xóa routing cũ nếu đã có
                if (this.routingControl) {
                    this.map.removeControl(this.routingControl);
                }

                // Thêm routing mới
                this.routingControl = L.Routing.control({
                    waypoints: [L.latLng(userLat, userLon), L.latLng(destLat, destLon)],
                    lineOptions: { styles: [{ color: "blue", weight: 5 }] },
                    addWaypoints: false,
                    draggableWaypoints: false,
                    routeWhileDragging: false,
                    showAlternatives: false,
                }).addTo(this.map);
            },
            () => alert("Không lấy được vị trí hiện tại.")
        );
    };

    handleSpinnerTypeChange = (event) => {
        this.setState({ spinnerType: event.target.value });
    };

    handleColorChange = (event) => {
        this.setState({ color: event.target.value });
    };

    handleSizeChange = (event) => {
        this.setState({ size: parseInt(event.target.value, 10) });
    };

    scrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    render() {
        let { medicalFacility, activeSection } = this.state;
        let imageByBase64 = "";
        if (medicalFacility && medicalFacility.image) {
            imageByBase64 = Buffer.from(medicalFacility.image, "base64").toString("binary");
        }
        return (
            <React.Fragment>
                <CustomScrollbars style={{ height: "100vh", width: "100%" }}>
                    <HomePageHeader isShowBanner={false} />
                    <div className="medical-facility-article-container">
                        <div className="medical-facility-background-and-avatar-image">
                            <div className="background-container">
                                <div className="medical-facility-background"></div>
                            </div>
                            <div className="medical-facility-avatar-and-name">
                                <div
                                    className={imageByBase64 ? "avatar-css" : "default-avatar-css"}
                                    style={{
                                        backgroundImage: `url(${imageByBase64 ? imageByBase64 : defaultMedicalFacility})`,
                                    }}
                                ></div>
                                <div className="medical-facility-name-and-address">
                                    <div className="medical-facility-name">{medicalFacility && medicalFacility.name && medicalFacility.name}</div>
                                    <div className="medical-facility-address">
                                        <FontAwesomeIcon className="location-icon" icon={faMapLocationDot} />
                                        {medicalFacility && medicalFacility.address && medicalFacility.address}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="medical-facility-scrollspy-menu">
                            <header className="scrollspy-menu-header">
                                <nav className="facility-scrollspy-menu-navigation">
                                    <a onClick={() => this.scrollToSection("booking-appointment")} className={activeSection === "booking-appointment" ? "active" : ""}>
                                        Đặt lịch khám
                                    </a>
                                    <a onClick={() => this.scrollToSection("general-introduction")} className={activeSection === "general-introduction" ? "active" : ""}>
                                        Giới thiệu chung
                                    </a>
                                    <a onClick={() => this.scrollToSection("equipments")} className={activeSection === "equipments" ? "active" : ""}>
                                        Trang thiết bị
                                    </a>
                                    <a onClick={() => this.scrollToSection("specialty-area")} className={activeSection === "specialty-area" ? "active" : ""}>
                                        Chuyên ngành
                                    </a>
                                    <a onClick={() => this.scrollToSection("location")} className={activeSection === "location" ? "active" : ""}>
                                        Vị trí & Bản đồ
                                    </a>
                                    <a onClick={() => this.scrollToSection("exam-process")} className={activeSection === "exam-process" ? "active" : ""}>
                                        Quy trình khám
                                    </a>
                                </nav>
                            </header>
                        </div>

                        <div id="booking-appointment" className="medical-facility-booking-with-doctor-section">
                            {medicalFacility.medicalFacilityDoctorAndSpecialty && medicalFacility.medicalFacilityDoctorAndSpecialty.length > 0 && <label className="section-label">Các bác sĩ tại Cơ sở y tế</label>}
                            {medicalFacility.medicalFacilityDoctorAndSpecialty &&
                                medicalFacility.medicalFacilityDoctorAndSpecialty.length > 0 &&
                                medicalFacility.medicalFacilityDoctorAndSpecialty.map((item, index) => {
                                    return (
                                        <div className="doctors-of-this-medical-facility" key={index}>
                                            <DoctorScheduleComponent doctorId={item.doctorId} />
                                        </div>
                                    );
                                })}
                        </div>
                        <div className="medical-facility-booking-with-package-section">
                            {medicalFacility.medicalFacilityPackage && medicalFacility.medicalFacilityPackage.length > 0 && <label className="section-label">Các Gói khám tại Cơ sở y tế</label>}
                            {medicalFacility.medicalFacilityPackage &&
                                medicalFacility.medicalFacilityPackage.length > 0 &&
                                medicalFacility.medicalFacilityPackage.map((item, index) => {
                                    return (
                                        <div className="doctors-of-this-medical-facility" key={index}>
                                            <PackageScheduleComponent packageId={item.id} />
                                        </div>
                                    );
                                })}
                        </div>
                        <div className="medical-facility-booking-exam-package-section">{medicalFacility.medicalFacilityExamPackage && medicalFacility.medicalFacilityExamPackage.length > 0 && <label className="section-label">Các gói khám của Cơ sở y tế</label>}</div>

                        <div id="general-introduction" className="medical-facility-introduction-section">
                            <label className="section-label">Giới thiệu Cơ sở y tế</label>
                            {medicalFacility?.htmlDescription && (
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: medicalFacility.htmlDescription,
                                    }}
                                    className="medical-facility-introduction-html"
                                ></div>
                            )}
                        </div>
                        <div id="equipments" className="medical-facility-equipments-section">
                            <label className="section-label">Trang thiết bị của Cơ sở y tế</label>
                            {medicalFacility?.htmlEquipment && (
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: medicalFacility.htmlEquipment,
                                    }}
                                    className="medical-facility-equipments-html"
                                ></div>
                            )}
                        </div>
                        <div id="specialty-area" className="medical-facility-specialty-area-section">
                            <label className="section-label">Thế mạnh chuyên môn</label>
                            {medicalFacility.medicalFacilitySpecialtyData && medicalFacility.medicalFacilitySpecialtyData.length > 0 ? (
                                <ul>
                                    {medicalFacility.medicalFacilitySpecialtyData.map((item, index) => (
                                        <li key={index}>
                                            <span>{item.medicalFacilityHaveSpecialty.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>Không có thông tin thế mạnh chuyên môn.</p>
                            )}
                        </div>
                        <div id="location" className="medical-facility-map-section">
                            <label className="section-label">Bản đồ & Vị trí</label>
                            <div className="map-frame">
                                <div id="map-container" style={{ height: "400px", width: "100%" }}></div>
                            </div>
                        </div>
                    </div>
                    <HomeFooter />
                </CustomScrollbars>
            </React.Fragment>
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
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailMedicalFacility);
