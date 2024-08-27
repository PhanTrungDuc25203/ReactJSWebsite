import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from "../../../../utils";
import { connect } from 'react-redux';
import './DoctorManage.scss';
import * as actions from "../../../../store/actions";
import EditorLiteForDoctorArticle from '../EditorLiteForDoctorArticle/EditorLiteForDoctorArticle';
import Select from 'react-select';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';

const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
];

const mdParser = new MarkdownIt(/* Markdown-it options */);

class DoctorManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            markdownContent: '',
            htmlContent: '',
            selectedDoctor: null,
            description: '',
        }
    }

    componentDidMount() {

    }
    componentDidUpdate(prevProps, prevState, snapshot) {

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

    handleChange = (selectedDoctor) => {
        this.setState({ selectedDoctor }, () =>
            console.log(`Option selected:`, this.state.selectedDoctor)
        );
    };

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
                            onChange={this.handleChange}
                            options={options}
                            className="doctor-option"
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
                        //nếu dùng () => ở function này thì sẽ không thể bắt được sự kiện onChange vì đây là
                        //truyền props cho MdEditor
                        onChange={this.handleEditorChange} />
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        usersFromRedux: state.admin.users,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchUserFromRedux: () => dispatch(actions.fetchAllUsersValueStart()),
        deleteUserByRedux: (id) => dispatch(actions.deleteUserByRedux(id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorManage);
