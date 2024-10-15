import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import UserManage from '../containers/System/UserManage';
import UserManageByRedux from '../containers/System/Admin/UserManageByRedux';
import MedicalFacilityManage from '../containers/System/Admin/MedicalFacilityManage/MedicalFacilityManage';
// import RegisterPackageGroupOrAcc from '../containers/System/RegisterPackageGroupOrAcc';
import Header from '../containers/Header/Header';
import DoctorManage from '../containers/System/Admin/DoctorManageByRedux/DoctorManage';
import SpecialtyManage from '../containers/System/Specialty/SpecialtyManage';
import CustomScrollbars from '../components/CustomScrollbars';
import ExamPackageManage from '../containers/System/Admin/ExamPackageManage/ExamPackageManage';

class System extends Component {
    render() {
        const { systemMenuPath, isLoggedIn } = this.props;
        return (
            <React.Fragment>
                <CustomScrollbars style={{ height: '100vh', width: '100%' }}>
                    {isLoggedIn && <Header />}
                    < div className="system-container" >
                        <div className="system-list">
                            <Switch>
                                <Route path="/system/user-manage" component={UserManage} />
                                <Route path="/system/user-manage-by-redux" component={UserManageByRedux} />
                                <Route path="/system/doctor-manage-by-redux" component={DoctorManage} />
                                <Route path="/system/specialty-manage" component={SpecialtyManage} />
                                <Route path="/system/medical-facilities-manage" component={MedicalFacilityManage} />
                                <Route path="/system/exam-package-manage" component={ExamPackageManage} />
                                <Route component={() => { return (<Redirect to={systemMenuPath} />) }} />
                            </Switch>
                        </div>
                    </div >
                </CustomScrollbars>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        isLoggedIn: state.user.isLoggedIn

    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(System);
