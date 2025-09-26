import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LANGUAGES } from "../../../../utils";
import { switchLanguageOfWebsite } from "../../../../store/actions";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import * as actions from "../../../../store/actions";

//cần dùng cái này để chuyển từ html sang text
const mdParser = new MarkdownIt(/* Markdown-it options */);

class EditorLiteForDoctorArticle extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    // Finish!
    handleEditorChange({ html, text }) {
        console.log("handleEditorChange", html, text);
        if (html) {
            this.props.onChangeDoctorArticle(html, text);
        }
    }

    render() {
        return (
            <MdEditor
                style={{ height: "500px" }}
                renderHTML={(text) => mdParser.render(text)}
                //nếu dùng () => ở function này thì sẽ không thể bắt được sự kiện onChange vì đây là
                //truyền props cho MdEditor
                onChange={this.handleEditorChange}
            />
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(EditorLiteForDoctorArticle);
