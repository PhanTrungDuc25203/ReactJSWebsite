import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import HomePageHeader from '../../../HomePage/HomePageHeader/HomePageHeader';
import './MakeAppointmentPage.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { } from '@fortawesome/free-solid-svg-icons';
import { LANGUAGES } from '../../../../utils';
class MakeAppointmentPage extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    async componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    render() {

        return (
            <React.Fragment>
                <HomePageHeader />
                trang hẹn bác sĩ
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

export default connect(mapStateToProps, mapDispatchToProps)(MakeAppointmentPage);
