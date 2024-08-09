import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
// import * as actions from "../store/actions";
import * as actions from "../../store/actions";
import './Login.scss';
import { FormattedMessage } from 'react-intl';
import { handleLoginAPI } from '../../services/userService';

class Login extends Component {
    constructor(props) {
        super(props);
        //khai báo trang thái của form login
        this.state = {
            //giá trị của props có thể là int String hoặc Object nhưng đối với 
            //state thì props luôn là object
            //cần 2 biến để component quản lý là usename và pass được nhập vào 
            username: '',
            password: '',
            passwordShown: false,
            errMessage: '',
        }
    }

    //xử lý sự kiện
    handleOnChangeUsernameInput = (event) => {
        //khi thao tác thay đổi input username trên web ta thấy nó in ra console
        //từng thay đổi (nhưng vì ko thể thay đổi chữ trong input nên nếu để lâu lại trở về ban đầu)
        //vì vậy ta cần hàm react xử lí việc cho phép thay đổi nôij dung nhập vào
        this.setState({
            username: event.target.value,
        })
        console.log(event.target.value);
    }

    handleOnChangePasswordInput = (event) => {
        this.setState({
            password: event.target.value,
        })
        console.log(event.target.value);
    }

    handleLoginButtonClicked = async (event) => {
        this.setState({
            errMessage: '',
        });


        //in ra thông báo xem nút input đã hoạt động chưa
        // alert('Are you sure about that');
        //in ra console những giá trị đã nhập ở 2 ô input
        // console.log('username: ', this.state.username, 'password: ', this.state.password);
        // //cách 2
        // console.log(this.state);

        try {
            let data = await handleLoginAPI(this.state.username, this.state.password);
            if (data && data.errCode !== 0) {
                this.setState({
                    errMessage: data.message,
                });
            }
            if (data && data.errCode === 0) {
                //đăng nhập thành công thì cần làm gì đó ở đây
                //cần sử dụng tới redux
                this.props.userLoginSuccess(data.user);
            }
        } catch (e) {
            if (e.response) {
                if (e.response.data) {
                    this.setState({
                        errMessage: e.response.data.message,
                    })
                }
            }
        }
    }

    handleShowAndHidePassword = (event) => {
        this.setState({
            passwordShown: !this.state.passwordShown,
        })
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
                            <input type="text"
                                className="form-control input-place"
                                placeholder="Piscean"
                                value={this.state.username}
                                onChange={(event) => this.handleOnChangeUsernameInput(event)} />
                            {/* value khiến cho ô input username luôn hiện gia trị của
                            biến username của state và không thể bị thay đổi
                            - onChange xử lý sự kiện */}
                        </div>

                        <div className="col-12 form-group login-input">
                            <label>Password</label>
                            <div className="password-input-and-eye">
                                <input type={this.state.passwordShown ? 'text' : 'password'}
                                    className="form-control input-place"
                                    placeholder="Enter your password"
                                    value={this.state.password}
                                    onChange={(event) => this.handleOnChangePasswordInput(event)} />
                                <span
                                    onClick={(event) => { this.handleShowAndHidePassword() }}>
                                    <i className={this.state.passwordShown ? "far fa-eye" : "far fa-eye-slash"}></i>
                                </span>

                            </div>
                        </div>
                        <div className="col-12 error-message-while-login">
                            {this.state.errMessage}
                        </div>
                        <div className="col-6">
                            <div className="wrapper">
                                <a href="#" onClick={(event) => { this.handleLoginButtonClicked() }}><span>Login</span></a>
                            </div>
                        </div>


                        <div className="col-12">
                            <span className="forgot-password">For got your password?</span>
                        </div>
                        <div className="or-login-with-options">
                            <span>Or login with:</span>
                        </div>
                        <div className="more-login-options">
                            <div className="icon-container">
                                <i className="fab fa-google-plus-g"></i>
                            </div>
                            <div className="icon-container">
                                <i className="fab fa-facebook-f"></i>
                            </div>
                            <div className="icon-container">
                                <i className="fab fa-apple"></i>
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
        // userLoginFail: () => dispatch(actions.adminLoginFail()),
        userLoginSuccess: (userInfor) => dispatch(actions.userLoginSuccess(userInfor)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
