import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { LANGUAGES } from "../../../utils";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";
import "./UserDisplayTableByRedux.scss";
// import { getAllUsersToDisplayInReact, createNewUserService, deleteUserService, editUserService } from '../../services/userService'

class UserDisplayTableByRedux extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usersDataFromRedux: [],
    };
  }

  componentDidMount() {
    //fire redux
    this.props.fetchUserFromRedux();
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.usersFromRedux !== this.props.usersFromRedux) {
      this.setState({
        usersDataFromRedux: this.props.usersFromRedux,
      });
    }
  }

  handleDeleteUserByRedux = (user) => {
    this.props.deleteUserByRedux(user.id);
  };

  handleEditUserByRedux = (user) => {
    this.props.editUserByReduxFromParent(user);
  };

  render() {
    // console.log("Users from redux: ", this.props.usersFromRedux);
    // console.log('Check: ', this.state.usersDataFromRedux)
    let arrUsers = this.state.usersDataFromRedux;
    return (
      <div className="user-display-container-redux">
        <div className="title table-title-redux">Users</div>
        <div className="users-display-table-redux">
          <table id="users-redux">
            <tbody>
              <tr>
                <th>
                  {" "}
                  <FormattedMessage id="menu.admin.user-manage-by-redux-form.email" />
                </th>
                <th>
                  {" "}
                  <FormattedMessage id="menu.admin.user-manage-by-redux-form.firstName" />
                </th>
                <th>
                  {" "}
                  <FormattedMessage id="menu.admin.user-manage-by-redux-form.lastName" />
                </th>
                <th>
                  {" "}
                  <FormattedMessage id="menu.admin.user-manage-by-redux-form.address" />
                </th>
                <th>
                  {" "}
                  <FormattedMessage id="menu.admin.user-manage-by-redux-form.phoneNumber" />
                </th>
                <th>
                  <FormattedMessage id="menu.admin.user-manage-by-redux-form.update-data-column" />
                </th>
              </tr>

              {arrUsers &&
                arrUsers.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{item.email}</td>
                      <td>{item.firstName}</td>
                      <td>{item.lastName}</td>
                      <td>{item.address}</td>
                      <td>{item.phoneNumber}</td>
                      <td className="action-column-redux">
                        <button
                          className="modify-data-button-redux edit-button-redux"
                          onClick={() => this.handleEditUserByRedux(item)}
                        >
                          <i className="fas fa-pencil-alt"></i>
                        </button>
                        <button
                          className="modify-data-button-redux delete-button-redux"
                          onClick={() => this.handleDeleteUserByRedux(item)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    usersFromRedux: state.admin.users,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUserFromRedux: () => dispatch(actions.fetchAllUsersValueStart()),
    deleteUserByRedux: (id) => dispatch(actions.deleteUserByRedux(id)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserDisplayTableByRedux);
