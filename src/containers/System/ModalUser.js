import { maxBy } from 'lodash';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Form, Col, FormGroup, Label, Input, Row, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class ModalUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            address: '',
            phoneNumber: '',
            gender: true,
            roleId: 'R3',
        }
    }

    componentDidMount() {
    }

    toggle = () => {
        this.props.toggleUserModal();
    }

    //cần truyền thêm tham số ID vì có 5 <input> mà chỉ muốn một hàm onChange nên cần thêm id, tối ưu hóa
    handleOnChangeInputTag = (event, id) => {
        //code lỏd:)))
        /**
         * this.state = {
         * email
         * password
         * firstName
         * ....
         * }
         * nên khi lấy this.state.email thì nó cũng như this.state['email']
         * câu lệnh dưới đây lấy id là email ,password, firstName,.... 
         * 
         * là bad code bởi vì khi render những component phức tạp hơn thì bị ngắt quãng
         */
        // this.state[id] = event.target.value;
        // this.setState({
        //     // dấu 3 chấm copy hết state của class này vào đây   
        //     ...this.state
        // }, () => {
        //     console.log('check code lỏd:)): ', this.state)
        // })


        //super ultra god code:))
        let copiedState = { ...this.state };
        copiedState[id] = event.target.value;

        this.setState({
            ...copiedState,
        }, () => {
            // console.log('Copied state: ', copiedState);
        })
    }

    validateInput = () => {
        let isValid = true;
        let arrInput = ['email',
            'password',
            'firstName',
            'lastName',
            'address',
            'phoneNumber',
            'gender',
            'roleId'];
        for (let i = 0; i < arrInput.length; i++) {
            //dùng vòng lặp đơn thuần mới có thể break
            if (!this.state[arrInput[i]]) {
                isValid = false;
                alert('MIssing parameters: ' + arrInput[i]);
                break;
            }
        }
        return isValid;
    }

    handleAddNewUser = () => {
        let isValid = this.validateInput();
        if (isValid === true) {
            //gọi API phía node
            this.props.createNewUser(this.state);
        }
    }

    render() {
        // console.log('check modal props: ', this.props);
        // console.log('check modal props: ', this.props.isOpen, this.props.className);
        return (
            //toggle là khi click ra ngoài modal thì modal tự đóng
            <Modal
                isOpen={this.props.isOpen}
                toggle={() => { this.toggle() }}
                className={this.props.className}
                //kích thước modal
                size="lg"
                //modal vào giữa theo chiều dọc
                centered
            >
                <ModalHeader
                    // toggle={() => { this.toggle() }}
                    className="modal-header-customize">
                    Add new User
                </ModalHeader>
                <ModalBody>
                    <div className="modal-contents-container">
                        <Form>
                            <Row>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="exampleEmail">
                                            Email
                                        </Label>
                                        <Input
                                            id="exampleEmail"
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
                                        <Label for="examplePassword">
                                            Password
                                        </Label>
                                        <Input
                                            id="examplePassword"
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
                                        <Label for="exampleFirstName">
                                            First name
                                        </Label>
                                        <Input
                                            id="exampleFirstName"
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
                                        <Label for="exampleLastName">
                                            Last name
                                        </Label>
                                        <Input
                                            id="exampleLastName"
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
                                        <Label for="exampleAddress">
                                            Address
                                        </Label>
                                        <Input
                                            id="exampleAddress"
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
                                        <Label for="exampleCity">
                                            Phone number
                                        </Label>
                                        <Input
                                            id="exampleCity"
                                            name="city"
                                            onChange={(event) => { this.handleOnChangeInputTag(event, "phoneNumber") }}
                                            value={this.state.phoneNumber}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={3}>
                                    <FormGroup>
                                        <Label for="exampleState">
                                            gender
                                        </Label>
                                        <Col sm={12}>
                                            <Input
                                                id="exampleSelect"
                                                name="select"
                                                className="py-10 mt-10"
                                                type="select"
                                                onChange={(event) => { this.handleOnChangeInputTag(event, "gender") }}
                                                value={this.state.gender}
                                            >
                                                <option value="1">
                                                    Male
                                                </option>
                                                <option value="0">
                                                    Female
                                                </option>
                                                <option value="1">
                                                    Femboy
                                                </option>
                                                <option value="0">
                                                    Tomboy
                                                </option>
                                                <option value="0">
                                                    Futanari
                                                </option>
                                            </Input>
                                        </Col>
                                    </FormGroup>
                                </Col>
                                <Col md={3}>
                                    <FormGroup>
                                        <Label for="exampleZip">
                                            Role
                                        </Label>
                                        <Col sm={12}>
                                            <Input
                                                id="exampleSelect"
                                                name="select"
                                                type="select"
                                                onChange={(event) => { this.handleOnChangeInputTag(event, "roleId") }}
                                                value={this.state.roleId}
                                            >
                                                <option value="R3">
                                                    Patient
                                                </option>
                                                <option value="R1">
                                                    Admin
                                                </option>
                                                <option value="R2">
                                                    Doctor
                                                </option>
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
                        <button className="add-new-user-btn"
                            onClick={() => { this.handleAddNewUser() }}
                        >
                            Add
                        </button>
                        <button className="cancel-btn">Cancel</button>
                    </div>
                </div>
            </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalUser);



