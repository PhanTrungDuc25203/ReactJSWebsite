import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './UserManageByRedux.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileUpload, faTrashAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";
import { switchLanguageOfWebsite } from "../../../store/actions";
import { Form, Col, FormGroup, Label, Input, Row, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { getAllCodesService } from "../../../services/userService";
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app
import UserDisplayTableByRedux from './UserDisplayTableByRedux';

// Redux-getGender-(17):import actions
import * as actions from "../../../store/actions";
// Redux-getGender-(18):import xong rồi thì xuống cuối sửa hàm mapDispatchToProps

class UserManageByRedux extends Component {

    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            positionArr: [],
            roleArr: [],
            previewAvatarImageUrl: '',
            imagePreviewOpened: false,
            //biến cần để lưu người dùng
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: '',
            gender: '',
            position: '',
            role: '',
            avatarImage: '',

            action: '',
            idForEditUser: '',
        }
    }

    state = {

    }

    async componentDidMount() {
        //đây là cách gọi api trực tiếp để lấy dữ liệu, nhưng từ bây giờ thì sẽ
        //gọi qua redux, tôi sẽ để các bước lập trình như sau: Redux-getGender-(n) với n thuộc số tự nhiên
        //Redux-getGender-(1) trước hết hãy vào thư mục store/actions nha, khai báo action đi adminActions 

        // Redux-getGender-(15):comment đống code gọi api trực tiếp bên dưới
        // try {
        //     let res = await getAllCodesService('gender');
        //     if (res && res.errCode === 0) {
        //         this.setState({
        //             genderArr: res.data,
        //         })
        //     }
        //     console.log('Check res: ', res);
        // } catch (e) {
        //     console.log(e);
        // }

        // Redux-getGender-(16): quay lên import actions
        // Redux-getGender-(20): gọi hàm redux fetchGenderValueStart
        this.props.getGenderValueStart();
        // Redux-getGender-(21): vậy là ta đã fire được một action
        // Redux-getGender-(22): quay lại để viết api cho redux khi gọi hàm này, trở lại adminActions
        //ta có một cách khác để fire action trên khi chưa có hàm mapDispatchToProps
        // this.props.dispatch(actions.getGenderValueStart());
        //position
        this.props.getPositionValueStart();
        //role
        this.props.getRoleValueStart();

    }
    // Redux-getGender-(28):viết componentDidUpdate
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.genderValueByRedux !== this.props.genderValueByRedux) {
            let tempArr = this.props.genderValueByRedux
            this.setState({
                // genderArr: this.props.genderValueByRedux,
                genderArr: tempArr,
                gender: tempArr && tempArr.length > 0 ? tempArr[0].key : '',
            })
        }
        // Redux-getGender-(29): vậy là qua 29 bước code tụt loll thì cuối cùng <option> cũng nhận data
        //position
        if (prevProps.positionValueByRedux !== this.props.positionValueByRedux) {
            let tempArr = this.props.positionValueByRedux
            this.setState({
                // genderArr: this.props.genderValueByRedux,
                positionArr: tempArr,
                position: tempArr && tempArr.length > 0 ? tempArr[0].key : '',
            })
        }
        //role
        if (prevProps.roleValueByRedux !== this.props.roleValueByRedux) {
            let tempArr = this.props.roleValueByRedux
            this.setState({
                // genderArr: this.props.genderValueByRedux,
                roleArr: tempArr,
                role: tempArr && tempArr.length > 0 ? tempArr[0].key : '',
            })
        }

        if (prevProps.usersFromRedux !== this.props.usersFromRedux) {

            let tempGenderArr = this.props.genderValueByRedux;
            let tempPositionArr = this.props.positionValueByRedux;
            let tempRoleArr = this.props.roleValueByRedux;

            this.setState({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
                address: '',
                gender: tempGenderArr && tempGenderArr.length > 0 ? tempGenderArr[0].key : '',
                position: tempPositionArr && tempPositionArr.length > 0 ? tempPositionArr[0].key : '',
                role: tempRoleArr && tempRoleArr.length > 0 ? tempRoleArr[0].key : '',
                avatarImage: '',
                previewAvatarImageUrl: '',
                action: CRUD_ACTIONS.CREATE,
            })
        }
    }

    handleOnChangeAvatarImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                previewAvatarImageUrl: objectUrl,
                avatarImage: base64,
            })
        }

        console.log('file check: ', file);
    }

    openImagePreview = () => {
        if (!this.state.previewAvatarImageUrl) return;
        this.setState({
            imagePreviewOpened: true,
        })
    }

    deleteSelectedAvatarImage = () => {
        if (this.state.previewAvatarImageUrl) {
            // console.log("Before deleted: ", this.state.previewAvatarImageUrl)
            let tempImage = this.state.previewAvatarImageUrl;
            tempImage = null;
            this.setState({
                previewAvatarImageUrl: tempImage,
            })
            // console.log("After deleted: ", tempImage);
            // console.log("After deleted: ", this.state.previewAvatarImageUrl);
            //tại sao câu lệnh trên vẫn in ra bức ảnh đó nhỉ??? cho dù khi bấm lại vào nút xóa
            //thì code đã chạy đến case là không có ảnh nào (tức là in ra dòng alert)
        } else {
            alert('Bạn chưa chọn bức ảnh nào!')
        }
    }

    handleAddNewUser = () => {
        let isValid = this.checkInputValidation();
        if (isValid === false) {
            return;
        }

        let { action } = this.state;
        // = let action = this.state.action;
        if (action === CRUD_ACTIONS.CREATE) {
            //fire redux action
            this.props.addNewUserByRedux({
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                phoneNumber: this.state.phoneNumber,
                gender: this.state.gender,
                //vì chưa có chỗ nhập image và position nên tôi sẽ để là một string bất kì thôi
                image: this.state.avatarImage,
                roleId: this.state.role,
                positionId: this.state.position,
            });
            //chạy hàm dưới đây thì trang web sẽ tự refresh khi thêm mới người dùng
            // vì nó sẽ chạy vào adminReducer.js và chạy vào câu successffuly, khi đó bién 
            //users được cập nhật, thì nó sẽ chạy vào componentDidUpdate của file userdisplaytablebyredux.js
            //sau đó biến usersDataFromRedux được thay đổi theo thì file đó sẽ thực thi lại hàm setState
            // thì trang web sẽ tự động render lại 
            // cần xét timeout vì tốc độ truy cập vào db chậm hơn tốc độ mà câu lệnh dưới đây thực hiện
            //vì câu lệnh dưới đây được viết trong cùng một project
            //nhưng thay vì làm như thế này khi thời gian chờ là cố định
            // setTimeout(() => {
            //     this.props.fetchUserFromRedux();
            // }, 1000)
            //sang file adminActions.js để thêm action lấy AllUsers mỗi khi bấm thêm một người dùng mới

        }
        if (action === CRUD_ACTIONS.EDIT) {
            this.props.editUserByRedux({
                id: this.state.idForEditUser,
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                phoneNumber: this.state.phoneNumber,
                gender: this.state.gender,
                //vì chưa có chỗ nhập image và position nên tôi sẽ để là một string bất kì thôi
                // image: this.state.previewAvatarImageUrl,
                roleId: this.state.role,
                positionId: this.state.position,
                image: this.state.avatarImage,
            });
        }
    }

    checkInputValidation = () => {
        let isValid = true;
        let needCheckInput = ['email', 'password', 'firstName', 'lastName', 'phoneNumber', 'address'];
        for (let i = 0; i < needCheckInput.length; i++) {
            if (!this.state[needCheckInput[i]]) {
                isValid = false;
                alert('Thiếu giá trị cho: ' + needCheckInput[i]);
                break;
            }
        }

        return isValid;
    }

    onChangeInput = (event, idForEvent) => {
        let copyState = {
            ...this.state,
        };
        copyState[idForEvent] = event.target.value;
        this.setState({
            ...copyState
        }, () => {
            console.log('Check Input onChange: ', this.state);
        })
    }

    editUserByRedux = (user) => {

        let imageByBase64 = '';
        if (user.image) {
            imageByBase64 = Buffer.from(user.image, 'base64').toString('binary');
        }


        this.setState({
            email: user.email,
            password: 'jvch98wy80yt0h8weff0as0d',
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            address: user.address,
            gender: user.gender,
            role: user.roleId,
            position: user.positionId,
            avatarImage: '',
            previewAvatarImageUrl: imageByBase64,
            action: CRUD_ACTIONS.EDIT,
            idForEditUser: user.id,
        })
    }

    render() {
        let genders = this.state.genderArr;
        let language = this.props.language;
        // Redux-getGender-(27): cỏ vẻ <option> vẫn chưa nhận data, cần hàm componentDidUpdate
        let isLoadingGenderValue = this.props.isLoadingGenderValue;
        let positions = this.state.positionArr;
        let roles = this.state.roleArr;

        let { email, password, firstName, lastName, phoneNumber, address, gender,
            position, role, avatarImage } = this.state;
        return (
            <div className="user-manage-by-redux-container">
                <div className="title">
                    <FormattedMessage id="menu.admin.user-manage-by-redux-form.title" />
                </div>
                <div className="user-manage-by-redux-body">
                    <div className="container">
                        <div className="form-contents-container">
                            <Form>
                                <Row>
                                    <Col md={3}>
                                        <FormGroup>
                                            <Label for="addUserEmail">
                                                <FormattedMessage id="menu.admin.user-manage-by-redux-form.email" />
                                            </Label>
                                            <Input
                                                id="addUserEmail"
                                                name="email"
                                                placeholder="abc@gmail.com"
                                                type="email"
                                                onChange={(event) => { this.onChangeInput(event, 'email') }}
                                                value={email}
                                                disabled={this.state.action === CRUD_ACTIONS.EDIT ? true : false}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={3}>
                                        <FormGroup>
                                            <Label for="addUserPassword">
                                                <FormattedMessage id="menu.admin.user-manage-by-redux-form.password" />
                                            </Label>
                                            <Input
                                                id="addUserPassword"
                                                name="password"
                                                placeholder="your password"
                                                type="password"
                                                onChange={(event) => { this.onChangeInput(event, 'password') }}
                                                value={password}
                                                disabled={this.state.action === CRUD_ACTIONS.EDIT ? true : false}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={2} className="avatar-image-section">
                                        <FormGroup>
                                            <Label for="addUserAvatar">
                                                <FormattedMessage id="menu.admin.user-manage-by-redux-form.avatar-image" />
                                            </Label>
                                            <Input
                                                id="addUserAvatar"
                                                name="avatar"
                                                type="file"
                                                onChange={(event) => this.handleOnChangeAvatarImage(event)}
                                                hidden
                                            />
                                            <label className="upload-avatar-image" htmlFor="addUserAvatar">Tải ảnh<FontAwesomeIcon icon={faFileUpload} className="fontawesome-icon" /></label>
                                            <label className="delete-btn"
                                                onClick={() => this.deleteSelectedAvatarImage()}
                                            >
                                                Xóa ảnh
                                                <FontAwesomeIcon icon={faTrashAlt} className="fontawesome-icon" /></label>
                                        </FormGroup>
                                    </Col>
                                    <Col md={4} className="avatar-image-section">
                                        <FormGroup>
                                            <Label>Xem trước</Label>
                                            <div className="image-preview"
                                                style={{ backgroundImage: `url(${this.state.previewAvatarImageUrl})` }}
                                                onClick={() => this.openImagePreview()}
                                            ></div>
                                        </FormGroup>

                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={3}>
                                        <FormGroup>
                                            <Label for="addUserFirstName">
                                                <FormattedMessage id="menu.admin.user-manage-by-redux-form.firstName" />
                                            </Label>
                                            <Input
                                                id="addUserFirstName"
                                                name="firstName"
                                                placeholder="Jackman"
                                                type="text"
                                                onChange={(event) => { this.onChangeInput(event, 'firstName') }}
                                                value={firstName}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={3}>
                                        <FormGroup>
                                            <Label for="addUserLastName">
                                                <FormattedMessage id="menu.admin.user-manage-by-redux-form.lastName" />
                                            </Label>
                                            <Input
                                                id="addUserLastName"
                                                name="lastName"
                                                placeholder="Hugh"
                                                type="text"
                                                onChange={(event) => { this.onChangeInput(event, 'lastName') }}
                                                value={lastName}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12}>
                                        <FormGroup>
                                            <Label for="addUserAddress">
                                                <FormattedMessage id="menu.admin.user-manage-by-redux-form.address" />
                                            </Label>
                                            <Input
                                                id="addUserAddress"
                                                name="address"
                                                placeholder="khu 2 Hoàng Cương Thanh Ba Phú Thọ"
                                                onChange={(event) => { this.onChangeInput(event, 'address') }}
                                                value={address}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="addUserPhoneNumber">
                                                <FormattedMessage id="menu.admin.user-manage-by-redux-form.phoneNumber" />
                                            </Label>
                                            <Input
                                                id="addUserPhoneNumber"
                                                name="city"
                                                onChange={(event) => { this.onChangeInput(event, 'phoneNumber') }}
                                                value={phoneNumber}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="addUserGenderSelection">
                                                <FormattedMessage id="menu.admin.user-manage-by-redux-form.gender" />
                                            </Label>
                                            <Col sm={12}>
                                                <Input
                                                    id="addUserGenderSelection"
                                                    name="select"
                                                    className="py-10 mt-10"
                                                    type="select"
                                                    onChange={(event) => { this.onChangeInput(event, 'gender') }}
                                                    value={gender}
                                                    placeholder={isLoadingGenderValue === true ? `Loading gender's value` : ''}
                                                >
                                                    {/* ở đây không thể khai cứng là cần bào nhiều option và option đó thuộc ngôn ngữ gì theo kiểu
                                                    <option><FormattedMessage id="..."/></option> được, nên ta sẽ làm theo các lấy từ AllCodes
                                                    trong allcodes có khai value_Vie và Eng thì kiểm tra biến language của redux xem đang ở
                                                    ngôn ngữ nào thì dùng ngôn ngữ đó */}
                                                    {/* <div>{isLoadingGenderValue === true ? `Loading gender's value` : ''}</div> */}

                                                    {genders && genders.length > 0 &&
                                                        genders.map((item, index) => {
                                                            return (
                                                                <option key={index} value={item.key}>
                                                                    {language === LANGUAGES.VI ? item.value_Vie : item.value_Eng}
                                                                </option>
                                                            )
                                                        })
                                                    }
                                                </Input>
                                            </Col>
                                        </FormGroup>
                                    </Col>

                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="addUserRoleSelection">
                                                <FormattedMessage id="menu.admin.user-manage-by-redux-form.role" />
                                            </Label>
                                            <Col sm={12}>
                                                <Input
                                                    id="addUserRoleSelection"
                                                    name="select"
                                                    type="select"
                                                    onChange={(event) => { this.onChangeInput(event, 'role') }}
                                                    value={role}
                                                >
                                                    {roles && roles.length > 0 &&
                                                        roles.map((item, index) => {
                                                            return (
                                                                <option key={index} value={item.key}>
                                                                    {language === LANGUAGES.VI ? item.value_Vie : item.value_Eng}
                                                                </option>
                                                            )
                                                        })
                                                    }
                                                </Input>
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="addUserPositionSelection">
                                                <FormattedMessage id="menu.admin.user-manage-by-redux-form.position" />
                                            </Label>
                                            <Col sm={12}>
                                                <Input
                                                    id="addUserPositionSelection"
                                                    name="select"
                                                    type="select"
                                                    onChange={(event) => { this.onChangeInput(event, 'position') }}
                                                    value={position}
                                                >
                                                    {positions && positions.length > 0 &&
                                                        positions.map((item, index) => {
                                                            return (
                                                                <option key={index} value={item.key}>
                                                                    {language === LANGUAGES.VI ? item.value_Vie : item.value_Eng}
                                                                </option>
                                                            )
                                                        })
                                                    }
                                                    {/* <option value="R1">
                                                        <FormattedMessage id="menu.admin.user-manage-by-redux-form" />
                                                    </option>
                                                    <option value="R2">
                                                        <FormattedMessage id="menu.admin.user-manage-by-redux-form" />
                                                    </option> */}
                                                </Input>
                                            </Col>
                                        </FormGroup>
                                    </Col>

                                    {/* <Col md={2} className="avatar-image-section">
                                        <FormGroup>
                                            <Label for="addUserAvatar">
                                                <FormattedMessage id="menu.admin.user-manage-by-redux-form.avatar-image" />
                                            </Label>
                                            <Input
                                                id="addUserAvatar"
                                                name="avatar"
                                                type="file"
                                                onChange={(event) => this.handleOnChangeAvatarImage(event)}
                                                hidden
                                            />
                                            <label className="upload-avatar-image" htmlFor="addUserAvatar">Tải ảnh<FontAwesomeIcon icon={faFileUpload} className="fontawesome-icon" /></label>
                                            <label className="delete-btn"
                                                onClick={() => this.deleteSelectedAvatarImage()}
                                            >
                                                Xóa ảnh
                                                <FontAwesomeIcon icon={faTrashAlt} className="fontawesome-icon" /></label>
                                        </FormGroup>
                                    </Col>
                                    <Col md={4} className="avatar-image-section">
                                        <FormGroup>
                                            <Label>Xem trước</Label>
                                            <div className="image-preview"
                                                style={{ backgroundImage: `url(${this.state.previewAvatarImageUrl})` }}
                                                onClick={() => this.openImagePreview()}
                                            ></div>
                                        </FormGroup>

                                    </Col> */}
                                </Row>
                                <Row>
                                    <Col md={12}>
                                        <Button className={this.state.action === CRUD_ACTIONS.EDIT ? "edit-user-button" : "add-new-user-button"}
                                            onClick={() => this.handleAddNewUser()}
                                        >
                                            {this.state.action === CRUD_ACTIONS.EDIT ?
                                                'Lưu thay đổi'
                                                :
                                                'Lưu người dùng'
                                            }
                                            {/* Lưu người dùng <FontAwesomeIcon icon={faUserPlus} /> */}
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                        <div className="user-display-table">
                            <UserDisplayTableByRedux
                                editUserByReduxFromParent={this.editUserByRedux}
                                action={this.state.action}
                            />
                        </div>
                    </div>
                    {this.state.imagePreviewOpened === true &&
                        <Lightbox
                            mainSrc={this.state.previewAvatarImageUrl}
                            onCloseRequest={() => this.setState({ imagePreviewOpened: false })}
                        />
                    }

                </div>
            </div >

        )
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        // Redux-getGender-(25): map state tại đây, thông qua admin có thể lấy được adminReducer
        //và trong adminReducer tôi muốn lấy state của genders (state bao gồm genders,roles và positions)
        // Redux-getGender-(26): và cuối cùng cho render lấy và hiển thị thôi
        genderValueByRedux: state.admin.genders,
        positionValueByRedux: state.admin.positions,
        roleValueByRedux: state.admin.roles,
        isLoadingGenderValue: state.admin.isLoadingGenderValue,
        usersFromRedux: state.admin.users,

    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenderValueStart: () => dispatch(actions.fetchGenderValueStart()),
        // Redux-getGender-(19): trở lại hàm didMount
        // processLogout: () => dispatch(actions.processLogout()),
        // switchLanguageOfWebsite: (language) => dispatch(actions.switchLanguageOfWebsite(language)),
        getPositionValueStart: () => dispatch(actions.fetchPositionValueStart()),
        getRoleValueStart: () => dispatch(actions.fetchRoleValueStart()),
        addNewUserByRedux: (data) => dispatch(actions.addNewUserByRedux(data)),
        fetchUserFromRedux: () => dispatch(actions.fetchAllUsersValueStart()),
        editUserByRedux: (data) => dispatch(actions.editUserByRedux(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManageByRedux);
