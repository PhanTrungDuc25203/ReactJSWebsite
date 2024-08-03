import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
// import * as actions from "../store/actions";
import * as actions from "../../store/actions";
import './Login.scss';
import { FormattedMessage } from 'react-intl';


class Login extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        //JSX
        return (
            //hàm render chỉ render ra một khối, ví dụ thêm một <div> ở dưới nữa thì cần bọc 2 <div>
            //vào trong một <div> lớn hơn
            // <>
            //     <div>Hello i'm login page</div>
            //     <div>Please login here to continue</div>
            // </>


            //Bắt đầu code một trang login
            // khi code HTML thuần mà muốn cho chúng vào một lớp thì sử dụng thuộc tính class,
            // nhưng code react thì sử dụng thuộc tính className
            <div className="login-background">
                <div className="login-container">
                    <div className="login-contents row">
                        <div className="col-12 text-center login-text">Login</div>
                        <div className="col-12 form-group login-input">
                            <label>Username</label>
                            <input type="text" className="form-control input-place" placeholder="Piscean" />
                        </div>

                        <div className="col-12 form-group login-input">
                            <label>Password</label>
                            <input type="password" className="form-control input-place" placeholder="Enter your password" />
                        </div>

                        <div className="col-6">
                            <div class="wrapper">
                                <a href="#"><span>Login</span></a>
                            </div>
                        </div>


                        <div className="col-12">
                            <span className="forgot-password">For got your password?</span>
                        </div>
                        <div className="or-login-with-options">
                            <span>Or login with:</span>
                        </div>
                        <div className="more-login-options">
                            <div class="icon-container">
                                <i class="fab fa-google-plus-g"></i>
                            </div>
                            <div class="icon-container">
                                <i class="fab fa-facebook-f"></i>
                            </div>
                            <div class="icon-container">
                                <i class="fab fa-apple"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
        adminLoginSuccess: (adminInfo) => dispatch(actions.adminLoginSuccess(adminInfo)),
        adminLoginFail: () => dispatch(actions.adminLoginFail()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
