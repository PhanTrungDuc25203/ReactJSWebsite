import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
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
                    Quản lý người dùng bằng Redux
                </div>
                <div className="user-manage-by-redux-body">

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
