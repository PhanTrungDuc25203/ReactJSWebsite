import { maxBy } from "lodash";
import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
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

class ModalPatientReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileContent: "",
    };
  }

  componentDidMount() {
    if (this.props && this.props.fileContent) {
      this.setState({
        fileContent: this.props.fileContent,
      });
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.fileContent !== this.props.fileContent) {
      this.setState({
        fileContent: this.props.fileContent,
      });
    }
  }

  onRequestClose = () => {
    this.props.onRequestClose();
  };

  handleCancelBtnClicked = () => {
    this.props.toggleUserModal();
  };

  generatePatientReport = () => {
    this.props.generatePatientReport();
  };

  handleFileContentChange = (event) => {
    this.props.handleFileContentChange(event);
  };

  saveFile = () => {
    this.props.saveFile();
  };

  saveFileButNotDownload = () => {
    this.props.saveFileButNotDownload();
  };

  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        toggle={() => {
          this.onRequestClose();
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
          Chỉnh sửa báo cáo khám bệnh
        </ModalHeader>
        <ModalBody>
          <div className="report-modal-contents-container">
            <Form>
              <Row>
                <Col md={12}>
                  <FormGroup>
                    <Label className="report-content-label">
                      Nội dung báo cáo
                    </Label>
                    <textarea
                      className="modal-textarea"
                      value={this.props.fileContent}
                      onChange={this.handleFileContentChange}
                      rows="10"
                      style={{ width: "100%" }}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <div className="custom-modal-footer">
                    <div className="buttons-container">
                      {/* <button className="cancel-btn" onClick={() => this.onRequestClose()}>Hủy</button> */}
                      <button
                        className="save-new-appointment-history"
                        onClick={(event) => {
                          event.preventDefault(); // Ngăn việc submit form và reload trang
                          this.onRequestClose();
                          this.props.saveFileButNotDownload();
                        }}
                      >
                        Lưu
                      </button>
                      <button
                        className="save-and-download-new-appointment-history"
                        onClick={(event) => {
                          event.preventDefault(); // Ngăn việc submit form và reload trang
                          this.onRequestClose();
                          this.props.saveFile();
                        }}
                      >
                        Lưu và tải về
                        <FontAwesomeIcon
                          className="download-icon-in-modal"
                          icon={faDownload}
                        />
                      </button>
                    </div>
                  </div>
                </Col>
              </Row>
            </Form>
          </div>
        </ModalBody>
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalPatientReport);
