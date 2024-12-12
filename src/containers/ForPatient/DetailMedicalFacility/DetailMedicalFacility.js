import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import HomePageHeader from '../../HomePage/HomePageHeader/HomePageHeader';
import './DetailMedicalFacility.scss';
import HomeFooter from '../../HomePage/HomeFooter/HomeFooter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import { getInfoOfMedicalFacility } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
import CustomScrollbars from '../../../components/CustomScrollbars';
import _ from 'lodash';
import { MoonLoader } from 'react-spinners';
import defaultMedicalFacility from '../../../assets/images/default-medical-facility-avatar-lite-1.jpg';
import DoctorScheduleComponent from '../../ForPatient/DoctorScheduleComponent/DoctorScheduleComponent';
import PackageScheduleComponent from '../../ForPatient/PackageScheduleComponent/PackageScheduleComponent';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

class DetailMedicalFacility extends Component {

    constructor(props) {
        super(props);
        this.state = {
            medicalFacility: {},
            isLoading: true,
            spinnerType: 'MoonLoader',
            color: '#123abc',
            size: 25,
            activeSection: 'booking-appointment',
        }
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let res = await getInfoOfMedicalFacility(id);
            if (res && res.infor && res.infor[0]) {
                this.setState({
                    medicalFacility: res.infor[0],
                }, this.initializeMap);
            }
        }

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.setState({ activeSection: entry.target.id });
                }
            });
        }, { threshold: 0.1 }); // Sử dụng threshold để kiểm soát khi nào sẽ kích hoạt

        // Đăng ký các mục để theo dõi
        const sections = document.querySelectorAll('#booking-appointment, #general-introduction, #equipments, #specialty-area, #location, #exam-process');
        sections.forEach(section => this.observer.observe(section));
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    componentWillUnmount() {
        this.observer.disconnect();
    }

    initializeMap = async () => {
        const { medicalFacility } = this.state;
        console.log("Check location data: ", medicalFacility.address);
        const address = medicalFacility && medicalFacility.address;
        if (!address) return;

        // tạo săn ảnh của map là Trung tâm Hà Nội
        this.map = L.map('map-container').setView([21.028511, 105.804817], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        try {
            // Sử dụng Nominatim API để chuyển đổi địa chỉ thành tọa độ
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
            const data = await response.json();

            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                // Di chuyển bản đồ đến tọa độ tìm được
                this.map.setView([lat, lon], 15);
                // Thêm marker vào bản đồ
                L.marker([lat, lon]).addTo(this.map)
                    .bindPopup(`<b>${medicalFacility.name}</b><br>${address}`).openPopup();
            } else {
                console.warn('Không tìm thấy vị trí cho địa chỉ này.');
            }
        } catch (error) {
            console.error('Lỗi khi tìm kiếm vị trí:', error);
        }
    }


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
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    render() {
        let { medicalFacility, activeSection } = this.state;
        let imageByBase64 = '';
        if (medicalFacility && medicalFacility.image) {
            imageByBase64 = Buffer.from(medicalFacility.image, 'base64').toString('binary');
        }
        return (
            <React.Fragment>
                <CustomScrollbars style={{ height: '100vh', width: '100%' }}>
                    <HomePageHeader isShowBanner={false} />
                    <div className="medical-facility-article-container">
                        <div className="medical-facility-background-and-avatar-image">
                            <div className="background-container">
                                <div className="medical-facility-background"></div>
                            </div>
                            <div className="medical-facility-avatar-and-name">
                                <div className={imageByBase64 ? "avatar-css" : "default-avatar-css"}
                                    style={{ backgroundImage: `url(${imageByBase64 ? imageByBase64 : defaultMedicalFacility})` }}
                                ></div>
                                <div className="medical-facility-name-and-address">
                                    <div className="medical-facility-name">
                                        {medicalFacility && medicalFacility.name && medicalFacility.name}
                                    </div>
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
                                    <a onClick={() => this.scrollToSection('booking-appointment')} className={activeSection === 'booking-appointment' ? 'active' : ''}>Đặt lịch khám</a>
                                    <a onClick={() => this.scrollToSection('general-introduction')} className={activeSection === 'general-introduction' ? 'active' : ''}>Giới thiệu chung</a>
                                    <a onClick={() => this.scrollToSection('equipments')} className={activeSection === 'equipments' ? 'active' : ''}>Trang thiết bị</a>
                                    <a onClick={() => this.scrollToSection('specialty-area')} className={activeSection === 'specialty-area' ? 'active' : ''}>Chuyên ngành</a>
                                    <a onClick={() => this.scrollToSection('location')} className={activeSection === 'location' ? 'active' : ''}>Vị trí & Bản đồ</a>
                                    <a onClick={() => this.scrollToSection('exam-process')} className={activeSection === 'exam-process' ? 'active' : ''}>Quy trình khám</a>
                                </nav>
                            </header>
                        </div>

                        <div id="booking-appointment" className="medical-facility-booking-with-doctor-section">
                            {medicalFacility.medicalFacilityDoctorAndSpecialty && medicalFacility.medicalFacilityDoctorAndSpecialty.length > 0 &&
                                <label className="section-label">Các bác sĩ tại Cơ sở y tế</label>
                            }
                            {medicalFacility.medicalFacilityDoctorAndSpecialty && medicalFacility.medicalFacilityDoctorAndSpecialty.length > 0 &&
                                medicalFacility.medicalFacilityDoctorAndSpecialty.map((item, index) => {
                                    return (
                                        <div className="doctors-of-this-medical-facility" key={index}>
                                            <DoctorScheduleComponent doctorId={item.doctorId} />
                                        </div>
                                    )
                                }
                                )
                            }
                        </div>
                        <div className="medical-facility-booking-with-package-section">
                            {medicalFacility.medicalFacilityPackage && medicalFacility.medicalFacilityPackage.length > 0 &&
                                <label className="section-label">Các Gói khám tại Cơ sở y tế</label>
                            }
                            {medicalFacility.medicalFacilityPackage && medicalFacility.medicalFacilityPackage.length > 0 &&
                                medicalFacility.medicalFacilityPackage.map((item, index) => {
                                    return (
                                        <div className="doctors-of-this-medical-facility" key={index}>
                                            <PackageScheduleComponent packageId={item.id} />
                                        </div>
                                    )
                                }
                                )
                            }
                        </div>
                        <div className="medical-facility-booking-exam-package-section">
                            {medicalFacility.medicalFacilityExamPackage && medicalFacility.medicalFacilityExamPackage.length > 0 &&
                                <label className="section-label">Các gói khám của Cơ sở y tế</label>
                            }
                        </div>

                        <div id="general-introduction" className="medical-facility-introduction-section">
                            <label className="section-label">Giới thiệu Cơ sở y tế</label>
                            {medicalFacility?.htmlDescription &&
                                <div dangerouslySetInnerHTML={{ __html: medicalFacility.htmlDescription }} className="medical-facility-introduction-html"></div>
                            }
                        </div>
                        <div id="equipments" className="medical-facility-equipments-section">
                            <label className="section-label">Trang thiết bị của Cơ sở y tế</label>
                            {medicalFacility?.htmlEquipment &&
                                <div dangerouslySetInnerHTML={{ __html: medicalFacility.htmlEquipment }} className="medical-facility-equipments-html"></div>
                            }
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
                                <div id="map-container" style={{ height: '400px', width: '100%' }}></div>
                            </div>
                        </div>
                    </div>
                    <HomeFooter />
                </CustomScrollbars>
            </React.Fragment >

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

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailMedicalFacility);
