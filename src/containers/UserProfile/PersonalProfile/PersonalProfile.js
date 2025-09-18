import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./PersonalProfile.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { LANGUAGES } from "../../../utils";
import _ from "lodash";
import { withRouter } from "react-router";
import * as actions from "../../../store/actions";
import { MoonLoader } from "react-spinners";
import { getAllRelativeInforsOfCurrentSystemUserService } from "../../../services/userService";

class PersonalProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {},
    };
  }

  async componentDidMount() {
    if (this.props && this.props.currentUser) {
      // console.log("check props: ", this.props);
      this.setState({
        currentUser: this.props.currentUser,
      });
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.currentUser !== this.props.currentUser) {
      this.setState({
        currentUser: this.props.currentUser,
      });
    }
  }

  handleProfileTabClicked(whichClicked) {}

  render() {
    // console.log("Check current user role: ", this.state.currentUser);
    let { currentUser } = this.state;
    return (
      <div className="personal-profile-for-profile-page-container">
        <div className="phone-number">
          <label>Số điện thoại</label>
          <input
            disabled
            value={
              currentUser && currentUser.phoneNumber
                ? currentUser.phoneNumber
                : "Chưa cập nhật"
            }
            onChange={() => this.tempFunction()}
          ></input>
        </div>
        <div className="gender">
          <label>Giới tính</label>
          <input
            disabled
            value={
              currentUser && currentUser.genderData
                ? currentUser.genderData.value_Vie
                : "Chưa cập nhật"
            }
            onChange={() => this.tempFunction()}
          ></input>
        </div>
        <div className="address">
          <label>Địa chỉ</label>
          <input
            disabled
            value={
              currentUser && currentUser.address
                ? currentUser.address
                : "Chưa cập nhật"
            }
            onChange={() => this.tempFunction()}
          ></input>
        </div>
        {currentUser && currentUser.roleId && currentUser.roleId !== "R3" && (
          <div className="more-infor-if-user-is-not-patient">
            <div className="role">
              <label>Vai trò</label>
              <input
                disabled
                value={
                  currentUser && currentUser.roleData
                    ? currentUser.roleData.value_Vie
                    : "Chưa cập nhật"
                }
                onChange={() => this.tempFunction()}
              ></input>
            </div>
            {currentUser &&
              currentUser.roleId &&
              currentUser.roleId === "R2" && (
                <div className="more-infor-if-user-is-not-patient-and-admin">
                  <div className="level">
                    <label>Trình độ</label>
                    <input
                      disabled
                      value={
                        currentUser && currentUser.positionData
                          ? currentUser.positionData.value_Vie
                          : "Chưa cập nhật"
                      }
                      onChange={() => this.tempFunction()}
                    ></input>
                  </div>
                  <div className="doctor-specialty">
                    <label>Chuyên ngành</label>
                    <input
                      disabled
                      value={
                        currentUser &&
                        currentUser.Doctor_infor &&
                        currentUser.Doctor_infor.belongToSpecialty &&
                        currentUser.Doctor_infor.belongToSpecialty.name
                          ? currentUser.Doctor_infor.belongToSpecialty.name
                          : "Chưa cập nhật"
                      }
                      onChange={() => this.tempFunction()}
                    ></input>
                  </div>
                  <div className="clinic-name">
                    <label>Tên phòng khám</label>
                    <input
                      disabled
                      value={
                        currentUser &&
                        currentUser.Doctor_infor &&
                        currentUser.Doctor_infor.clinicName
                          ? currentUser.Doctor_infor.clinicName
                          : "Chưa cập nhật"
                      }
                      onChange={() => this.tempFunction()}
                    ></input>
                  </div>
                  <div className="clinic-address">
                    <label>Địa chỉ phòng khám</label>
                    <input
                      disabled
                      value={
                        currentUser &&
                        currentUser.Doctor_infor &&
                        currentUser.Doctor_infor.clinicAddress
                          ? currentUser.Doctor_infor.clinicAddress
                          : "Chưa cập nhật"
                      }
                      onChange={() => this.tempFunction()}
                    ></input>
                  </div>
                </div>
              )}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    // systemMenuPath: state.app.systemMenuPath,
    // isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    processLogout: () => dispatch(actions.processLogout()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PersonalProfile)
);
