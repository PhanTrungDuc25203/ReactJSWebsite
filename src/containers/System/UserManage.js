import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './UserManage.scss';
import { getAllUsersToDisplayInReact, createNewUserService, deleteUserService, editUserService } from '../../services/userService'
//import để mở đc modal
import ModalUser from './ModalUser';
import ModalEditUser from './ModalEditUser';
import { emitter } from "../../utils/emitter";

class UserManage extends Component {
    constructor(props) {
        //khi component được render thì nó sẽ check hàm constructor đầu tiên
        super(props);
        //khởi tạo những trạng thais state muốn dùng với class này
        this.state = {
            //lưu giá trị để hiển thị
            arrUsers: [],
            modalAddUserOpened: false,
            modalEditUserOpened: false,
            needEdittingUserInfo: {},
        }
    }

    state = {

    }

    async componentDidMount() {
        await this.getAllUsersFromReact();
    }

    getAllUsersFromReact = async () => {
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
        // console.log('All user from DB may be asynchronous: ', this.state.arrUsers);
    }

    handleAddNewUserInReact = () => {
        this.setState({
            modalAddUserOpened: true,
        })
    }

    toggleUserModal = () => {
        this.setState({
            modalAddUserOpened: !this.state.modalAddUserOpened,
        })
    }

    toggleEditUserModal = () => {
        this.setState({
            modalEditUserOpened: !this.state.modalEditUserOpened,
        })
    }

    createNewUser = async (data) => {
        try {
            let response = await createNewUserService(data);
            if (response && response.errCode !== 0) {
                alert(response.message);
            } else {
                await this.getAllUsersFromReact();
                //khi tạo thành công xong thì tắt modal đi
                this.setState({
                    modalAddUserOpened: false,
                })
                emitter.emit('EVENT_CLEAR_MODAL_DATA');
            }
        } catch (e) {
            console.log(e);
        }
    }

    deleteUser = async (user) => {
        try {
            let res = await deleteUserService(user.id);
            if (res && res.errCode === 0) {
                await this.getAllUsersFromReact();
            }
        } catch (e) {
            console.log(e);
        }
    }

    setStateForHandleEditUser = async (user) => {
        this.setState({
            modalEditUserOpened: true,
            needEdittingUserInfo: user,
        })
    }

    editUser = async (user) => {

        try {
            let res = await editUserService(user);
            if (res && res.errCode === 0) {
                this.setState({
                    modalEditUserOpened: false,
                })
                await this.getAllUsersFromReact();
            } else {
                alert(res.errCode);
            }
        } catch (e) {
            console.log(e);
        }
    }

    //cần hiểu định nghĩa lifeCycle
    //khi chạy một component
    //thì việc đầu tiên sẽ chạy render, sau đó check constructor để init state
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
                <ModalUser
                    //truyền trạng thái parent cho child, có thể truyền cả biến lẫn hàm
                    toggleUserModal={this.toggleUserModal}
                    isOpen={this.state.modalAddUserOpened}
                    className={'add-new-user-modal'}
                    createNewUser={this.createNewUser}
                />
                <ModalEditUser
                    toggleUserModal={this.toggleEditUserModal}
                    isOpen={this.state.modalEditUserOpened}
                    className={'edit-user-modal'}
                    needEdittingUserInfo={this.state.needEdittingUserInfo}
                    editUser={this.editUser}
                />
                <div className="title table-title">
                    Manage users
                    <div className="mx-1">
                        <button className="btn btn-primary add-new-user-button"
                            onClick={() => this.handleAddNewUserInReact()}>New user<i className="fas fa-user-plus"></i></button>
                    </div>
                </div>
                {/* <div class="mx-1">
                    <button className="btn btn-primary add-new-user-button">Add new user</button>
                </div> */}
                <div className="users-display-table">
                    <table id="users">
                        <tbody>
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
                                    <tr key={index}>
                                        <td>{item.email}</td>
                                        <td>{item.firstName}</td>
                                        <td>{item.lastName}</td>
                                        <td>{item.address}</td>
                                        <td>{item.phoneNumber}</td>
                                        <td className="action-column">
                                            <button className="modify-data-button edit-button" onClick={() => this.setStateForHandleEditUser(item)}><i className="fas fa-pencil-alt"></i></button>
                                            <button className="modify-data-button delete-button" onClick={() => this.deleteUser(item)}><i className="fas fa-trash"></i></button>
                                        </td>
                                    </tr>
                                )
                            })
                            }
                        </tbody>
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
