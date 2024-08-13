import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomePageHeader from './HomePageHeader/HomePageHeader';
import SideBar from './SideBar/SideBar';

class HomePage extends Component {

    render() {

        return (
            <React.Fragment>
                <SideBar />
                <HomePageHeader />

            </React.Fragment>


        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
