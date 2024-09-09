import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES, CRUD_ACTIONS } from "../../../../utils";
import { connect } from 'react-redux';
import './DoctorManage.scss';
import * as actions from "../../../../store/actions";
import 'react-markdown-editor-lite/lib/index.css';
import Select from 'react-select';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';

const mdParser = new MarkdownIt(/* Markdown-it options */);

class DoctorManage extends Component {
    constructor(props) {
        super(props);
        this.state = {

            //save to markdown table in db
            markdownContent: '',
            htmlContent: '',
            selectedDoctor: null,
            description: '',
            listDoctors: [],
            selectedDoctorDetails: {},
            hadOldDataForEdit: false,

            //save to doctor_infor table in db
            priceList: [], selectedPrice: '',
            paymentMethodList: [], selectedPaymentMethod: '',
            vietnamProvinceList: [], selectedProvince: '',
            clinicList: [], selectedClinic: '',
            specialtyList: [], selectedSpecialty: '',
            clinicName: '',
            clinicAddress: '',
            note: '',
        }
    }

    componentDidMount() {
        this.props.fetchAllDoctorsForDoctorArticlePage();
        //lấy extra data cho doctor
        this.props.getRequiredDataForDoctorArticleManagePage();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allDoctorsForDoctorArticlePage !== this.props.allDoctorsForDoctorArticlePage) {
            let selectData = this.buildDataForDoctorSelectBox(this.props.allDoctorsForDoctorArticlePage, 'doctorSelection')
            this.setState({
                listDoctors: selectData,
            })
        }

        if (prevProps.detailsOfADoctor !== this.props.detailsOfADoctor) {
            // console.log("Check doctor details for DoctorManagePage: ", this.props.detailsOfADoctor);
            this.setState({
                selectedDoctorDetails: this.props.detailsOfADoctor,
            });
        }

        if (prevProps.allRequiredDoctorData !== this.props.allRequiredDoctorData) {
            // console.log("Doctor extra data in page: ", this.props.allRequiredDoctorData);
            let { resPaymentMethod, resPrice, resProvince, resSpecialty } = this.props.allRequiredDoctorData;
            let selectPriceData = this.buildDataForDoctorSelectBox(resPrice, 'priceSelection');
            let selectPaymentMethodData = this.buildDataForDoctorSelectBox(resPaymentMethod, 'paymentMethodSelection');
            let selectProvinceData = this.buildDataForDoctorSelectBox(resProvince, 'provinceSelection');
            let selectSpecialtyData = this.buildDataForDoctorSelectBox(resSpecialty, 'specialtySection');
            this.setState({
                priceList: selectPriceData,
                paymentMethodList: selectPaymentMethodData,
                vietnamProvinceList: selectProvinceData,
                specialtyList: selectSpecialtyData,
            });
        }
        if (prevProps.language !== this.props.language) {
            let selectData = this.buildDataForDoctorSelectBox(this.props.allDoctorsForDoctorArticlePage, 'doctorSelection')
            let { resPaymentMethod, resPrice, resProvince } = this.props.allRequiredDoctorData;
            let selectPriceData = this.buildDataForDoctorSelectBox(resPrice, 'priceSelection');
            let selectPaymentMethodData = this.buildDataForDoctorSelectBox(resPaymentMethod, 'paymentMethodSelection');
            let selectProvinceData = this.buildDataForDoctorSelectBox(resProvince, 'provinceSelection');
            this.setState({
                priceList: selectPriceData,
                paymentMethodList: selectPaymentMethodData,
                vietnamProvinceList: selectProvinceData,
                listDoctors: selectData,
            });
        }
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            markdownContent: text,
            htmlContent: html,
        })
    }

    handleOnChangeAtDescriptionArea = (event) => {
        this.setState({
            description: event.target.value,
        })
    }

    handleSaveMarkdownContent = () => {
        let { hadOldDataForEdit } = this.state;
        this.props.saveDoctorDetails({
            htmlContent: this.state.htmlContent,
            markdownContent: this.state.markdownContent,
            description: this.state.description,
            doctorId: this.state.selectedDoctor.value,
            action: hadOldDataForEdit === true ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,

            selectedPrice: this.state.selectedPrice.value,
            selectedPaymentMethod: this.state.selectedPaymentMethod.value,
            selectedProvince: this.state.selectedProvince.value,
            clinicName: this.state.clinicName,
            clinicAddress: this.state.clinicAddress,
            note: this.state.note,
            clinicId: this.state.selectedClinic && this.state.selectedClinic.value ? this.state.selectedClinic.value : '',
            specialtyId: this.state.selectedSpecialty.value,
        })
        console.log("Check parent state: ", this.state);
    }

    handleChangeSelectDoctorInfor = async (selectedOption, name) => {
        let stateName = name.name;
        let stateCopy = { ...this.state };
        stateCopy[stateName] = selectedOption;
        this.setState({
            ...stateCopy,
        })
    }

    handleOnChangeText = (event, id) => {
        let stateCopy = { ...this.state };
        stateCopy[id] = event.target.value;
        this.setState({
            ...stateCopy,
        })
    }

    handleChangeOnSelectBox = async (selectedDoctor) => {
        this.setState({ selectedDoctor });
        let { priceList, paymentMethodList, vietnamProvinceList } = this.state;
        // console.log(selectedDoctor.value);
        await this.props.fetchDoctorDetailsForDoctorManagePage(selectedDoctor.value);
        console.log("Check doctor details for DoctorManagePage: ", this.state.selectedDoctorDetails);
        let { selectedDoctorDetails } = this.state;
        if (selectedDoctorDetails && selectedDoctorDetails.ArticleMarkdown) {
            let tempMarkdown = selectedDoctorDetails.ArticleMarkdown;

            let tempClinicAddress = '', tempClinicName = '', tempNote = '', tempPaymentId = '',
                tempPriceId = '', tempProvinceId = '', tempSelectedPaymentMethod = '',
                tempSelectedPrice = '', tempSelectedProvince = '';

            if (selectedDoctorDetails.Doctor_infor) {
                tempClinicAddress = selectedDoctorDetails.Doctor_infor.clinicAddress;
                tempClinicName = selectedDoctorDetails.Doctor_infor.clinicName;
                tempNote = selectedDoctorDetails.Doctor_infor.note;
                tempPaymentId = selectedDoctorDetails.Doctor_infor.paymentId;
                tempPriceId = selectedDoctorDetails.Doctor_infor.priceId;
                tempProvinceId = selectedDoctorDetails.Doctor_infor.provinceId;

                tempSelectedPaymentMethod = paymentMethodList.find(item => {
                    return item && item.value === tempPaymentId;
                })
                tempSelectedPrice = priceList.find(item => {
                    return item && item.value === tempPriceId;
                })
                tempSelectedProvince = vietnamProvinceList.find(item => {
                    return item && item.value === tempProvinceId;
                })
            }

            this.setState({
                htmlContent: tempMarkdown.htmlContent,
                markdownContent: tempMarkdown.markdownContent,
                description: tempMarkdown.description,
                hadOldDataForEdit: true,
                selectedPrice: tempSelectedPrice,
                selectedPaymentMethod: tempSelectedPaymentMethod,
                selectedProvince: tempSelectedProvince,
                clinicName: tempClinicName,
                clinicAddress: tempClinicAddress,
                note: tempNote,
            })
        } else {
            this.setState({
                htmlContent: '',
                markdownContent: '',
                description: '',
                hadOldDataForEdit: false,
                clinicName: '',
                clinicAddress: '',
                note: '',
            })
        }
    };

    buildDataForDoctorSelectBox = (data, isBuiltFor) => {
        let result = [];
        let { language } = this.props;
        if (data && data.length > 0) {
            // data.map((item, index) => {
            //     let tempObj = {};
            //     let labelInVie = isBuiltFor === 'doctorSelection' ? `${item.lastName} ${item.firstName}` : item.value_Vie;
            //     let labelInEng = isBuiltFor === 'doctorSelection' ? `${item.firstName} ${item.lastName}` : item.value_Eng;
            //     tempObj.label = language === LANGUAGES.VI ? labelInVie : labelInEng;
            //     tempObj.value = item.id;
            //     result.push(tempObj);
            // })
            if (isBuiltFor === 'doctorSelection') {
                data.map((item, index) => {
                    let tempObj = {};
                    let labelInVie = `${item.lastName} ${item.firstName}`;
                    let labelInEng = `${item.firstName} ${item.lastName}`;
                    tempObj.label = language === LANGUAGES.VI ? labelInVie : labelInEng;
                    tempObj.value = item.id;
                    result.push(tempObj);
                })
            }
            if (isBuiltFor === 'priceSelection') {
                data.map((item, index) => {
                    let tempObj = {};
                    let labelInVie = `${item.value_Vie} đồng`;
                    let labelInEng = `${item.value_Eng} $ (USD)`;
                    tempObj.label = language === LANGUAGES.VI ? labelInVie : labelInEng;
                    tempObj.value = item.keyMap;
                    result.push(tempObj);
                })
            }
            if (isBuiltFor === 'paymentMethodSelection' || isBuiltFor === 'provinceSelection') {
                data.map((item, index) => {
                    let tempObj = {};
                    let labelInVie = `${item.value_Vie}`;
                    let labelInEng = `${item.value_Eng}`;
                    tempObj.label = language === LANGUAGES.VI ? labelInVie : labelInEng;
                    tempObj.value = item.keyMap;
                    result.push(tempObj);
                })
            }
            if (isBuiltFor === 'specialtySection') {
                data.map((item, index) => {
                    let tempObj = {};
                    tempObj.label = item.name;
                    tempObj.value = item.id;
                    result.push(tempObj);
                })
            }

        }
        return result;
    }

    render() {

        let { hadOldDataForEdit, specialtyList } = this.state;
        let { language } = this.props;

        return (
            <div className="doctor-manage-container">
                <div className="doctor-manage-page-title title">
                    <FormattedMessage id="doctor-manage-page-for-admin.page-title" />
                </div>
                <div className="header-article-container">
                    <div className="more-info-for-a-doctor">
                        <textarea placeholder={language === LANGUAGES.VI ?
                            "Thông tin giới thiệu..."
                            :
                            "Introduction information..."
                        }
                            onChange={(event) => this.handleOnChangeText(event, 'description')}
                            value={this.state.description}
                        >

                        </textarea>
                    </div>

                    <div className="option-section">
                        <button className={hadOldDataForEdit === true ? "save-changes-of-doctor-article-button" : "save-doctor-article-button"}
                            onClick={() => this.handleSaveMarkdownContent()}
                        >
                            {hadOldDataForEdit === true ?
                                <span><FormattedMessage id="doctor-manage-page-for-admin.save-changes-button" /></span>
                                :
                                <span><FormattedMessage id="doctor-manage-page-for-admin.save-article-button" /></span>
                            }
                        </button>
                        <Select
                            value={this.state.selectedDoctor}
                            onChange={this.handleChangeOnSelectBox}
                            options={this.state.listDoctors}
                            className="doctor-option"
                            placeholder={<FormattedMessage id="doctor-manage-page-for-admin.select-doctor-placeholder" />}
                        />
                    </div>


                </div>

                <div className="extra-infor-container">
                    <div className="row row-in-form">
                        <div className="col-md-3 mb-3">
                            <label>Tỉnh thành</label>
                            <Select
                                value={this.state.selectedProvince}
                                onChange={this.handleChangeSelectDoctorInfor}
                                options={this.state.vietnamProvinceList}
                                className="doctor-option"
                                name="selectedProvince"
                            // placeholder={<FormattedMessage id="doctor-manage-page-for-admin.select-doctor-placeholder" />}
                            />
                        </div>
                        <div className="col-md-3 mb-3">
                            <label>Địa chỉ phòng khám</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Địa chỉ phòng khám..."
                                required
                                onChange={(event) => this.handleOnChangeText(event, 'clinicAddress')}
                                value={this.state.clinicAddress}
                            >
                            </input>
                        </div>
                        <div className="col-md-3 mb-3">
                            <label>Tên phòng khám</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Tên phòng khám..."
                                required
                                onChange={(event) => this.handleOnChangeText(event, 'clinicName')}
                                value={this.state.clinicName}
                            ></input>
                        </div>
                        <div className="col-md-3 mb-3">
                            <label>Chọn phòng khám</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Tên phòng khám..."
                                required
                                // onChange={(event) => this.handleOnChangeText(event, 'clinicName')}
                                value={this.state.selectedClinic}
                            ></input>
                        </div>
                    </div>
                    <div className="row row-in-form">
                        <div className="col-md-3 mb-3">
                            <label>Chuyên khoa bác sĩ</label>
                            <Select
                                value={this.state.selectedSpecialty}
                                onChange={this.handleChangeSelectDoctorInfor}
                                options={this.state.specialtyList}
                                className="doctor-option"
                                name="selectedSpecialty"
                            // placeholder={<FormattedMessage id="doctor-manage-page-for-admin.select-doctor-placeholder" />}
                            />
                        </div>
                        <div className="col-md-3 mb-3">
                            <label>Giá khám bệnh</label>
                            <Select
                                value={this.state.selectedPrice}
                                onChange={this.handleChangeSelectDoctorInfor}
                                options={this.state.priceList}
                                className="doctor-option"
                                name="selectedPrice"
                            // placeholder={<FormattedMessage id="doctor-manage-page-for-admin.select-doctor-placeholder" />}
                            />
                        </div>
                        <div className="col-md-3 mb-3">
                            <label>Phương thức thanh toán</label>
                            <Select
                                value={this.state.selectedPaymentMethod}
                                onChange={this.handleChangeSelectDoctorInfor}
                                options={this.state.paymentMethodList}
                                className="doctor-option"
                                name="selectedPaymentMethod"
                            // placeholder={<FormattedMessage id="doctor-manage-page-for-admin.select-doctor-placeholder" />}
                            />
                        </div>
                        <div className="col-md-3 mb-3">
                            <label>Ghi chú</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Ghi chú..."
                                required
                                onChange={(event) => this.handleOnChangeText(event, 'note')}
                                value={this.state.note}
                            ></input>
                        </div>
                    </div>
                </div>

                <div className="editor-lite-for-doctor-article">
                    <MdEditor style={{ height: '500px' }}
                        renderHTML={text => mdParser.render(text)}
                        onChange={this.handleEditorChange}
                        value={this.state.markdownContent}
                    />
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        allDoctorsForDoctorArticlePage: state.admin.allDoctorsForDoctorArticlePage,
        detailsOfADoctor: state.admin.detailsOfADoctor,
        allRequiredDoctorData: state.admin.allRequiredDoctorData,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctorsForDoctorArticlePage: () => dispatch(actions.fetchAllDoctorsForDoctorArticlePage()),
        saveDoctorDetails: (data) => dispatch(actions.saveDoctorDetails(data)),
        fetchDoctorDetailsForDoctorManagePage: (id) => dispatch(actions.fetchDoctorDetailsForDoctorManagePage(id)),

        getRequiredDataForDoctorArticleManagePage: () => dispatch(actions.getRequiredDataForDoctorArticleManagePage())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorManage);
