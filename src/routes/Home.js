import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectTo: null,
        };
    }

    componentDidMount() {
        this.redirectUser();
    }

    componentDidUpdate(prevProps) {
        // Kiểm tra nếu props liên quan đến trạng thái đăng nhập hoặc thông tin người dùng thay đổi
        if (prevProps.isLoggedIn !== this.props.isLoggedIn || prevProps.userInfo !== this.props.userInfo) {
            this.redirectUser();
        }
    }

    redirectUser = () => {
        const { isLoggedIn, userInfo } = this.props;

        if (!isLoggedIn) {
            this.setState({ redirectTo: "/home" });
            return;
        }

        let linkToRedirect = "/home"; // default

        // Rule mới: Điều dưỡng nhập kết quả xét nghiệm
        if (userInfo.roleId === "R2" && userInfo.positionId === "P5") {
            linkToRedirect = "/staff/exampackage-manage";
        }
        // Quy tắc cũ
        else if (userInfo.roleId === "R3") {
            linkToRedirect = "/home";
        } else if (userInfo.roleId === "R2") {
            linkToRedirect = "/doctor/schedule-manage";
        } else {
            linkToRedirect = "/system/user-manage";
        }

        this.setState({ redirectTo: linkToRedirect });
    };

    render() {
        const { redirectTo } = this.state;

        if (redirectTo) {
            return <Redirect to={redirectTo} />;
        }

        return null; // Hoặc có thể thêm một số giao diện người dùng tạm thời ở đây nếu cần
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
