import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './PackageScheduleComponent.scss';
import { emitter } from "../../../utils/emitter";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import { LANGUAGES } from '../../../utils';
import DoctorScheduleSection from '../DetailDoctor/DoctorScheduleSection';
import { getAllExamPackageService } from '../../../services/userService';
import defaultAvatar from '../../../assets/images/default-avatar-circle.png';
import PackageScheduleSection from './PackageScheduleSection';

class PackageScheduleComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            packagerDetails: {},
        }
    }

    async componentDidMount() {
        let res = await getAllExamPackageService(this.props.packageId);
        if (res && res.errCode === 0) {
            this.setState({
                packagerDetails: res.infor[0],
            })
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log("check package data: ", this.state.packagerDetails);
    }

    extractFirstSection(htmlString) {
        // Tạo một element DOM tạm thời để phân tích HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlString;

        // Lấy tất cả các thẻ `<p>` bên trong HTML
        const children = tempDiv.children;

        let resultHTML = ''; // Kết quả HTML cần lấy
        let foundFirstStrong = false; // Biến để kiểm tra `<p><strong>` đầu tiên

        // Duyệt qua tất cả các phần tử con
        for (let child of children) {
            // Nếu gặp một thẻ <p> chứa <strong> và chưa tìm thấy <p><strong> đầu tiên
            if (child.tagName === 'P' && child.querySelector('strong')) {
                if (foundFirstStrong) {
                    // Nếu đã gặp `<p><strong>` đầu tiên rồi, thì dừng lại
                    break;
                }
                // Đánh dấu đã tìm thấy `<p><strong>` đầu tiên
                foundFirstStrong = true;
            }
            // Thêm phần tử HTML hiện tại vào kết quả
            resultHTML += child.outerHTML;
        }
        return resultHTML;
    }


    render() {
        let { packagerDetails } = this.state;
        let htmlDescription = packagerDetails.htmlDescription
            ? this.extractFirstSection(packagerDetails.htmlDescription)
            : '';
        let imageByBase64 = '';
        if (packagerDetails && packagerDetails.image) {
            imageByBase64 = Buffer.from(packagerDetails.image, 'base64').toString('binary');
        }

        return (
            <div className="package-schedule-component">
                {/* {packagerDetails.name} */}
                <div className="avatar-name-and-description">
                    <div className="avatar avatar-css"
                        style={{
                            backgroundImage: `url(${imageByBase64 ? imageByBase64 : defaultAvatar})`
                        }}
                    >
                    </div>
                    <div className="package-name-and-description">
                        <div dangerouslySetInnerHTML={{ __html: htmlDescription }} />
                    </div>
                </div>
                <div className="schedule-and-insurance">
                    <div className="schedule">
                        <PackageScheduleSection selectedPackageId={packagerDetails.id || -1} />
                    </div>
                    <div className="insurance">
                        đây là phần bảo hiểm
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PackageScheduleComponent);
