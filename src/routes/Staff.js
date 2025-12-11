import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import ExamPackageScheduleManage from "../containers/System/Staff/ExamPackageScheduleManage";
import ExamPackageResultManage from "../containers/System/Staff/ExamPackageResultManage";
import ExamPackageManage from "../containers/System/Staff/ExamPackageManage";
import ExamPackageResultTemplateManage from "../containers/System/Staff/ExamPackageResultTemplateManage";
import Header from "../containers/Header/Header";
import CustomScrollbars from "../components/CustomScrollbars";

class Staff extends Component {
    render() {
        const { isLoggedIn } = this.props;
        return (
            <React.Fragment>
                <CustomScrollbars style={{ height: "100vh", width: "100%" }}>
                    {isLoggedIn && <Header />}
                    <div className="system-container">
                        <div className="system-list">
                            <Switch>
                                <Route path="/staff/exampackage-manage" component={ExamPackageManage} />
                                <Route path="/staff/exampackage-schedule-manage" component={ExamPackageScheduleManage} />
                                <Route path="/staff/exampackage-result-manage" component={ExamPackageResultManage} />
                                <Route path="/staff/exampackage-result-template-manage" component={ExamPackageResultTemplateManage} />
                                <Route
                                    component={() => {
                                        return <Redirect to={"/staff/exampackage-manage"} />;
                                    }}
                                />
                            </Switch>
                        </div>
                    </div>
                </CustomScrollbars>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        isLoggedIn: state.user.isLoggedIn,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Staff);
