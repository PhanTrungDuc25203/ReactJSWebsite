import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './UserManageByRedux.scss';
import { LANGUAGES } from "../../../utils";
import { switchLanguageOfWebsite } from "../../../store/actions";
import { Form, Col, FormGroup, Label, Input, Row, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
class UserManageByRedux extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    state = {

    }

    componentDidMount() {
    }


    render() {
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
                                                >
                                                    <option value="1">
                                                        <FormattedMessage id="menu.admin.user-manage-by-redux-form.gender-value.male" />
                                                    </option>
                                                    <option value="0">
                                                        <FormattedMessage id="menu.admin.user-manage-by-redux-form.gender-value.female" />
                                                    </option>
                                                    <option value="1">
                                                        <FormattedMessage id="menu.admin.user-manage-by-redux-form.gender-value.femboy" />
                                                    </option>
                                                    <option value="0">
                                                        <FormattedMessage id="menu.admin.user-manage-by-redux-form.gender-value.tomboy" />
                                                    </option>
                                                    <option value="0">
                                                        <FormattedMessage id="menu.admin.user-manage-by-redux-form.gender-value.bisexual" />
                                                    </option>
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
                                                    <option value="R3">
                                                        <FormattedMessage id="menu.admin.user-manage-by-redux-form.role-value.patient" />
                                                    </option>
                                                    <option value="R1">
                                                        <FormattedMessage id="menu.admin.user-manage-by-redux-form.role-value.admin" />
                                                    </option>
                                                    <option value="R2">
                                                        <FormattedMessage id="menu.admin.user-manage-by-redux-form.role-value.doctor" />
                                                    </option>
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
                                                    <option value="R3">
                                                        ....
                                                    </option>
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
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="addUserAvatar">
                                                <FormattedMessage id="menu.admin.user-manage-by-redux-form.avatar-image" />
                                            </Label>
                                            <Input
                                                id="addUserAvatar"
                                                name="avatar"
                                                placeholder="Your Avatar image"
                                                type="text"
                                                onChange={(event) => { this.handleOnChangeInputTag(event, "firstName") }}
                                                value={this.state.firstName}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>

        )
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

export default connect(mapStateToProps, mapDispatchToProps)(UserManageByRedux);
