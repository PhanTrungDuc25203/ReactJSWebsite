import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../../utils";
import { connect } from 'react-redux';
import './ExamPackageScheduleManage.scss';
import * as actions from "../../../../store/actions";
import 'react-markdown-editor-lite/lib/index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCameraRetro, faCameraRotate } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import { toast } from "react-toastify";
import { createPackageFacility } from '../../../../services/userService';

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ExamPackageScheduleManage extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    async componentDidMount() {

    }

    async componentDidUpdate(prevProps, prevState, snapshot) {

    }

    render() {
        return (
            <div className="exam-package-manage-container">
                This is package schedule manage page
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        requiredPackageData: state.admin.allRequiredDataForExamPackageScheduleManage,
    };
}

const mapDispatchToProps = dispatch => {
    return {

    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ExamPackageScheduleManage);
