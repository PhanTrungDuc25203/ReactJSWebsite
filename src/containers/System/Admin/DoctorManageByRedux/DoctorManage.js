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
        if (prevProps.language !== this.props.language) {
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
            let { resPaymentMethod, resPrice, resProvince } = this.props.allRequiredDoctorData;
            let selectPriceData = this.buildDataForDoctorSelectBox(resPrice);
            let selectPaymentMethodData = this.buildDataForDoctorSelectBox(resPaymentMethod);
            let selectProvinceData = this.buildDataForDoctorSelectBox(resProvince);
            this.setState({
                priceList: selectPriceData,
                paymentMethodList: selectPaymentMethodData,
                vietnamProvinceList: selectProvinceData,
            });
        }
        if (prevProps.language !== this.props.language) {
            let { resPaymentMethod, resPrice, resProvince } = this.props.allRequiredDoctorData;
            let selectPriceData = this.buildDataForDoctorSelectBox(resPrice);
            let selectPaymentMethodData = this.buildDataForDoctorSelectBox(resPaymentMethod);
            let selectProvinceData = this.buildDataForDoctorSelectBox(resProvince);
            this.setState({
                priceList: selectPriceData,
                paymentMethodList: selectPaymentMethodData,
                vietnamProvinceList: selectProvinceData,
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
        })
        console.log("Check parent state: ", this.state);
    }

    handleChangeOnSelectBox = async (selectedDoctor) => {
        this.setState({ selectedDoctor });
        // console.log(selectedDoctor.value);
        await this.props.fetchDoctorDetailsForDoctorManagePage(selectedDoctor.value);
        // console.log("Check doctor details for DoctorManagePage: ", this.state.selectedDoctorDetails);
        let { selectedDoctorDetails } = this.state;
        if (selectedDoctorDetails && selectedDoctorDetails.ArticleMarkdown) {
            let tempMarkdown = selectedDoctorDetails.ArticleMarkdown;
            this.setState({
                htmlContent: tempMarkdown.htmlContent,
                markdownContent: tempMarkdown.markdownContent,
                description: tempMarkdown.description,
                hadOldDataForEdit: true,
            })
        } else {
            this.setState({
                htmlContent: '',
                markdownContent: '',
                description: '',
                hadOldDataForEdit: false,
            })
        }
    };

    buildDataForDoctorSelectBox = (data, isBuiltFor) => {
        let result = [];
        let { language } = this.props;
        if (data && data.length > 0) {
            data.map((item, index) => {
                let tempObj = {};
                let labelInVie = isBuiltFor === 'doctorSelection' ? `${item.lastName} ${item.firstName}` : item.value_Vie;
                let labelInEng = isBuiltFor === 'doctorSelection' ? `${item.firstName} ${item.lastName}` : item.value_Eng;
                tempObj.label = language === LANGUAGES.VI ? labelInVie : labelInEng;
                tempObj.value = item.id;
                result.push(tempObj);
            })

        }
        return result;
    }

    render() {

        let { hadOldDataForEdit } = this.state;
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
                            onChange={(event) => this.handleOnChangeAtDescriptionArea(event)}
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
                        <div className="col-md-4 mb-3">
                            <label>Tỉnh thành</label>
                            <Select
                                value={this.state.selectedProvince}
                                // onChange={this.handleChangeOnSelectBox}
                                options={this.state.vietnamProvinceList}
                                className="doctor-option"
                            // placeholder={<FormattedMessage id="doctor-manage-page-for-admin.select-doctor-placeholder" />}
                            />
                        </div>
                        <div className="col-md-4 mb-3">
                            <label>Địa chỉ phòng khám</label>
                            <input type="text" className="form-control" placeholder="State" required></input>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label>Tên phòng khám</label>
                            <input type="text" className="form-control" placeholder="Zip" required></input>
                        </div>
                    </div>
                    <div className="row row-in-form">
                        <div className="col-md-4 mb-3">
                            <label>Giá khám bệnh</label>
                            <Select
                                value={this.state.selectedDoctor}
                                // onChange={this.handleChangeOnSelectBox}
                                options={this.state.priceList}
                                className="doctor-option"
                            // placeholder={<FormattedMessage id="doctor-manage-page-for-admin.select-doctor-placeholder" />}
                            />
                        </div>
                        <div className="col-md-4 mb-3">
                            <label>Phương thức thanh toán</label>
                            <Select
                                value={this.state.selectedDoctor}
                                // onChange={this.handleChangeOnSelectBox}
                                options={this.state.paymentMethodList}
                                className="doctor-option"
                            // placeholder={<FormattedMessage id="doctor-manage-page-for-admin.select-doctor-placeholder" />}
                            />
                        </div>
                        <div className="col-md-4 mb-3">
                            <label>Ghi chú</label>
                            <input type="text" className="form-control" placeholder="Zip" required></input>
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
