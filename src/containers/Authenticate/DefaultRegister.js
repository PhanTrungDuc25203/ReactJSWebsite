import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { Route, Switch, Redirect } from "react-router-dom";
import * as actions from "../../store/actions";
import { path } from "../../utils";
import { FormattedMessage } from "react-intl";
import { handleLoginAPI } from "../../services/userService";
import CustomScrollbars from "../../components/CustomScrollbars";
import { withRouter } from "react-router";
import RegisterPersonalInfo from "./RegisterPersonalInfo/RegisterPersonalInfo";
import Register from "./Register";

class DefaultRegister extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <React.Fragment>
                <div className="register-route-container">
                    <div className="register-route-list">
                        <Switch>
                            <Route path={path.REGISTER_PERSONAL_INFO} component={RegisterPersonalInfo} />
                            <Route component={Register} />
                        </Switch>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        navigate: (path) => dispatch(push(path)),
        userLoginSuccess: (userInfor) => dispatch(actions.userLoginSuccess(userInfor)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DefaultRegister));
