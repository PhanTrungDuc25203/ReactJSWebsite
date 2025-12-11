import React, { Component } from "react";
import { connect } from "react-redux";
import Select from "react-select";
import { LANGUAGES } from "../../../utils";
import * as actions from "../../../store/actions";
import { toast } from "react-toastify";
// import "./ExamPackageResultTemplateManage.scss";
// import { createResultTemplateService } from "../../services/userService"; // bạn cần tạo API này

class ExamPackageResultTemplateManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listPackages: [],
            selectedPackage: null,

            sections: [
                {
                    title: "",
                    fields: [
                        {
                            code: "",
                            label: "",
                            unit: "",
                            normal_range: "",
                            value: null,
                        },
                    ],
                },
            ],
        };
    }

    async componentDidMount() {
        this.props.getAllExamPackage("ALL");
    }

    componentDidUpdate(prevProps) {
        if (prevProps.allPackagesData !== this.props.allPackagesData) {
            const selectData = this.buildDataForPackageSelectBox(this.props.allPackagesData);
            this.setState({ listPackages: selectData });
        }
    }

    buildDataForPackageSelectBox = (data) => {
        let result = [];
        let { language } = this.props;
        if (data && data.length > 0) {
            data.map((item) => {
                let tempObj = {};
                tempObj.label = language === LANGUAGES.VI ? item.name : item.name;
                tempObj.value = item.id;
                result.push(tempObj);
                return item;
            });
        }
        return result;
    };

    handleChangeOnSelectBox = (selectedPackage) => {
        this.setState({ selectedPackage });
    };

    handleAddSection = () => {
        const sections = [...this.state.sections];
        sections.push({
            title: "",
            fields: [
                {
                    code: "",
                    label: "",
                    unit: "",
                    normal_range: "",
                    value: null,
                },
            ],
        });
        this.setState({ sections });
    };

    handleAddField = (sectionIndex) => {
        const sections = [...this.state.sections];
        sections[sectionIndex].fields.push({
            code: "",
            label: "",
            unit: "",
            normal_range: "",
            value: null,
        });
        this.setState({ sections });
    };

    handleSectionTitleChange = (value, sectionIndex) => {
        const sections = [...this.state.sections];
        sections[sectionIndex].title = value;
        this.setState({ sections });
    };

    handleFieldChange = (value, sectionIndex, fieldIndex, fieldKey) => {
        const sections = [...this.state.sections];
        sections[sectionIndex].fields[fieldIndex][fieldKey] = value;
        this.setState({ sections });
    };

    handleSaveTemplate = async () => {
        let { selectedPackage, sections } = this.state;

        if (!selectedPackage) {
            toast.error("Bạn phải chọn gói khám!");
            return;
        }

        const payload = {
            examPackageId: selectedPackage.value,
            version: 1,
            template: JSON.stringify({
                sections: sections,
            }),
        };
        console.log("check payload: ", payload);

        // const res = await createResultTemplateService(payload);
        // if (res && res.errCode === 0) {
        //     toast.success("Lưu biểu mẫu thành công!");
        // } else {
        //     toast.error("Có lỗi xảy ra!");
        // }
    };

    render() {
        const { sections } = this.state;

        return (
            <div className="exam-package-result-template-manage-container">
                <div className="title">Tạo Biểu Mẫu Kết Quả Xét Nghiệm</div>

                <div className="content-container">
                    <div className="container">
                        {/* Chọn gói khám */}
                        <div className="row">
                            <div className="col-md-6 form-group">
                                <label>Chọn Gói khám</label>
                                <Select value={this.state.selectedPackage} onChange={this.handleChangeOnSelectBox} options={this.state.listPackages} placeholder="Chọn gói khám..." />
                            </div>
                        </div>

                        <hr />

                        {/* Danh sách sections */}
                        {sections.map((section, sectionIndex) => (
                            <div className="section-box" key={sectionIndex}>
                                <div className="section-header">
                                    <input type="text" placeholder="Tên mục (VD: Huyết học, Sinh hóa...)" className="form-control section-title-input" value={section.title} onChange={(e) => this.handleSectionTitleChange(e.target.value, sectionIndex)} />

                                    <button className="btn btn-success" onClick={() => this.handleAddField(sectionIndex)}>
                                        + Thêm trường
                                    </button>
                                </div>

                                {/* Field list */}
                                <table className="table table-bordered mt-3">
                                    <thead>
                                        <tr>
                                            <th>Code</th>
                                            <th>Label</th>
                                            <th>Unit</th>
                                            <th>Normal Range</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {section.fields.map((field, fieldIndex) => (
                                            <tr key={fieldIndex}>
                                                <td>
                                                    <input type="text" className="form-control" value={field.code} onChange={(e) => this.handleFieldChange(e.target.value, sectionIndex, fieldIndex, "code")} />
                                                </td>
                                                <td>
                                                    <input type="text" className="form-control" value={field.label} onChange={(e) => this.handleFieldChange(e.target.value, sectionIndex, fieldIndex, "label")} />
                                                </td>
                                                <td>
                                                    <input type="text" className="form-control" value={field.unit} onChange={(e) => this.handleFieldChange(e.target.value, sectionIndex, fieldIndex, "unit")} />
                                                </td>
                                                <td>
                                                    <input type="text" className="form-control" value={field.normal_range} onChange={(e) => this.handleFieldChange(e.target.value, sectionIndex, fieldIndex, "normal_range")} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}

                        {/* Nút thêm section */}
                        <button className="btn btn-secondary mt-3" onClick={this.handleAddSection}>
                            + Thêm mục (Section)
                        </button>

                        {/* Nút Lưu */}
                        <button className="save-button btn btn-primary mt-4" onClick={this.handleSaveTemplate}>
                            Lưu biểu mẫu
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        allPackagesData: state.admin.allPackagesData,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getAllExamPackage: (inputId) => dispatch(actions.getAllExamPackage(inputId)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ExamPackageResultTemplateManage);
