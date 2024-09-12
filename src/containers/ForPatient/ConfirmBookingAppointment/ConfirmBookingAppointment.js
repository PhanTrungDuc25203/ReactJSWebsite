import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import HomePageHeader from '../../HomePage/HomePageHeader/HomePageHeader';
import './ConfirmBookingAppointment.scss';
import HomeFooter from '../../HomePage/HomeFooter/HomeFooter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { } from '@fortawesome/free-solid-svg-icons';
import defaultAvatar from '../../../assets/images/default-avatar-circle.png'
import { LANGUAGES } from '../../../utils';
import { confirmBookingAppointmentService } from '../../../services/userService';

class ConfirmBookingAppointment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            confirmStatus: false,
            confirmFail: 0,
        }
    }

    async componentDidMount() {
        if (this.props.location && this.props.location.search) {
            let urlParams = new URLSearchParams(this.props.location.search);
            let token = urlParams.get('token');
            let doctorId = urlParams.get('doctorId');
            console.log("check param: ", token, doctorId);
            //cal api
            let res = await confirmBookingAppointmentService({
                token: token,
                doctorId: doctorId,
            })

            if (res && res.errCode === 0) {
                this.setState({
                    confirmStatus: true,
                    confirmFail: res.errCode,
                })
            } else {
                this.setState({
                    confirmStatus: true,
                    confirmFail: res && res.errCode ? res.errCode : -1,
                })
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    render() {
        let { confirmStatus, confirmFail } = this.state;
        return (
            <React.Fragment>
                <div>
                    {confirmStatus === false ?
                        <div>
                            Loading data...
                        </div>
                        :
                        <div>
                            {confirmFail === 0 ?
                                <div>Xác nhận thành công</div>
                                :
                                <div>Lịch hẹn đã tồn tại, bạn chỉ có thể đặt một lịch hẹn với bác sĩ</div>
                            }
                        </div>
                    }
                </div>
            </React.Fragment >
        );
    }
}

const mapStateToProps = state => {
    return {
        // systemMenuPath: state.app.systemMenuPath,
        // isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmBookingAppointment);
