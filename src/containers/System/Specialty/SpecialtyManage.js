import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './SpecialtyManage.scss';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import { CommonUtils } from '../../../utils';
import { } from '../../../services/userService';
import { toast } from 'react-toastify';
import { createNewSpecialtyService } from '../../../services/userService';

const mdParser = new MarkdownIt(/* Markdown-it options */);

class SpecialtyManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            imageBase64: '',
            htmlDescription: '',
            markdownDescription: '',

            imageSelected: false,
        }
    }

    async componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {

        }
    }

    handleOnchangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState,
        })
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            markdownDescription: text,
            htmlDescription: html,
        })
    }

    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let imageBase64 = await CommonUtils.getBase64(file);
            this.setState({
                imageBase64: imageBase64,
                imageSelected: true,
            })
        }
    }

    handleSaveNewSpecialty = async () => {
        let res = await createNewSpecialtyService(this.state);
        if (res && res.errCode === 0) {
            toast.success("Create new scpecialty successfully!");
        } else {
            toast.error("Create fail, something wrong...");
        }
    }

    render() {
        let { imageSelected } = this.state;
        return (
            <div className="specialty-manage-container">
                <div className="specialty-manage-title">
                    Quản lý chuyên khoa
                </div>
                <div className="required-information">
                    <div className="row">
                        <div className="specialty-name-section col-9 form-group">
                            <label>Tên chuyên khoa</label>
                            <input className="form-control" type="text" value={this.state.name}
                                onChange={(event) => this.handleOnchangeInput(event, 'name')}>

                            </input>
                        </div>
                        <div className="specialty-image-section col-3 form-group">
                            <label className="name">Ảnh của chuyên khoa</label>
                            <input
                                id="customFileInput"
                                className="form-control-file"
                                type="file"
                                onChange={(event) => this.handleOnChangeImage(event)}
                            ></input>
                            {imageSelected &&
                                <div className="image-preview image-css"
                                    style={{ backgroundImage: `url(${this.state.imageBase64})` }}
                                    onClick={() => this.openImagePreview()}
                                ></div>
                            }

                            <label htmlFor="customFileInput" className="custom-file-label">
                                Chọn tệp
                            </label>

                        </div>
                        <div className="specialty-description-section col-12">
                            <MdEditor style={{ height: '500px' }}
                                renderHTML={text => mdParser.render(text)}
                                onChange={this.handleEditorChange}
                                value={this.state.markdownDescription}
                            />
                        </div>
                        <div className="col-9 form-group"></div>
                        <div className="col-3 form-group">
                            <button
                                className="save-button"
                                onClick={() => this.handleSaveNewSpecialty()}
                            >Thêm mới</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SpecialtyManage);
