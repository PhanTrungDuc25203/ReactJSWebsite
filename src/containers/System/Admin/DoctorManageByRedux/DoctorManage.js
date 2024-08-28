import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from "../../../../utils";
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
        console.log("CHeck parent state: ", this.state);
    }

    handleChangeOnSelectBox = (selectedDoctor) => {
        this.setState({ selectedDoctor }, () =>
            console.log(`Option selected:`, this.state.selectedDoctor)
        );
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
        return (
            <div className="doctor-manage-container">
                <div className="doctor-manage-page-title title">
                    Tạo thông tin bác sĩ
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
                        <button className="save-doctor-article-button"
                            onClick={() => this.handleSaveMarkdownContent()}
                        >
                            Lưu bài báo
                        </button>
                    </div>


                </div>



                <div className="editor-lite-for-doctor-article">
                    <MdEditor style={{ height: '500px' }}
                        renderHTML={text => mdParser.render(text)}
                        onChange={this.handleEditorChange} />
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        allDoctorsForDoctorArticlePage: state.admin.allDoctorsForDoctorArticlePage,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctorsForDoctorArticlePage: () => dispatch(actions.fetchAllDoctorsForDoctorArticlePage()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorManage);
