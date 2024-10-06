import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../../utils";
import { connect } from 'react-redux';
import './MedicalFacilityManage.scss';
import * as actions from "../../../../store/actions";
import 'react-markdown-editor-lite/lib/index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCameraRetro, faCameraRotate } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import { toast } from "react-toastify";
import { getAllSpecialtyAndProvinceForMedicalFacilityManagePage, createMedicalFacility } from '../../../../services/userService';

const mdParser = new MarkdownIt(/* Markdown-it options */);

class MedicalFacilityManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //data cần lưu cho một facility
            medicalFacilityName: '',
            selectedProvince: null,
            medicalFacilityAddress: '',
            selectedSpecialty: [],
            previewImageURL: null,
            image: '',

            markdownDescription: '',
            htmlDescription: '',
            markdownEquipment: '',
            htmlEquipment: '',
            //data có sẵn
            specialtyOptions: [],
            provinceOptions: [],
        }
    }

    async componentDidMount() {
        try {
            let res = await getAllSpecialtyAndProvinceForMedicalFacilityManagePage();
            if (res && res.specialtyData && res.provinceData) {
                let specialtyOptions = this.buildDataForSelectBox(res.specialtyData, 'specialtySelection');
                let provinceOptions = this.buildDataForSelectBox(res.provinceData, 'provinceSelection');
                this.setState({
                    specialtyOptions: specialtyOptions,
                    provinceOptions: provinceOptions,
                });
            }
        } catch (error) {
            console.error("Error fetching specialty data:", error);
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
            try {
                let res = await getAllSpecialtyAndProvinceForMedicalFacilityManagePage();
                if (res && res.specialtyData && res.provinceData) {
                    let specialtyOptions = this.buildDataForSelectBox(res.specialtyData, 'specialtySelection');
                    let provinceOptions = this.buildDataForSelectBox(res.provinceData, 'provinceSelection');
                    this.setState({
                        specialtyOptions: specialtyOptions,
                        provinceOptions: provinceOptions,
                    });
                }
            } catch (error) {
                console.error("Error fetching specialty data:", error);
            }
        }
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
        let needCheckInput = ['medicalFacilityName', 'selectedProvince', 'medicalFacilityAddress',
            'selectedSpecialty', 'image', 'htmlDescription', 'markdownEquipment'];
        for (let i = 0; i < needCheckInput.length; i++) {
            if (!this.state[needCheckInput[i]]) {
                isValid = false;
                alert('Thiếu giá trị cho: ' + needCheckInput[i]);
                break;
            }
        }

        return isValid;
    }

    handleSaveMedicalFacilityInformation = async () => {
        console.log("Check facility state: ", this.state);
        let isValid = this.checkInputValidation();
        if (isValid === false) {
            return;
        }

        try {
            let saveFacilityRes = await createMedicalFacility({
                name: this.state.medicalFacilityName,
                provinceId: this.state.selectedProvince.value,
                selectedSpecialty: this.state.selectedSpecialty,
                address: this.state.medicalFacilityAddress,
                htmlDescription: this.state.htmlDescription,
                markdownDescription: this.state.markdownDescription,
                htmlEquipment: this.state.htmlEquipment,
                markdownEquipment: this.state.markdownEquipment,
                image: this.state.image,
            })

            if (saveFacilityRes.errCode === 0) {
                toast.success("Tạo Cơ sở Y tế thành công!");
            } else {
                toast.success(saveFacilityRes.ereMessage);
            }
        } catch (error) {
            console.error("Error saving medical facility: ", error);
        }
    }

    render() {
        return (
            <div className="medical-facility-manage-container">
                <div className="medical-facility-manage-form-title title mb-4">Thông tin cho Cơ sở Y tế</div>
                <div className="container mt-5">
                    <div className="row">
                        <div className="col-md-8 information-container">
                            <div className="row row-in-form">
                                <div className="col-md-6 mb-3">
                                    <label className="facility-manage-page-title">Tên cơ sở Y tế</label>
                                    <input
                                        type="text"
                                        className="form-control text-input"
                                        placeholder="Bệnh viện/phòng khám..."
                                        required
                                        onChange={(event) => this.handleOnChangeText(event, 'medicalFacilityName')}
                                        value={this.state.clinicName}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="facility-manage-page-title">Tỉnh thành</label>
                                    <Select
                                        value={this.state.selectedProvince}
                                        onChange={this.handleChangeSelectProvince}
                                        options={this.state.provinceOptions}
                                        className="province-option"
                                        name="selectedProvince"
                                    />
                                </div>

                                {/* Full-width input for clinic address */}
                                <div className="col-md-12 mb-3">
                                    <label className="facility-manage-page-title">Địa chỉ cơ sở Y tế</label>
                                    <input
                                        type="text"
                                        className="form-control text-input"
                                        placeholder="Địa chỉ cụ thể..."
                                        required
                                        onChange={(event) => this.handleOnChangeText(event, 'medicalFacilityAddress')} // Sử dụng hàm mới
                                        value={this.state.clinicAddress}
                                    />
                                </div>

                                {/* Full-width multi-select for services */}
                                <div className="col-md-12 mb-3">
                                    <label className="facility-manage-page-title">Chọn các chuyên khoa của Cơ sở</label>
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
                                <label className="facility-manage-page-title">Ảnh đại diện của cơ sở Y tế (Logo, tên viết tắt,...)</label>
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

                    <label className="facility-manage-page-title">Bài báo giới thiệu chung về cơ sở</label>
                    <div className="editor-lite-for-medical-facility-description">
                        <MdEditor
                            style={{ height: '500px' }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={this.handleEditorForDescriptionChange}
                            value={this.state.markdownContent}
                        />
                    </div>
                    <label className="facility-manage-page-title">Bài báo về trang thiết bị của cơ sở</label>
                    <div className="editor-lite-for-medical-facility-equipments">
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
    };
}

const mapDispatchToProps = dispatch => {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(MedicalFacilityManage);
