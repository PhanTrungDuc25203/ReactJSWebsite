import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import ScheduleAndTimetableManage from '../containers/System/Doctor/ScheduleAndTimetableManage';
import Header from '../containers/Header/Header';
import CustomScrollbars from '../components/CustomScrollbars';

class Doctor extends Component {
    render() {
        const { isLoggedIn } = this.props;
        return (
            <React.Fragment>
                <CustomScrollbars style={{ height: '100vh', width: '100%' }}>
                    {isLoggedIn && <Header />}
                    < div className="system-container" >
                        <div className="system-list">
                            <Switch>
                                <Route path="/doctor/schedule-manage" component={ScheduleAndTimetableManage} />
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

export default connect(mapStateToProps, mapDispatchToProps)(Doctor);
