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
            markdownContent: '',
            htmlContent: '',
            selectedDoctor: null,
            description: '',
            listDoctors: [],
            selectedDoctorDetails: {},
            hadOldDataForEdit: false,
        }
    }

    componentDidMount() {
        this.props.fetchAllDoctorsForDoctorArticlePage();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allDoctorsForDoctorArticlePage !== this.props.allDoctorsForDoctorArticlePage) {
            let selectData = this.buildDataForDoctorSelectBox(this.props.allDoctorsForDoctorArticlePage)
            this.setState({
                listDoctors: selectData,
            })
        }
        if (prevProps.language !== this.props.language) {
            let selectData = this.buildDataForDoctorSelectBox(this.props.allDoctorsForDoctorArticlePage)
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

    buildDataForDoctorSelectBox = (data) => {
        let result = [];
        let { language } = this.props;
        if (data && data.length > 0) {
            data.map((item, index) => {
                let tempObj = {};
                let labelInVie = `${item.lastName} ${item.firstName}`;
                let labelInEng = `${item.firstName} ${item.lastName}`;
                tempObj.label = language === LANGUAGES.VI ? labelInVie : labelInEng;
                tempObj.value = item.id;
                result.push(tempObj);
            })

        }
        return result;
    }

    render() {

        let { hadOldDataForEdit } = this.state;

        return (
            <div className="doctor-manage-container">
                <div className="doctor-manage-page-title title">
                    Tạo thông tin, bài báo cho bác sĩ
                </div>
                <div className="header-article-container">
                    <div className="more-info-for-a-doctor">
                        <textarea placeholder='Thông tin giới thiệu:...'
                            onChange={(event) => this.handleOnChangeAtDescriptionArea(event)}
                            value={this.state.description}
                        >

                        </textarea>
                    </div>

                    <div className="option-section">
                        <Select
                            value={this.state.selectedDoctor}
                            onChange={this.handleChangeOnSelectBox}
                            options={this.state.listDoctors}
                            className="doctor-option"
                            placeholder="Chọn bác sĩ..."
                        />
                        <button className={hadOldDataForEdit === true ? "save-changes-of-doctor-article-button" : "save-doctor-article-button"}
                            onClick={() => this.handleSaveMarkdownContent()}
                        >
                            {hadOldDataForEdit === true ?
                                <span>Lưu thay đổi</span>
                                :
                                <span>Lưu bài báo</span>
                            }
                        </button>
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
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctorsForDoctorArticlePage: () => dispatch(actions.fetchAllDoctorsForDoctorArticlePage()),
        saveDoctorDetails: (data) => dispatch(actions.saveDoctorDetails(data)),
        fetchDoctorDetailsForDoctorManagePage: (id) => dispatch(actions.fetchDoctorDetailsForDoctorManagePage(id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorManage);
