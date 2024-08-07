import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './UserManage.scss';
import { getAllUsersToDisplayInReact } from '../../services/userService'

class UserManage extends Component {
    constructor(props) {
        //khi component được render thì nó sẽ check hàm constructor đầu tiên
        super(props);
        //khởi tạo những trạng thais state muốn dùng với class này
        this.state = {
            //lưu giá trị để hiển thị
            arrUsers: [],
        }
    }
    state = {

    }

    async componentDidMount() {
        let response = await getAllUsersToDisplayInReact('ALL');
        if (response && response.errCode === 0) {
            this.setState({
                arrUsers: response.users,
            }, () => {
                console.log('All user from DB no asynchorous: ', this.state.arrUsers);
            })
        }
        //các làm in ra thông tin như thế này đôi khi bị bất đồng bộ dẫn đến
        //giá trị arrUsers là undefined, để không bị bất đồng bộ thì làm như code bên trên
        console.log('All user from DB may be asynchronous: ', this.state.arrUsers);
    }
    //cần hiểu định nghĩa lifeCycle
    //khi chạy một component
    //thì việc đầu tiên sẽ check constructor để init state
    //và sau đó chạy vào hàm componentDidMount() gán giá trị cho state nào đó
    //rồi tới hàm render dưới đây
    //và có cả componentUpdate nữa nhưng chưa sử dụng tại đây
    render() {
        //ở đây ta check lại có lấy được dữ liệu chưa
        // console.log('This from render function: ', this.state.arrUsers);
        //khi load loại page, ta thấy có 2 lần câu lệnh trên được thực thi vì mỗi khi 
        //chạy vào hàm setState thì web tự động render lại
        let arrUsers = this.state.arrUsers;
        return (

            <div className="user-display-container">
                <div className="title text-center">
                    Manage users
                </div>
                <div className="users-display-table">
                    <table id="users">
                        <tr>
                            <th>Email</th>
                            <th>First name</th>
                            <th>Last name</th>
                            <th>Address</th>
                            <th>Phone number</th>
                            <th>Update data</th>
                        </tr>

                        {arrUsers && arrUsers.map((item, index) => {
                            return (
                                <tr>
                                    <td>{item.email}</td>
                                    <td>{item.firstName}</td>
                                    <td>{item.lastName}</td>
                                    <td>{item.address}</td>
                                    <td>{item.phoneNumber}</td>
                                    <td>
                                        <button className="edit-button update-button"><i className="fas fa-pencil-alt"></i></button>
                                        <button className="edit-button delete-button"><i className="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                            )
                        })
                        }



                    </table>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
