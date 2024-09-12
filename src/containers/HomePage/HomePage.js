import React, { Suspense, lazy } from 'react';
import { useSelector } from 'react-redux';
import './HomePage.scss';
import HomePageHeader from './HomePageHeader/HomePageHeader';
import HomeFooter from './HomeFooter/HomeFooter';

// Lazy loading các section
import SideBar from './SideBar/SideBar';
const SpecialtySection = lazy(() => import('./Section/SpecialtySection/SpecialtySection'));
const ComprehensiveServiceSection = lazy(() => import('./Section/ComprehensiveServiceSection/ComprehensiveServiceSection'));
const MedicalFacilitiesSection = lazy(() => import('./Section/MedicalFacilitiesSection/MedicalFacilitiesSection'));
const EliteDoctorSection = lazy(() => import('./Section/EliteDoctorSection/EliteDoctorSection'));
const RecentDiseaseSection = lazy(() => import('./Section/RecentDiseaseSection/RecentDiseaseSection'));
const RemoteExamSection = lazy(() => import('./Section/RemoteExamSection/RemoteExamSection'));
const MentalHealthSection = lazy(() => import('./Section/MentalHealthSection/MentalHealthSection'));
const StayAHealthyLifeSection = lazy(() => import('./Section/StayAHealthyLifeSection/StayAHealthyLifeSection'));

const HomePage = () => {
    const isLoggedIn = useSelector(state => state.user.isLoggedIn); // Sử dụng useSelector để lấy trạng thái

    return (
        <React.Fragment>
            <HomePageHeader isShowBanner={true} />
            <Suspense fallback={<div>Loading...</div>}>
                <ComprehensiveServiceSection />
                <SpecialtySection />
                <MedicalFacilitiesSection />
                <EliteDoctorSection />
                <RemoteExamSection />
                <MentalHealthSection />
                <RecentDiseaseSection />
                <StayAHealthyLifeSection />
            </Suspense>

            <HomeFooter />
        </React.Fragment>
    );
};

export default HomePage;
