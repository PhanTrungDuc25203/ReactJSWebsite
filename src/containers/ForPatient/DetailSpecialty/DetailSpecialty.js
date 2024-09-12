import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import HomePageHeader from '../../HomePage/HomePageHeader/HomePageHeader';
import './DetailSpecialty.scss';
import HomeFooter from '../../HomePage/HomeFooter/HomeFooter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import { getInforAndArticleForADoctor, getAllSpecialtyDetailsById, getAllCodesService } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
import CustomScrollbars from '../../../components/CustomScrollbars';
import DoctorScheduleComponent from '../DoctorScheduleComponent/DoctorScheduleComponent';
import _ from 'lodash';

class DetailSpecialty extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrDoctorId: [],
            specialtyDetailData: {},
            provinceList: [],
        }
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;

            let res = await getAllSpecialtyDetailsById({
                id: id,
                location: 'ALL',
            });

            let resProvince = await getAllCodesService('province');

            if (res && res.errCode === 0 && resProvince && resProvince.errCode === 0) {
                let data = res.data;
                let arrDoctorId = [];
                if (data && !_.isEmpty(res.data)) {
                    let arr = data.doctorInSpecialty;
                    if (arr && arr.length > 0) {
                        arr.map(item => {
                            arrDoctorId.push(item.doctorId)
                        })
                    }
                }

                let provinceData = resProvince.data;
                if (provinceData && provinceData.length > 0) {
                    provinceData.unshift({
                        createAt: null,
                        keyMap: 'ALL',
                        type: "PROVINCE",
                        value_Eng: "All",
                        value_Vie: "Toàn quốc",
                    })
                }

                this.setState({
                    specialtyDetailData: res.data,
                    arrDoctorId: arrDoctorId,
                    provinceList: provinceData ? provinceData : [],
                })
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    handleOnChangeSelect = (event) => {
        // Reset lại danh sách bác sĩ trước khi cập nhật
        this.setState({
            arrDoctorId: [],
        }, async () => {
            if (this.props.match && this.props.match.params && this.props.match.params.id) {
                let id = this.props.match.params.id;
                let location = event.target.value;

                let res = await getAllSpecialtyDetailsById({
                    id: id,
                    location: location
                });

                if (res && res.errCode === 0) {
                    let data = res.data;
                    let doctorIdArr = [];
                    if (data && !_.isEmpty(data)) {
                        let arr = data.doctorInSpecialty;
                        if (arr && arr.length > 0) {
                            arr.map(item => {
                                doctorIdArr.push(item.doctorId);
                            });
                        }
                    }

                    this.setState({
                        specialtyDetailData: res.data,
                        arrDoctorId: doctorIdArr,
                    });
                }
            }
        });
    };


    render() {
        let { language } = this.props;
        let { arrDoctorId, specialtyDetailData, provinceList, } = this.state;
        // console.log("check state: ", this.state);
        // console.log("check props: ", this.props);
        return (
            <React.Fragment>
                <CustomScrollbars style={{ height: '100vh', width: '100%' }}>
                    <HomePageHeader isShowBanner={false} />
                    <div className="specialty-article-container">
                        <div className="specialty-description background-image-css"
                            style={{
                                backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.92), 
                            rgba(255, 255, 255, 0.85), rgb(255, 255, 255)), url(${specialtyDetailData.specialtyImage})`
                            }}
                        >
                            <div className="specialty-name">
                                {specialtyDetailData.name}
                            </div>
                            <div className="details">
                                {specialtyDetailData && !_.isEmpty(specialtyDetailData) &&
                                    <div dangerouslySetInnerHTML={{ __html: specialtyDetailData.htmlDescription }} className="specialty-html"></div>
                                }
                            </div>
                        </div>
                        <div className="doctors-of-this-specialty-title">
                            Các bác sĩ ưu tú của chuyên khoa {specialtyDetailData.name}
                            <div className="select-province-where-doctor-live">
                                <select
                                    onChange={(event) => this.handleOnChangeSelect(event)}
                                >
                                    {provinceList && provinceList.length > 0 &&
                                        provinceList.map((item, index) => {
                                            return (
                                                <option key={index}
                                                    value={item.keyMap}
                                                >
                                                    {language === LANGUAGES.VI ? item.value_Vie : item.value_Eng}
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                        </div>

                        {this.state.arrDoctorId && this.state.arrDoctorId.length > 0 ?
                            arrDoctorId.map((item, index) => {
                                return (
                                    <div className="doctors-of-this-specialty" key={index}>
                                        <DoctorScheduleComponent
                                            doctorId={item}
                                        />
                                    </div>
                                )
                            })
                            :
                            <div className="apologize">
                                <div className="apologize-image"></div>
                                Vô cùng xin lỗi quý khách! Hiện tại chưa có bác sĩ nào thuộc chuyên khoa này.
                            </div>
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
