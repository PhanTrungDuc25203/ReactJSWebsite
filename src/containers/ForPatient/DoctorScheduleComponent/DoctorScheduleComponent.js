import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './DoctorScheduleComponent.scss';
import { getAllUsersToDisplayInReact, createNewUserService, deleteUserService, editUserService } from '../../../services/userService';
import { emitter } from "../../../utils/emitter";
import doctorAvatar from '../../../assets/elite-doctor-image/WIN_20240627_15_03_06_Pro.jpg';
import defaultAvatar from '../../../assets/specialty-image/101627-co-xuong-khop.png';

class DoctorScheduleComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    state = {

    }

    async componentDidMount() {

    }


    render() {
        return (
            <div className="doctor-schedule-component">
                <div className="left-content">
                    <div className="avatar avatar-css"
                        style={{
                            backgroundImage: `url(${doctorAvatar})`
                        }}
                    >
                    </div>
                    <div className="doctor-information">
                        <div className="name">
                            Tiến sĩ, Bác sĩ chuyên khoa II Lê Quốc Việt
                        </div>
                        <div className="description">
                            Hơn 30 năm kinh nghiệm khám và điều trị các bệnh nội cơ xương khớp và 40 năm kinh nghiệm khám Nội tổng quát
                            Nguyên Phó Giám đốc Bệnh viện E
                            Bác sĩ nhận khám bệnh nhân từ 4 tuổi trở lên
                        </div>
                        <div className="address">
                            Hà Nội
                        </div>
                    </div>
                </div>
                <div className="right-content">
                    <div className="schedule">

                    </div>
                    <div className="available-timeframe">

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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorScheduleComponent);
