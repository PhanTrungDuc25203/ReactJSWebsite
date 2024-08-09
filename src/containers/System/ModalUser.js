import { maxBy } from 'lodash';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Form, Col, FormGroup, Label, Input, Row, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class ModalUser extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {
    }

    toggle = () => {
        this.props.toggleUserModal();
    }

    closeBtn = () => {
        return (
            <button className="close" onClick={() => { this.toggle() }} type="button">
                &times;
            </button>
        )
    }

    Form = () => { };

    render() {
        console.log('check modal props: ', this.props);
        console.log('check modal props: ', this.props.isOpen);;
        return (
            //toggle là khi click ra ngoài modal thì modal tự đóng
            <Modal
                isOpen={this.props.isOpen}
                toggle={() => { this.toggle() }}
                className={'add-new-user-modal'}
                //kích thước modal
                size="lg"
                //modal vào giữa theo chiều dọc
                centered>
                <ModalHeader toggle={() => { this.toggle() }} close={() => this.closeBtn()}
                    className="modal-header-customize">
                    Add new User
                </ModalHeader>
                <ModalBody>
                    {/* <div className="modal-contents-container">
                        <div className="row">
                            <div className="col-6 form-group">
                                <label>Email</label>
                                <input type="text" />
                            </div>
                        </div>
                    </div> */}
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
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={3}>
                                    <FormGroup>
                                        <Label for="exampleState">
                                            Sex
                                        </Label>
                                        <Col sm={maxBy}>
                                            <Input
                                                id="exampleSelect"
                                                name="select"
                                                type="select"
                                            >
                                                <option>
                                                    1
                                                </option>
                                                <option>
                                                    2
                                                </option>
                                                <option>
                                                    3
                                                </option>
                                                <option>
                                                    4
                                                </option>
                                                <option>
                                                    5
                                                </option>
                                            </Input>
                                        </Col>
                                    </FormGroup>
                                </Col>
                                <Col md={3}>
                                    <FormGroup>
                                        <Label for="exampleZip">
                                            Zip
                                        </Label>
                                        <Input
                                            id="exampleZip"
                                            name="zip"
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            {/* <Row>
                                <Col md={6}>
                                    <Button>
                                        Sign in
                                    </Button>
                                </Col>
                            </Row> */}

                        </Form>
                    </div>

                </ModalBody>
                {/* <ModalFooter>
                    <div className="buttons-container">
                        <Button id="add-new-user-btn" className="px-5 mr-30" color="primary" onClick={() => { this.toggle() }}>
                            Add
                        </Button>{' '}
                        <Button id="cancel-btn" className="cpx-3 mr-30" color="danger" onClick={() => { this.toggle() }}>
                            Cancel
                        </Button>
                    </div>
                </ModalFooter> */}
                <div className="custom-modal-footer">
                    <div className="buttons-container">
                        <button className="add-new-user-btn">Add</button>
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



