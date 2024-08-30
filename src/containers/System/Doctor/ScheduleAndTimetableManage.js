import React, { Component } from 'react';
import { connect } from "react-redux";


class ScheduleAndTimetableManage extends Component {
    render() {
        return (
            <React.Fragment>
                <div>
                    doctor's schedule and timetable manage
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleAndTimetableManage);
