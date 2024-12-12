import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import HomePageHeader from '../../../HomePage/HomePageHeader/HomePageHeader';
import './AllSpecialties.scss';
import HomeFooter from '../../../HomePage/HomeFooter/HomeFooter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import { getSpecialtiesForHomePageService } from '../../../../services/userService';
import { LANGUAGES } from '../../../../utils';
import CustomScrollbars from '../../../../components/CustomScrollbars';
import DoctorScheduleComponent from '../../DoctorScheduleComponent/DoctorScheduleComponent';
import _ from 'lodash';
import { MoonLoader } from 'react-spinners';

class AllSpecialties extends Component {

    constructor(props) {
        super(props);
        this.state = {
            allSpecialty: [],
        }
    }

    async componentDidMount() {
        let res = await getSpecialtiesForHomePageService('ALL');
        if (res.errCode === 0) {
            this.setState({
                allSpecialty: res.data,
            })
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    handleViewDetailArticleOfASpecialty = (specialty) => {
        this.props.history.push(`/detail-specialty-article/${specialty.id}`);
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

        let { language } = this.props;
        let { allSpecialty } = this.state;

        return (
            <React.Fragment>
                <CustomScrollbars style={{ height: '100vh', width: '100%' }}>
                    <HomePageHeader isShowBanner={false} />
                    <div className="all-specialty-container">
                        {allSpecialty && allSpecialty.length > 0 &&
                            allSpecialty.map((item, index) => {
                                let imageByBase64 = '';
                                if (item.specialtyImage) {
                                    imageByBase64 = Buffer.from(item.specialtyImage, 'base64').toString('binary');
                                }
                                return (
                                    <div className="specialty-item-container" key={index}
                                        onClick={() => this.handleViewDetailArticleOfASpecialty(item)}
                                    >
                                        <div className="specialty-item">
                                            <div className="image image-css"
                                                style={{
                                                    backgroundImage: `url(${imageByBase64})`
                                                }}
                                            >
                                            </div>
                                            <div className="medical-facility-name">
                                                {item.name}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <HomeFooter />
                </CustomScrollbars>
            </React.Fragment >

        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AllSpecialties);
