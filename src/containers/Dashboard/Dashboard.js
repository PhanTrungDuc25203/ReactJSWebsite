import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import HomePageHeader from "../HomePage/HomePageHeader/HomePageHeader";
import CustomScrollbars from "../../components/CustomScrollbars";
import FooterLite from "../../containers/HomePage/HomeFooter/FooterLite";
import "./Dashboard.scss";
import DashboardForDoctor from "./DashboardForDoctor";
import DashboardForPatient from "./DashboardForPatient";

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: "",
        };
    }

    componentDidMount() {
        if (this.props?.userInfo) {
            this.setState({
                currentUser: this.props.userInfo,
            });
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.userInfo !== this.props.userInfo) {
            this.setState({
                currentUser: this.props.userInfo,
            });
        }
    }

    render() {
        let { currentUser } = this.state;
        return (
            <CustomScrollbars style={{ height: "100vh", width: "100%" }}>
                <HomePageHeader isShowBanner={false} />
                {currentUser.roleId === "R2" && <DashboardForDoctor />}
                {currentUser.roleId === "R3" && <DashboardForPatient />}
                <FooterLite />
            </CustomScrollbars>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard));
