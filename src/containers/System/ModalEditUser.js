import { maxBy } from "lodash";
import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import {
  Form,
  Col,
  FormGroup,
  Label,
  Input,
  Row,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { emitter } from "../../utils/emitter";
//thư viện xử lý chuỗi, mảng, object hiệu quả
import _ from "lodash";

class ModalEditUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      address: "",
      phoneNumber: "",
      gender: true,
      roleId: "R3",
    };
  }

  listenToEmitter() {
    emitter.on("EVENT_CLEAR_MODAL_DATA", () => {
      //reset state
      this.setState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        address: "",
        phoneNumber: "",
        gender: true,
        roleId: "R3",
      });
    });
  }

  componentDidMount() {}

  componentDidUpdate(prevProps) {
    let user = this.props.needEdittingUserInfo;
    // Only update state if the `needEdittingUserInfo` prop has changed
    if (
      user &&
      !_.isEmpty(user) &&
      prevProps.needEdittingUserInfo !== this.props.needEdittingUserInfo
    ) {
      this.setState({
        id: user.id || "",
        email: user.email || "",
        password:
          user.password ||
          "H*&YB*#&BC098fnhy89us7b320d7fB&987b0u8y890khsdfopinu*&^%#*&!^^%#$BUHIUBDT*&^ghifuet87qwe6r786(*&^875",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        address: user.address || "",
        phoneNumber: user.phoneNumber || "",
        // gender: gender !== undefined ? gender : true,
        // roleId: roleId || 'R3',
        gender: user.gender,
        roleId: user.roleId,
      });
    }
  }

  toggle = () => {
    this.props.toggleUserModal();
  };

  handleOnChangeInputTag = (event, id) => {
    let copiedState = { ...this.state };
    copiedState[id] = event.target.value;

    this.setState(
      {
        ...copiedState,
      },
      () => {}
    );
  };

  validateInput = () => {
    let isValid = true;
    let arrInput = [
      "email",
      "password",
      "firstName",
      "lastName",
      "address",
      "phoneNumber",
    ];
    for (let i = 0; i < arrInput.length; i++) {
      //dùng vòng lặp đơn thuần mới có thể break
      if (!this.state[arrInput[i]]) {
        isValid = false;
        alert("MIssing parameters: " + arrInput[i]);
        break;
      }
    }
    return isValid;
  };

  handleSaveChangesForUser = () => {
    let isValid = this.validateInput();
    if (isValid === true) {
      //gọi API phía node
      this.props.editUser(this.state);
    }
  };

  render() {
    // console.log('check modal props: ', this.props);
    // console.log('check modal props: ', this.props.isOpen, this.props.className);
    return (
      //toggle là khi click ra ngoài modal thì modal tự đóng
      <Modal
        isOpen={this.props.isOpen}
        toggle={() => {
          this.toggle();
        }}
        className={this.props.className}
        //kích thước modal
        size="lg"
        //modal vào giữa theo chiều dọc
        centered
      >
        <ModalHeader
          // toggle={() => { this.toggle() }}
          className="modal-header-customize"
        >
          Edit User
        </ModalHeader>
        <ModalBody>
          <div className="modal-contents-container">
            <Form>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="editUserModalEmail">Email</Label>
                    <Input
                      id="editUserModalEmail"
                      name="email"
                      placeholder="abc@gmail.com"
                      type="email"
                      onChange={(event) => {
                        this.handleOnChangeInputTag(event, "email");
                      }}
                      value={this.state.email}
                      className="readonly-input"
                      readOnly
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="editUserModalPassword">Password</Label>
                    <Input
                      id="editUserModalPassword"
                      name="password"
                      placeholder="your password"
                      type="password"
                      onChange={(event) => {
                        this.handleOnChangeInputTag(event, "password");
                      }}
                      value={this.state.password}
                      className="readonly-input"
                      readOnly
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="editUserModalFirstName">First name</Label>
                    <Input
                      id="editUserModalFirstName"
                      name="firstName"
                      placeholder="Jackman"
                      type="text"
                      onChange={(event) => {
                        this.handleOnChangeInputTag(event, "firstName");
                      }}
                      value={this.state.firstName}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="editUserModalLastName">Last name</Label>
                    <Input
                      id="editUserModalLastName"
                      name="lastName"
                      placeholder="Hugh"
                      type="text"
                      onChange={(event) => {
                        this.handleOnChangeInputTag(event, "lastName");
                      }}
                      value={this.state.lastName}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <FormGroup>
                    <Label for="editUserModalAddress">Address</Label>
                    <Input
                      id="editUserModalAddress"
                      name="address"
                      placeholder="khu 2 Hoàng Cương Thanh Ba Phú Thọ"
                      onChange={(event) => {
                        this.handleOnChangeInputTag(event, "address");
                      }}
                      value={this.state.address}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="editUserModalPhoneNumber">Phone number</Label>
                    <Input
                      id="editUserModalPhoneNumber"
                      name="city"
                      onChange={(event) => {
                        this.handleOnChangeInputTag(event, "phoneNumber");
                      }}
                      value={this.state.phoneNumber}
                    />
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <Label for="editUserModalGenderSelection">gender</Label>
                    <Col sm={12}>
                      <Input
                        id="editUserModalGenderSelection"
                        name="select"
                        className="readonly-input"
                        readOnly
                        type="select"
                        onChange={(event) => {
                          this.handleOnChangeInputTag(event, "gender");
                        }}
                        value={this.state.gender ? "1" : "0"}
                        disabled
                      >
                        <option value="1">Male</option>
                        <option value="0">Female</option>
                      </Input>
                    </Col>
                  </FormGroup>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <Label for="editUserModalRoleSelection">Role</Label>
                    <Col sm={12}>
                      <Input
                        id="editUserModalRoleSelection"
                        name="select"
                        type="select"
                        onChange={(event) => {
                          this.handleOnChangeInputTag(event, "roleId");
                        }}
                        value={this.state.roleId}
                        className="readonly-input"
                        readOnly
                        disabled
                      >
                        <option value="R3">Patient</option>
                        <option value="R1">Admin</option>
                        <option value="R2">Doctor</option>
                      </Input>
                    </Col>
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </div>
        </ModalBody>
        <div className="custom-modal-footer">
          <div className="buttons-container">
            <button
              className="save-user-btn"
              onClick={() => {
                this.handleSaveChangesForUser();
              }}
            >
              Save changes
            </button>
            <button className="cancel-btn">Cancel</button>
          </div>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditUser);
