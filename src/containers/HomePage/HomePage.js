import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HomePage.scss';
import HomePageHeader from './HomePageHeader/HomePageHeader';
import SideBar from './SideBar/SideBar';
import SpecialtySection from './Section/SpecialtySection/SpecialtySection';
import ComprehensiveServiceSection from './Section/ComprehensiveServiceSection/ComprehensiveServiceSection';
import MedicalFacilitiesSection from './Section/MedicalFacilitiesSection/MedicalFacilitiesSection';
import EliteDoctorSection from './Section/EliteDoctorSection/EliteDoctorSection';
import AboutSection from './Section/AboutSection/AboutSection';
import HomeFooter from '../HomePage/HomeFooter/HomeFooter';

class HomePage extends Component {

    render() {

        return (
            <React.Fragment>
                <HomePageHeader />
                <ComprehensiveServiceSection />
                <SpecialtySection />
                <MedicalFacilitiesSection />
                <EliteDoctorSection />
                <AboutSection />
                <HomeFooter />
            </React.Fragment>


        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
