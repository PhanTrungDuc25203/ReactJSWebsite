import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LANGUAGES } from "../../../../utils";
import { switchLanguageOfWebsite } from "../../../../store/actions";
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';
import * as actions from "../../../../store/actions";

// Register plugins if required
// MdEditor.use(YOUR_PLUGINS_HERE);

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);

// Finish!
function handleEditorChange({ html, text }) {
    console.log('handleEditorChange', html, text);
}

class EditorLiteForDoctorArticle extends Component {
    render() {
        return (
            <MdEditor style={{ height: '500px' }} renderHTML={text => mdParser.render(text)} onChange={handleEditorChange} />
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        // Redux-getGender-(25): map state tại đây, thông qua admin có thể lấy được adminReducer
        //và trong adminReducer tôi muốn lấy state của genders (state bao gồm genders,roles và positions)
        // Redux-getGender-(26): và cuối cùng cho render lấy và hiển thị thôi
        genderValueByRedux: state.admin.genders,
        positionValueByRedux: state.admin.positions,
        roleValueByRedux: state.admin.roles,
        isLoadingGenderValue: state.admin.isLoadingGenderValue,
        usersFromRedux: state.admin.users,

    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenderValueStart: () => dispatch(actions.fetchGenderValueStart()),
        // Redux-getGender-(19): trở lại hàm didMount
        // processLogout: () => dispatch(actions.processLogout()),
        // switchLanguageOfWebsite: (language) => dispatch(actions.switchLanguageOfWebsite(language)),
        getPositionValueStart: () => dispatch(actions.fetchPositionValueStart()),
        getRoleValueStart: () => dispatch(actions.fetchRoleValueStart()),
        addNewUserByRedux: (data) => dispatch(actions.addNewUserByRedux(data)),
        fetchUserFromRedux: () => dispatch(actions.fetchAllUsersValueStart()),
        editUserByRedux: (data) => dispatch(actions.editUserByRedux(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditorLiteForDoctorArticle);