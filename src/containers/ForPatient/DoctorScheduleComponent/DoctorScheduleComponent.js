import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './DoctorScheduleComponent.scss';
import { getAllUsersToDisplayInReact, createNewUserService, deleteUserService, editUserService } from '../../services/userService'
import { emitter } from "../../utils/emitter";

class DoctorScheduleComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    state = {

    }

    async componentDidMount() {

    }


    render() {
        return (
            <div className="doctor-schedule-component">
                <div className="left-content">
                    <div className="avatar">

                    </div>
                    <div className="doctor-information">
                        <div className="name">

                        </div>
                        <div className="description">

                        </div>
                        <div className="address">

                        </div>
                    </div>
                </div>
                <div className="right-content">
                    <div className="schedule">

                    </div>
                    <div className="available-timeframe">

                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorScheduleComponent);
