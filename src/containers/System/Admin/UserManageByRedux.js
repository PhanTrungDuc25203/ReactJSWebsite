import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './UserManageByRedux.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileUpload, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { LANGUAGES } from "../../../utils";
import { switchLanguageOfWebsite } from "../../../store/actions";
import { Form, Col, FormGroup, Label, Input, Row, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { getAllCodesService } from "../../../services/userService";
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app

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
        if (prevProps.genderValueByRedux != this.props.genderValueByRedux) {
            this.setState({
                genderArr: this.props.genderValueByRedux,
            })
        }
        // Redux-getGender-(29): vậy là qua 29 bước code tụt loll thì cuối cùng <option> cũng nhận data
        //position
        if (prevProps.positionValueByRedux != this.props.positionValueByRedux) {
            this.setState({
                positionArr: this.props.positionValueByRedux,
            })
        }
        //role
        if (prevProps.roleValueByRedux != this.props.roleValueByRedux) {
            this.setState({
                roleArr: this.props.roleValueByRedux,
            })
        }
    }

    handleOnChangeAvatarImage = (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                previewAvatarImageUrl: objectUrl,
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

    render() {
        let genders = this.state.genderArr;
        let language = this.props.language;
        // Redux-getGender-(27): cỏ vẻ <option> vẫn chưa nhận data, cần hàm componentDidUpdate
        let isLoadingGenderValue = this.props.isLoadingGenderValue;
        let positions = this.state.positionArr;
        let roles = this.state.roleArr;
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
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="addUserEmail">
                                                <FormattedMessage id="menu.admin.user-manage-by-redux-form.email" />
                                            </Label>
                                            <Input
                                                id="addUserEmail"
                                                name="email"
                                                placeholder="abc@gmail.com"
                                                type="email"
                                                onChange={(event) => { this.handleOnChangeInputTag(event, "email") }}
                                                value={this.state.email}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="addUserPassword">
                                                <FormattedMessage id="menu.admin.user-manage-by-redux-form.password" />
                                            </Label>
                                            <Input
                                                id="addUserPassword"
                                                name="password"
                                                placeholder="your password"
                                                type="password"
                                                onChange={(event) => { this.handleOnChangeInputTag(event, "password") }}
                                                value={this.state.password}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="addUserFirstName">
                                                <FormattedMessage id="menu.admin.user-manage-by-redux-form.firstName" />
                                            </Label>
                                            <Input
                                                id="addUserFirstName"
                                                name="firstName"
                                                placeholder="Jackman"
                                                type="text"
                                                onChange={(event) => { this.handleOnChangeInputTag(event, "firstName") }}
                                                value={this.state.firstName}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="addUserLastName">
                                                <FormattedMessage id="menu.admin.user-manage-by-redux-form.lastName" />
                                            </Label>
                                            <Input
                                                id="addUserLastName"
                                                name="lastName"
                                                placeholder="Hugh"
                                                type="text"
                                                onChange={(event) => { this.handleOnChangeInputTag(event, "lastName") }}
                                                value={this.state.lastName}
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
                                                onChange={(event) => { this.handleOnChangeInputTag(event, "address") }}
                                                value={this.state.address}
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
                                                onChange={(event) => { this.handleOnChangeInputTag(event, "phoneNumber") }}
                                                value={this.state.phoneNumber}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={3}>
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
                                                    onChange={(event) => { this.handleOnChangeInputTag(event, "gender") }}
                                                    value={this.state.gender}
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
                                                                <option key={index}>
                                                                    {language === LANGUAGES.VI ? item.value_Vie : item.value_Eng}
                                                                </option>
                                                            )
                                                        })
                                                    }
                                                </Input>
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                    <Col md={3}>
                                        <FormGroup>
                                            <Label for="addUserRoleSelection">
                                                <FormattedMessage id="menu.admin.user-manage-by-redux-form.role" />
                                            </Label>
                                            <Col sm={12}>
                                                <Input
                                                    id="addUserRoleSelection"
                                                    name="select"
                                                    type="select"
                                                    onChange={(event) => { this.handleOnChangeInputTag(event, "roleId") }}
                                                    value={this.state.roleId}
                                                >
                                                    {roles && roles.length > 0 &&
                                                        roles.map((item, index) => {
                                                            return (
                                                                <option key={index}>
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
                                            <Label for="addUserPositionSelection">
                                                <FormattedMessage id="menu.admin.user-manage-by-redux-form.position" />
                                            </Label>
                                            <Col sm={12}>
                                                <Input
                                                    id="addUserPositionSelection"
                                                    name="select"
                                                    type="select"
                                                    onChange={(event) => { this.handleOnChangeInputTag(event, "roleId") }}
                                                    value={this.state.roleId}
                                                >
                                                    {positions && positions.length > 0 &&
                                                        positions.map((item, index) => {
                                                            return (
                                                                <option key={index}>
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
                                    <Col md={3} className="avatar-image-section">
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
                                            <label className="delete-btn">Xóa ảnh<FontAwesomeIcon icon={faTrashAlt} className="fontawesome-icon" /></label>
                                        </FormGroup>
                                    </Col>
                                    <Col md={3} className="avatar-image-section">
                                        <FormGroup>
                                            <Label>Xem trước</Label>
                                            <div className="image-preview"
                                                style={{ backgroundImage: `url(${this.state.previewAvatarImageUrl})` }}
                                                onClick={() => this.openImagePreview()}
                                            ></div>
                                        </FormGroup>

                                    </Col>
                                </Row>
                            </Form>

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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManageByRedux);
