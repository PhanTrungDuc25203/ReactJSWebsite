import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../../utils";
import { connect } from 'react-redux';
import './ExamPackageManage.scss';
import * as actions from "../../../../store/actions";
import 'react-markdown-editor-lite/lib/index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCameraRetro, faCameraRotate } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import { toast } from "react-toastify";
import { } from '../../../../services/userService';

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ExamPackageManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            listSpecialty: [], selectedSpecialty: '',
            listMedicalFacility: [], selectedMedicalFacility: '',
            htmlDescription: '',
            markdownDescription: '',
            htmlCategory: '',
            markdownCategory: '',
            listPrice: [], selectedPrice: '',
            image: '',
        }
    }

    async componentDidMount() {
        this.props.getRequiredDataForExamPackageManagePage();
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {

    }

    buildDataForSelectBox = (data, isBuiltFor) => {
        let result = [];
        let { language } = this.props;
        if (data && data.length > 0) {
            if (isBuiltFor === 'provinceSelection') {
                data.map((item) => {
                    let tempObj = {};
                    tempObj.label = language === LANGUAGES.VI ? item.value_Vie : item.value_Eng;
                    tempObj.value = item.keyMap;
                    result.push(tempObj);
                });
            }

            if (isBuiltFor === 'specialtySelection') {
                data.map((item) => {
                    let tempObj = {};
                    tempObj.label = item.name;
                    tempObj.value = item.id;
                    result.push(tempObj);
                });
            }
        }
        return result;
    }

    handleEditorForDescriptionChange = ({ html, text }) => {
        this.setState({
            markdownDescription: text,
            htmlDescription: html,
        })
    }

    handleEditorForEquipmentChange = ({ html, text }) => {
        this.setState({
            markdownEquipment: text,
            htmlEquipment: html,
        })
    }

    handleOnChangeText = (event, id) => {
        let stateCopy = { ...this.state };
        stateCopy[id] = event.target.value;
        this.setState({
            ...stateCopy,
        })
    }

    handleChangeSelectProvince = (selectedOption) => {
        this.setState({ selectedProvince: selectedOption });
    }

    handleChangeSelectSpecialty = (selectedOptions) => {
        this.setState({
            selectedSpecialty: selectedOptions
        });
    }

    handleFacilityImageChange = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                previewImageURL: objectUrl,
                image: base64,
            })
        }
    }

    checkInputValidation = () => {
        let isValid = true;
        let needCheckInput = [
            //những trường cần check
        ];
        for (let i = 0; i < needCheckInput.length; i++) {
            if (!this.state[needCheckInput[i]]) {
                isValid = false;
                alert('Thiếu giá trị cho: ' + needCheckInput[i]);
                break;
            }
        }

        return isValid;
    }

    // handleSaveMedicalFacilityInformation = async () => {
    //     console.log("Check facility state: ", this.state);
    //     let isValid = this.checkInputValidation();
    //     if (isValid === false) {
    //         return;
    //     }

    //     try {
    //         let saveFacilityRes = await createMedicalFacility({
    //             name: this.state.medicalFacilityName,
    //             provinceId: this.state.selectedProvince.value,
    //             selectedSpecialty: this.state.selectedSpecialty,
    //             address: this.state.medicalFacilityAddress,
    //             htmlDescription: this.state.htmlDescription,
    //             markdownDescription: this.state.markdownDescription,
    //             htmlEquipment: this.state.htmlEquipment,
    //             markdownEquipment: this.state.markdownEquipment,
    //             image: this.state.image,
    //         })

    //         if (saveFacilityRes.errCode === 0) {
    //             toast.success("Tạo Cơ sở Y tế thành công!");
    //         } else {
    //             toast.success(saveFacilityRes.ereMessage);
    //         }
    //     } catch (error) {
    //         console.error("Error saving medical facility: ", error);
    //     }
    // }

    render() {

        console.log("Check package data: ", this.props.requiredPackageData);

        return (
            <div className="exam-package-manage-container">
                <div className="exam-package-manage-form-title title mb-4">Thông tin cho Gói khám bệnh của Cơ sở Y tế</div>
                <div className="container mt-5">
                    <div className="row">
                        <div className="col-md-8 information-container">
                            <div className="row row-in-form">
                                <div className="col-md-6 mb-3">
                                    <label className="facility-manage-page-title">Tên của Gói khám</label>
                                    <input
                                        type="text"
                                        className="form-control text-input"
                                        placeholder="Gói khám tổng quát..."
                                        required
                                        onChange={(event) => this.handleOnChangeText(event, 'medicalFacilityName')}
                                        value={this.state.clinicName}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="facility-manage-page-title">Chuyên khoa</label>
                                    <Select
                                        value={this.state.selectedProvince}
                                        onChange={this.handleChangeSelectProvince}
                                        options={this.state.provinceOptions}
                                        className="province-option"
                                        name="selectedProvince"
                                    />
                                </div>

                                <div className="col-md-12 mb-3">
                                    <label className="facility-manage-page-title">Thuộc về Cở sở y tế</label>
                                    <Select
                                        value={this.state.selectedProvince}
                                        onChange={this.handleChangeSelectProvince}
                                        options={this.state.provinceOptions}
                                        className="province-option"
                                        name="selectedProvince"
                                    />
                                </div>

                                <div className="col-md-12 mb-3">
                                    <label className="facility-manage-page-title">Giá của Gói khám</label>
                                    <Select
                                        isMulti
                                        closeMenuOnSelect={false}
                                        value={this.state.selectedSpecialty}
                                        onChange={this.handleChangeSelectSpecialty}
                                        options={this.state.specialtyOptions}
                                        className="service-options"
                                        name="selectedServices"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4 image-preview-section">
                            <div className="image-preview-container">
                                <label className="facility-manage-page-title">Ảnh đại diện Gói khám (Logo, tên viết tắt,...)</label>
                                <div
                                    className="image-frame avatar-css"
                                    style={{ backgroundImage: `url(${this.state.previewImageURL})` }}
                                >
                                    <div className={this.state.previewImageURL ? "switch-to-button-change-image" : "choose-avatar-button"}>
                                        <label htmlFor="file-input">
                                            <FontAwesomeIcon icon={this.state.previewImageURL ? faCameraRotate : faCameraRetro} />
                                        </label>
                                    </div>
                                    <input
                                        id="file-input"
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={this.handleFacilityImageChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <label className="facility-manage-page-title">Bài báo giới thiệu chung về Gói khám</label>
                    <div className="editor-lite-for-exam-package-description">
                        <MdEditor
                            style={{ height: '500px' }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={this.handleEditorForDescriptionChange}
                            value={this.state.markdownContent}
                        />
                    </div>
                    <label className="facility-manage-page-title">Các danh mục của Gói khám</label>
                    <div className="editor-lite-for-exam-package-equipments">
                        <MdEditor
                            style={{ height: '500px' }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={this.handleEditorForEquipmentChange}
                            value={this.state.markdownContent}
                        />
                    </div>
                    <div className="save-facility-button">
                        <button
                            onClick={() => this.handleSaveMedicalFacilityInformation()}
                        >Thêm cơ sở Y tế</button>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        requiredPackageData: state.admin.allRequiredDataForExamPackageManage,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        getRequiredDataForExamPackageManagePage: () => dispatch(actions.getRequiredDataForExamPackageManagePage()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ExamPackageManage);
