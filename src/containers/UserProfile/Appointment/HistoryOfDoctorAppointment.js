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

class HistoryOfDoctorAppointment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentUserEmail: '',
        }
    }

    async componentDidMount() {
        let { currentUserEmail } = this.state;
        if (this.props && this.props.currentUserEmail) {
            this.setState({ currentUserEmail })
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { currentUserEmail } = this.props;
        if (prevProps.currentUserEmail !== currentUserEmail) {
            this.setState({ currentUserEmail });
        }
    }

    render() {
        console.log("Check props: ", this.props);
        return (
            <div className="doctor-appointment-history-container">
                This is doctor {this.props.currentUserEmail} history
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

export default connect(mapStateToProps, mapDispatchToProps)(HistoryOfDoctorAppointment);
