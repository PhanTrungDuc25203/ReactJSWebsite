import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import HomePageHeader from '../../HomePage/HomePageHeader/HomePageHeader';
import './DetailMedicalFacility.scss';
import HomeFooter from '../../HomePage/HomeFooter/HomeFooter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import { getInfoOfMedicalFacility } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
import CustomScrollbars from '../../../components/CustomScrollbars';
import DoctorScheduleComponent from '../DoctorScheduleComponent/DoctorScheduleComponent';
import _ from 'lodash';
import { MoonLoader } from 'react-spinners';

class DetailMedicalFacility extends Component {

    constructor(props) {
        super(props);
        this.state = {
            medicalFacility: {},
            isLoading: true,
            spinnerType: 'MoonLoader',
            color: '#123abc',
            size: 25,
        }
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;

            let res = await getInfoOfMedicalFacility(id);
            if (res && res.infor && res.infor[0]) {
                this.setState({
                    medicalFacility: res.infor[0],
                })
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    handleSpinnerTypeChange = (event) => {
        this.setState({ spinnerType: event.target.value });
    };

    handleColorChange = (event) => {
        this.setState({ color: event.target.value });
    };

    handleSizeChange = (event) => {
        this.setState({ size: parseInt(event.target.value, 10) });
    };

    render() {
        console.log("check state: ", this.state.medicalFacility);
        return (
            <React.Fragment>
                <CustomScrollbars style={{ height: '100vh', width: '100%' }}>
                    <HomePageHeader isShowBanner={false} />
                    <div className="medical-facility-article-container">
                        đây là trang web cho cơ sở y tế có id: {this.props.match.params.id}
                    </div>
                    <HomeFooter />
                </CustomScrollbars>
            </React.Fragment >

        );
    }
}

const mapStateToProps = state => {
    return {
        // systemMenuPath: state.app.systemMenuPath,
        // isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailMedicalFacility);
