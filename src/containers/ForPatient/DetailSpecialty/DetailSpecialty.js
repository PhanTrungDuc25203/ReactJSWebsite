import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import HomePageHeader from '../../HomePage/HomePageHeader/HomePageHeader';
import './DetailSpecialty.scss';
import HomeFooter from '../../HomePage/HomeFooter/HomeFooter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import { getInforAndArticleForADoctor } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
import CustomScrollbars from '../../../components/CustomScrollbars';

class DetailSpecialty extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // doctorDetails: {},
        }
    }

    async componentDidMount() {
        // if (this.props.match && this.props.match.params && this.props.match.params.id) {
        //     let id = this.props.match.params.id;
        //     let res = await getInforAndArticleForADoctor(id);
        //     console.log("Check api get article: ", res);
        //     if (res && res.errCode === 0) {
        //         this.setState({
        //             doctorDetails: res.data,
        //         })
        //     }
        // }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    render() {
        let { language } = this.props;

        return (
            <React.Fragment>
                <CustomScrollbars style={{ height: '100vh', width: '100%' }}>
                    <HomePageHeader isShowBanner={false} />
                    <div className="specialty-article-container">
                        <div className="specialty-décription">

                        </div>
                        <div className="doctors-of-this-specialty">

                        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty);
