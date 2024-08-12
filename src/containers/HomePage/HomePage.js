import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomePageHeader from './HomePageHeader';

class HomePage extends Component {

    render() {

        return (
            <HomePageHeader/>
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
