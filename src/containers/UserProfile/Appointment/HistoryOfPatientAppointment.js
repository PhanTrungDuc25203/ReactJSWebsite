import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import './HistoryOfAppointment.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { } from '@fortawesome/free-solid-svg-icons';
import { LANGUAGES } from '../../../utils';
import _ from 'lodash';
import * as actions from "../../../store/actions";
import { MoonLoader } from 'react-spinners';
import moment from 'moment';

class HistoryOfPatientAppointment extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    async componentDidMount() {
        if (this.props && this.props.combinedAppointments && this.props.userRole) {

        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.combinedAppointments !== this.props.combinedAppointments && prevProps.userRole !== this.props.userRole) {

        }
    }

    render() {
        console.log("Check props: ", this.props);
        return (
            <div className="patient-appointment-history-container">
                This is patient history
            </div >
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
        processLogout: () => dispatch(actions.processLogout()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HistoryOfPatientAppointment);
