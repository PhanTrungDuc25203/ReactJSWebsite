import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import HomePageHeader from '../../../HomePage/HomePageHeader/HomePageHeader';
import './AllMedicalFacilities.scss';
import HomeFooter from '../../../HomePage/HomeFooter/HomeFooter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import { getInfoOfMedicalFacility } from '../../../../services/userService';
import { LANGUAGES } from '../../../../utils';
import CustomScrollbars from '../../../../components/CustomScrollbars';
import DoctorScheduleComponent from '../../DoctorScheduleComponent/DoctorScheduleComponent';
import _ from 'lodash';
import { MoonLoader } from 'react-spinners';

class AllMedicalFacilities extends Component {

    constructor(props) {
        super(props);
        this.state = {
            allMedicalFacilityData: [],
        }
    }

    async componentDidMount() {
        let res = await getInfoOfMedicalFacility('ALLANDIMAGEBUTSHORT');
        if (res.errCode === 0) {
            this.setState({
                allMedicalFacilityData: res.infor,
            })
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

        let { language } = this.props;
        let { allMedicalFacilityData } = this.state;

        return (
            <React.Fragment>
                <CustomScrollbars style={{ height: '100vh', width: '100%' }}>
                    <HomePageHeader isShowBanner={false} />
                    <div className="all-medical-facilities-container">
                        <div className="all-medical-facilities-container-title">
                            Bệnh viện & Cơ sở y tế
                        </div>
                        {allMedicalFacilityData && allMedicalFacilityData.length > 0 &&
                            allMedicalFacilityData.map((item, index) => {
                                return (
                                    <div className="medical-facility-item-container" key={index}
                                    // onClick={() => this.handleViewDetailArticleOfAFacility(item.id)}
                                    >
                                        <div className="medical-facility-item">
                                            <div className="image image-css">

                                            </div>
                                            <div className="medical-facility-name">
                                                {item.name}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <HomeFooter />
                </CustomScrollbars>
            </React.Fragment >

        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AllMedicalFacilities);