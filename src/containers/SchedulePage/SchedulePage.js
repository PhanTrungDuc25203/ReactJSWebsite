import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions";

class SchedulePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuApp: [],
        };
    }

    componentDidMount() {}

    render() {
        return <div className="schedule-page-container">This is shedule page</div>;
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
        switchLanguageOfWebsite: (language) => dispatch(actions.switchLanguageOfWebsite(language)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SchedulePage);
