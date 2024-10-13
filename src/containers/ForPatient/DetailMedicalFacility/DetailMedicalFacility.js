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

class DetailMedicalFacility extends Component {

    constructor(props) {
        super(props);
        this.state = {
            medicalFacility: {},
            isLoading: true,
            spinnerType: 'MoonLoader',
            color: '#123abc',
            size: 25,
        }
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;

            let res = await getInfoOfMedicalFacility(id);
            if (res && res.infor && res.infor[0]) {
                this.setState({
                    medicalFacility: res.infor[0],
                })
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

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

    render() {
        console.log("check state: ", this.state.medicalFacility);
        let { medicalFacility } = this.state;
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
                                        {medicalFacility && medicalFacility.provinceTypeDataForFacility && medicalFacility.provinceTypeDataForFacility.value_Vie && medicalFacility.provinceTypeDataForFacility.value_Vie}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="medical-facility-booking-with-doctor-section">
                            {medicalFacility.medicalFacilityHaveSpecialtyAndDoctor && medicalFacility.medicalFacilityHaveSpecialtyAndDoctor.length > 0 &&
                                medicalFacility.medicalFacilityHaveSpecialtyAndDoctor.map((item, index) => {
                                    return (
                                        <div className="doctors-of-this-medical-facility" key={index}>
                                            <DoctorScheduleComponent doctorId={item.doctorId} />
                                        </div>
                                    )
                                }
                                )
                            }
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
